import Dispatcher from 'EventDispatcher'
import Loader from 'Loader'

window.geodrawer = {
  ready: function (callback) {
    Dispatcher.register('geocoder-loaded', function () {
      callback.call(this)
    })
    Loader.load()
  }
}
