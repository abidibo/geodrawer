import Dispatcher from 'EventDispatcher'

/**
 * Library loader
 *
 * <p>This library requires google maps API v3 and jQuery, this loader assures that google maps API
 * are available and loads jQuery from cdn if not already loaded in the document. When requirements
 * are satisfied the callback passed to the {@link geodrawer#ready} method is invoked</p>
 * @namespace
 */
const Loader = {
  /**
   * Loads the library and emits an event when loaded
   * The event emitted is 'geodrawer-loaded'
   * @memberof Loader
   */
  load: function () {
    this.checkGoogleMapsApi()
    this.requirejQuery(() => {
      console.info('geodrawer: library is ready')
      Dispatcher.emit('geodrawer-loaded')
    })
  },
  /**
   * Checks if the google maps API is loaded
   * @memberof Loader
   */
  checkGoogleMapsApi: function () {
    if (!(typeof window.google === 'object' && typeof window.google.maps === 'object')) {
      console.info('geodrawer: Google Maps API must be loaded at this point!')
      throw new Error('Google Maps API are not loaded yet!')
    }
  },
  /**
   * Checks if jQuery is loaded, if not loads it, and then execute the cb
   * @memberof Loader
   * @param {Function} then callback to execute after jQuery is fully loaded
   */
  requirejQuery (then) {
    if (window.jQuery === undefined) {
      console.info('geodrawer: loading jQuery')
      let script = document.createElement('script')
      script.type = 'text/javascript'
      if (script.readyState) {  // IE
        script.onreadystatechange = function () {
          if (script.readyState === 'loaded' || script.readyState === 'complete') {
            script.onreadystatechange = null
            then.call(this)
          }
        }
      } else {  // Others
        script.onload = function () {
          then.call(this)
        }
      }
      script.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.0.0/jquery.min.js'
      document.getElementsByTagName('head')[0].appendChild(script)
    } else {
      then()
    }
  }
}

export default Loader
