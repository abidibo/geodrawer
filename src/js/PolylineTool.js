import Tool from 'Tool'

/**
 * @summary Google maps drawing polyline tool class. Provides methods to draw over the {@link geodrawer.Map} instance
 * @classdesc <p>The polyline drawing tool class, which allows to draw polylines over the gmapdraw map instance.</p>
 * @constructs geodrawer.PolylineTool
 * @extends geodrawer.Tool
 * @param {geodrawer.Map} map The map instance which handles the tool
 * @param {String|Object} ctrl The selector or jQuery element which controls the tool when clicking over it
 * @param {Object} options A class options object
 * @param {Number} [options.maxItemsAllowed=1] The maximum number of shapes the tool may draw.
 *
 */
export default class PolylineTool extends Tool {

  constructor (map, ctrl, options) {
    super(map, ctrl, 'polyline')

    this._activePolylineIndex = null
    this._options = jQuery.extend({}, this._options, options)
  }

  /**
   * @summary Returns the tool help tip text
   * @memberof geodrawer.PolylineTool.prototype
   * @return {String} The tips text
   */
  tipsText () {
    return 'Click on the map to add polyline points, click the menu voice again to create a new polyline. ' +
           'Right click on existing polylines to delete them'
  }

  /**
   * @summary Prepares the tool
   * @memberof geodrawer.PolylineTool.prototype
   * @return void
   */
  prepareTool () {
    super.prepareTool()
    this._nextShape = true
  }

  /**
   * @summary Handles the click event over the map when the tool is the drawing one
   * @memberof geodrawer.PolylineTool.prototype
   * @return void
   */
  clickHandler (evt) {
    // if next shape && maximum shape number is not reached
    if (this._nextShape && this._state.items.length < this._options.maxItemsAllowed) {
      let polylinePath = new google.maps.MVCArray([evt.latLng]) // store the point of the polyline
      let polyline = new google.maps.Polyline({
        editable: true,
        path: polylinePath,
        map: this._map.gmap()
      })

      let polylineItem = {
        path: polylinePath,
        shape: polyline
      }
      this._state.items.push(polylineItem)
      this._activePolylineIndex = this._state.items.indexOf(polylineItem)

      // right click to delete one
      google.maps.event.addListener(polyline, 'rightclick', () => {
        polyline.setMap(null)
        this._state.items.splice(this._state.items.indexOf(polylineItem), 1)
        this._activePolylineIndex-- // one item has been removed, indexes shift down
        this._nextShape = true // otherwise next click will populate the last polyline
      })

      this._nextShape = false
    } else if (this._nextShape) {
      // maximum number exceeded
      console.info('maximum number of polylines reached')
      alert('Maximum number of insertable polylines reached')
      return null
    } else {
      // add a point to the current polyline
      this._state.items[this._activePolylineIndex].path.push(evt.latLng)
    }
  }

  /**
   * @summary Clears all polylines
   * @memberof geodrawer.PolylineTool.prototype
   * @return void
   */
  clear () {
    this._state.items.forEach((polyline) => {
      polyline.shape.setMap(null)
    })
    this._state.items = []
    console.info('polylines cleared')
  }

  /**
   * @summary Returns all the drawn polylines data
   * @memberof geodrawer.PolylineTool.prototype
   * @return {Array} data An array of arrays of objects representing the polylines' points coordinates
   * @example
   *    // two polylines, the first with 2 points, the second with 3 points.
   *    [[{lat: 45, lng:7}, {lat:46, lng:7}], [{lat: 42, lng: 11}, {lat: 41, lng: 10.8}, {lat: 44, lng: 8}]]
   */
  exportData () {
    let data = this._state.items.map((polyline) => {
      let darr = []
      polyline.path.forEach((point, index) => {
        darr.push({lat: point.lat(), lng: point.lng()})
      })
      return darr
    })

    return data
  }

  /**
   * @summary Imports the data as polylines
   * @memberof geodrawer.PolylineTool.prototype
   * @param {Array} data An array of arrays of objects representing the polylines' points coordinates
   */
  importData (data) {
    for (let i = 0; i < data.length; i++) {
      let polyline = data[i]
      this.prepareTool()
      for (let ii = 0; ii < polyline.length; ii++) {
        let point = polyline[ii]
        this.clickHandler({latLng: new google.maps.LatLng(point.lat, point.lng)})
      }
    }
  }

  /**
   * @summary Extends the map bounds to fit the polylines
   * @memberof geodrawer.PolylineTool.prototype
   * @param {google.maps.LatLngBounds} [bounds] the LatLngBounds object
   */
  extendBounds (bounds) {
    this._state.items.forEach((polyline) => {
      polyline.path.forEach((point, index) => {
        bounds.extend(point)
      })
    })
  }

}
