import Dispatcher from 'EventDispatcher'

const Loader = {
  load: function () {
    console.info('geodrawer is ready')
    Dispatcher.emit('geocoder-loaded')
  }
}

export default Loader
