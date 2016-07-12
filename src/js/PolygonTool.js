import Tool from 'Tool'

/**
 * Google maps drawing polygon tool class. Provides methods to draw over the {@link Map} instance
 *
 * <p>The polygon drawing tool class, which allows to draw polygons over the gmapdraw map instance.</p>
 * @extends geodrawer.Tool
 */
const PolygonTool = class extends Tool {
  /*
   * Constrcuts a polygon tool
   *
   * @param {Map} map The map instance which handles the tool
   * @param {String|Object} ctrl The selector or the jQuery element which controls the tool when clicking over it,
   *                        set to null to have the default controller
   * @param {Object} options A class options object
   * @param {Number} [options.maxItemsAllowed=1] The maximum number of shapes the tool may draw.
   */
  constructor (map, ctrl, options) {
    super(map, ctrl, 'polygon')

    this._state.activePolygonIndex = null
    this._options = jQuery.extend({}, this._options, options)
  }

  /**
   * @summary Returns the tool help tip text
   * @return {String} The tips text
   */
  tipsText () {
    return 'Click on the map to add polygon\'s vertices, click the menu voice again to create a new shape.' +
           ' Right click on existing polygons to delete them.'
  }

  /**
   * @summary Prepares the tool
   * @return void
   */
  prepareTool () {
    super.prepareTool()
    this._nextShape = true
  }

  /**
   * @summary Handles the click event over the map when the tool is the drawing one
   * @param {google.maps.MouseEvent} evt
   * @return void
   */
  clickHandler (evt) {
    // if next shape && maximum shape number is not reached
    if (this._nextShape && this._state.items.length < this._options.maxItemsAllowed) {
      let polygonPath = new google.maps.MVCArray([evt.latLng]) // store the point of the polyline
      let polygon = new google.maps.Polygon({
        editable: true,
        path: polygonPath,
        map: this._map.gmap()
      })

      let polygonItem = {
        path: polygonPath,
        shape: polygon
      }
      this._state.items.push(polygonItem)
      this._state.activePolygonIndex = this._state.items.indexOf(polygonItem)

      // right click to delete one
      google.maps.event.addListener(polygon, 'rightclick', () => {
        polygon.setMap(null)
        this._state.items.splice(this._state.items.indexOf(polygonItem), 1)
        this._state.activePolygonIndex-- // one item has been removed, indexes shift down
        this._nextShape = true // otherwise next click will populate the last polyline
      })

      this._nextShape = false
    } else if (this._nextShape) {
      // maximum number exceeded
      console.info('maximum number of polygons reached')
      alert('Maximum number of insertable polygons reached')
      return null
    } else {
      // add a point to the current polyline
      this._state.items[this._state.activePolygonIndex].path.push(evt.latLng)
    }
  }

  /**
   * @summary Clears all polygons
   * @return void
   */
  clear () {
    this._state.items.forEach((polygon) => {
      polygon.shape.setMap(null)
    })
    this._state.items = []
    this._state.activePolygonIndex = null
    this._nextShape = true
    console.info('polygons cleared')
  }

  /**
   * @summary Returns all the drawn polygons data
   * @return {Array} data An array of arrays of objects representing the polygons' vertex coordinates
   * @example
   *    // exported data, two polygons, the first with 3 vertexes, the second with 4 vertexes.
   *    [[{lat: 45, lng:7}, {lat:46, lng:7}, {lat: 42, lng: 11}],
   *     [{lat: 42, lng: 11}, {lat: 41, lng: 10.8}, {lat: 44, lng: 8}, {lat: 33, lng: 12}]]
   */
  exportData () {
    let data = this._state.items.map((polygon) => {
      let darr = []
      polygon.path.forEach((point, index) => {
        darr.push({lat: point.lat(), lng: point.lng()})
      })
      return darr
    })

    return data
  }

  /**
   * @summary Imports the data as polygons
   * @param {Array} data An array of arrays of objects representing the polygons' vertex coordinates
   */
  importData (data) {
    for (let i = 0; i < data.length; i++) {
      var polygon = data[i]
      this.prepareTool()
      for (var ii = 0; ii < polygon.length; ii++) {
        let point = polygon[ii]
        this.clickHandler({latLng: new google.maps.LatLng(point.lat, point.lng)})
      }
    }
  }

  /**
   * @summary Extends the map bounds to fit the polygons
   * @param {google.maps.LatLngBounds} [bounds] the LatLngBounds object
   */
  extendBounds (bounds) {
    this._state.items.forEach((polygon) => {
      polygon.path.forEach((point, index) => {
        bounds.extend(point)
      })
    })
  }
}

export default PolygonTool
