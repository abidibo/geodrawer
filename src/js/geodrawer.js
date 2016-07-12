import Dispatcher from 'EventDispatcher'
import Loader from 'Loader'
import Map from 'Map'
import PointTool from 'PointTool'
import PolylineTool from 'PolylineTool'
import PolygonTool from 'PolygonTool'
import CircleTool from 'CircleTool'

require('../scss/base.scss')

window.geodrawer = {
  ready: function (callback) {
    Dispatcher.register('geocoder-loaded', function () {
      callback.call(this)
    })
    Loader.load()
  },
  Map: Map,
  PointTool: PointTool,
  PolylineTool: PolylineTool,
  PolygonTool: PolygonTool,
  CircleTool: CircleTool
}

export default window.geodrawer
