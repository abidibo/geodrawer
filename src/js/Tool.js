import {sprintf} from 'utils'

/**
 * @summary Google maps drawing tool class.
 * @classdesc <p>This class is the superclass for all tools, extended by all specific tools.</p>
 *            <p><b>DO NOT INSTANTIATE THIS CLASS DIRECLTY</b>, use its children instead.</p>
 * @constructs geodrawer.Tool
 * @param {geodrawer.Map} map The Map instance which handles the tool
 * @param {String|Element} ctrl The selector or the element itself which controls the tool when clicking over it
 * @param {String} toolName The drawing tool name
 *
 */
export default class {

  constructor (map, ctrl, toolName) {
    this._state = {
      active: false,
      items: [] // array storing all the drawed items
    }
    this._map = null
    this._ctrl = null
    // store the ctrl given, will be used when the tool is activated.
    this._ctrlParam = ctrl
    this._toolName = null

    this._map = map
    this._toolName = toolName

    // next click has to begin a new shape?
    this._nextShape = false

    this._options = {
      maxItemsAllowed: 1
    }
  }

  /**
   * @summary Sets the tool controller
   * @memberof geodrawer.Tool.prototype
   * @param {String/Element} [ctrl=null]
   *    The selector or jQuery element which serves as the tool controller,
   *    if <code>null</code> the default controller is used.
   * @return void
   */
  _setController (ctrl) {
    if (ctrl) {
      this._ctrl = jQuery(ctrl)
      if (!this._ctrl.length) {
        throw new Error(sprintf('the given ctrl for the {0} tool is not a DOM element', this._toolName))
      }
    } else {
      // default
      this._ctrl = jQuery('<div />', {
        'class': 'geodrawer-ctrl-' + this._toolName + '-tool',
        title: this._toolName + ' tool'
      })
      this._map.addDefaultCtrl(this._ctrl)
    }
  }

  /**
   * @summary Removes the default tool controller
   * @memberof geodrawer.Tool.prototype
   * @return void
   */
  _removeController () {
    this._ctrl.remove()
    this._ctrl = null
  }

  // PUBLIC METHODS (to be intended as public ;)

  /**
   * @summary Returns the tool name
   * @memberof geodrawer.Tool.prototype
   * @return {String} The tool name
   */
  getToolName () {
    return this._toolName
  }

  /**
   * @summary Adds an item to the items
   * @memberof geodrawer.Tool.prototype
   * @param {Object} item a google map shape
   * @return void
   */
  addItem (item) {
    this._state.items.push(item)
  }

  /**
   * @summary Sets the maximum number of items that the tool may draw
   * @memberof geodrawer.Tool.prototype
   * @param max The maximum number of drawable items
   * @return void
   */
  setMaxItemsAllowed (max) {
    this._options.maxItemsAllowed = parseInt(max, 10)
  }

  /**
   * @summary Sets the value of the next shape property (a new click starts a new shape if true)
   * @memberof geodrawer.Tool.prototype
   * @param enable Whether or not next click has to start a new shape
   * @return void
   */
  setNextShape (enable) {
    this._nextShape = !!enable
  }

  /**
   * @summary Activates the tool
   * @memberof geodrawer.Tool.prototype
   * @return void
   */
  activate () {
    this._state.active = true

    this._setController(this._ctrlParam)

    this._ctrl.on('click', this.setDrawing.bind(this))
    this._ctrl.removeClass('geodrawer-ctrl-inactive')
    this._ctrl.addClass('geodrawer-ctrl-active')

    console.info(sprintf('geodrawer: {0} tool activated', this._toolName))
  }

  /**
   * @summary Removes the tool
   * @memberof geodrawer.Tool.prototype
   * @param {Boolean} [removeCtrl=false] Whether or not to remove the tool control if the default one
   * @return void
   */
  deactivate (removeCtrl = false) {
    if (this._state.active) {
      this._state.active = false
      this._ctrl.removeClass('geodrawer-ctrl-active')
      this._ctrl.addClass('geodrawer-ctrl-inactive')
      // @TODO check me!
      this._ctrl.off('click', null, this.setDrawing)

      if (this._map.getDrawingTool() === this) {
        this._map.setDrawingTool(null)
      }

      if (removeCtrl && this._ctrlParam == null) {
        this._removeController()
      }

      console.info(sprintf('{0} tool deactivated', this._toolName))
    } else {
      if (removeCtrl && this._ctrlParam === null) {
        this._removeController()
      }
      console.info(sprintf('{0} tool already deactivated', this._toolName))
    }
  }

  /**
   * @summary Sets the current drawing tool
   * @memberof geodrawer.Tool.prototype
   * @return void
   */
  setDrawing () {
    this.prepareTool()
    this._map.updateTips(this.tipsText())
    console.info('geodrawer: drawing tool: ' + this._toolName)
    this._map.setDrawingTool(this)
  }

  /**
   * @summary Prepares the current drawing tool
   * @description Empty because at the moment has to do nothing, but it's a place where some things
   *              can be done in the future, I suppose.
   * @memberof geodrawer.Tool.prototype
   * @return void
   */
  prepareTool () {}

  /**
   * @summary Sets the css selected class
   * @memberof geodrawer.Tool.prototype
   * @return void
   */
  setSelected () {
    this._ctrl.addClass('geodrawer-selected')
  }

  /**
   * @summary Removes the css selected class
   * @memberof geodrawer.Tool.prototype
   * @return void
   */
  setUnselected () {
    this._ctrl.removeClass('geodrawer-selected')
  }
}
