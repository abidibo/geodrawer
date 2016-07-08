import Tool from 'Tool'

/**
 * @summary Google maps drawing point tool class. Provides methods to draw over the {@link geodrawer.Map} instance
 * @classdesc <p>The point drawing tool class, which allows to draw points over the gmapdraw map instane.</p>
 * @constructs geodrawer.PointTool
 * @extends geodrawer.Tool
 * @param {geodrawer.Map} map The map instance which handles the tool
 * @param {String|Object} ctrl The selector or jQuery element which controls the tool when clicking over it
 * @param {Object} options A class options object
 * @param {Number} [options.max_items_allowed=1] The maximum number of shapes the tool may draw
 *
 */
export default class PointTool extends Tool {
  constructor (map, ctrl, options) {
    super(map, ctrl, 'point')
    console.log(this._options)
    console.log(options)
    this._options = jQuery.extend({}, this._options, options)
    console.log(this._options)
  }

  /**
   * @summary Returns the tool help tip text
   * @memberof geodrawer.PointTool.prototype
   * @return {String} The tips text
   */
  tipsText () {
    return 'Click on the map to set draggable markers points. Right click on a marker to delete it'
  }

  /**
   * @summary Handles the click event over the map when the tool is the drawing one
   * @memberof geodrawer.PointTool.prototype
   * @return void
   */
  clickHandler (evt) {
    // maximum number of points reached
    if (this._state.items.length >= this._options.maxItemsAllowed) {
      console.info('geodrawer: maximum number of points drawed')
      alert('Maximum number of insertable points reached')
      return null
    }

    let marker = new google.maps.Marker({
      position: evt.latLng,
      draggable: true,
      map: this._map.gmap()
    })

    this._state.items.push(marker)

    let self = this
    google.maps.event.addListener(marker, 'rightclick', () => {
      marker.setMap(null)
      self._state.items.splice(this._state.items.indexOf(marker), 1)
    })

    console.info('geodrawer: point drawn')
  }

  /**
   * @summary Clears all drawed points
   * @memberof geodrawer.PointTool.prototype
   * @return void
   */
  clear () {
    this._state.items.forEach((marker) => {
      marker.setMap(null)
    })
    this._state.items = []
    console.info('points cleared')
  }

  /**
   * @summary Returns all the drawed points data
   * @memberof geodrawer.PointTool.prototype
   * @return {Array} data An array of objects representing the drawed points coordinates
   * @example
   *    [{lat: 45, lng: 7}, {lat: 33, lng: 15}, {lat: 42, lng: 5}]
   */
  exportData () {
    let data = this._state.items.map(
      (marker) => ({
        lat: marker.getPosition().lat(),
        lng: marker.getPosition().lng()
      })
    )

    return data
  }

  /**
   * @summary Imports the data as points
   * @memberof geodrawer.PointTool.prototype
   * @param {Array} data An array of objects representing the points coordinates
   * @example
   *    [{lat: 45, lng: 7}, {lat: 33, lng: 15}, {lat: 42, lng: 5}]
   */
  importData (data) {
    for (let i = 0; i < data.length; i++) {
      let point = data[i]
      this.clickHandler({latLng: new google.maps.LatLng(point.lat, point.lng)})
    }
  }

  /**
   * @summary Extends the map bounds to fit the points
   * @memberof geodrawer.PointTool.prototype
   * @param {google.maps.LatLngBounds} [bounds] the LatLngBounds object
   */
  extendBounds (bounds) {
    this._state.items.forEach((marker) => {
      bounds.extend(marker.getPosition())
    })
  }

}
