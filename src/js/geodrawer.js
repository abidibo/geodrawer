import Dispatcher from 'EventDispatcher'
import Loader from 'Loader'
import Map from 'Map'
import PointTool from 'PointTool'
import PolylineTool from 'PolylineTool'
import PolygonTool from 'PolygonTool'
import CircleTool from 'CircleTool'

require('../scss/base.scss')

/**
 * <h2>geodrawer module</h2>
 *
 * <p>This is a global object, attached to the window object, it exports all the classes except from the Tool one.
 * Provides a ready method which receive as first argument the callback to invoke when the library is fully loaded</p>
 * <p>It is also exported as es2016 module.</p>
 *
 * @property {Map} Map {@link Map}
 * @property {PointTool} PointTool {@link PointTool}
 * @property {PolygonTool} PolylineTool {@link PolylineTool}
 * @property {PolygonTool} PolygonTool {@link PolygonTool}
 * @property {CircleTool} CircleTool {@link CircleTool}
 * @property {Loader} Loader {@link Loader}
 * @property {EventDispatcher} EventDispatcher {@link EventDispatcher}
 *
 * @module geodrawer
 */
window.geodrawer = {
  /**
   * Loads the library and executes the given callback only when the it is ready
   * @memberof module:geodrawer
   * @param {Function} callback
   * @return void
   */
  ready: function (callback) {
    Dispatcher.register('geodrawer-loaded', function () {
      callback.call(this)
    })
    Loader.load()
  },
  Map: Map,
  PointTool: PointTool,
  PolylineTool: PolylineTool,
  PolygonTool: PolygonTool,
  CircleTool: CircleTool,
  Loader: Loader,
  EventDispatcher: Dispatcher
}

export default window.geodrawer
