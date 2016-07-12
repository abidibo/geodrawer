import Tool from 'Tool'

/**
 * Google maps drawing point tool class. Provides methods to draw points over the {@link Map} instance.
 *
 * @extends Tool
 */
const PointTool = class extends Tool {

  /**
   * Constructs a point tool
   *
   * @param {Map} map The map instance which handles the tool
   * @param {String|Object} ctrl The selector or jQuery element which controls the tool when clicking over it,
   *                        set to null to have the default controller
   * @param {Object} options A class options object
   * @param {Number} [options.max_items_allowed=1] The maximum number of shapes the tool may draw
   */
  constructor (map, ctrl, options) {
    super(map, ctrl, 'point')
    this._options = jQuery.extend({}, this._options, options)
  }

  /**
   * @summary Returns the tool help tip text
   * @return {String} The tips text
   */
  tipsText () {
    return 'Click on the map to set draggable markers points. Right click on a marker to delete it.'
  }

  /**
   * @summary Handles the click event over the map when the tool is the drawing one
   * @param {google.maps.MouseEvent} evt
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
   * @return {Array} data An array of objects representing the drawed points coordinates
   * @example
   *    // exported data
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
   * @param {Array} data An array of objects representing the points coordinates
   * @example
   *    // format of data to be imported
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
   * @param {google.maps.LatLngBounds} [bounds] the LatLngBounds object
   */
  extendBounds (bounds) {
    this._state.items.forEach((marker) => {
      bounds.extend(marker.getPosition())
    })
  }

}

export default PointTool
