
        /**
         * @summary Map Types dictionary
         */
        geodrawer.MapTypes = {
            HYBRID: google.maps.MapTypeId.HYBRID,
            ROADMAP: google.maps.MapTypeId.ROADMAP,
            SATELLITE: google.maps.MapTypeId.SATELLITE,
            TERRAIN: google.maps.MapTypeId.TERRAIN
        }

        /**
         * @summary Google maps drawing class, provides tools for drawing over a google map instance, and export drawed data.
         * @classdesc <p>This class handles the drawing tools used to draw over a google map and allows the drawed data exportation.</p>
         *            <p>The map manages also some controllers</p>
         *            <ul>
         *            <li>clear map controller</li>
         *            <li>export map controller</li>
         *            <li>geocoder text field controller</li>
         *            <li>tips controller</li>
         *            </ul>
         *            <p>Moreover every drawing tool has its own controller, which may be specifically set or used in its default form.</p>
         *            <p>Each map controller may be specified custom, may be removed setting the related option to <code>null</code> or used in its default form.</p>
         *            <p>Once instantiated the class and set the tools by options or instantiating direclty the drawing tool classes and adding them to the map,
         *            see {@link geodrawer.Map#addTool}, call the render method to render the widget.<br />
         *            Then it is possible to continue configuring the widget adding or removing tools,
         *            customizing the google map instance which is returned by the {@link geodrawer.Map#gmap} method.</p>
         *            <p>When defining specific map controllers, be sure to make them handle the proper map methods.</p>
         *            <p>Very important: be sure to load the google maps library yourself in the head of the document!</p>
         *
         * @constructs geodrawer.Map
         * @param {Element|String} canvas The map container element as selector or jQuery element
         * @param {Object} [options] A class options object
         * @param {Array} [options.center=new Array(45, 7)] The initial map center coordinates, (lat, lng).
         * @param {Number} [options.zoom=8] The the initial map zoom level.
         * @param {Object} [options.tools={}] The object containing the tool's names and optionsa to be activated when initializing the map.
         *                                    It's a shortcut to easily define set and active tools objects.
         * @param {Object} [options.tools.point=undefined] The point tool init object
         * @param {String|Element} [options.tools.point.ctrl=undefined] The id attribute or the element itself which controls the tool, default the built-in menu voice
         * @param {Object} [options.tools.point.options=undefined] The tool options object, see {@link geodrawer.PointTool} for available properties
         * @param {Object} [options.tools.polyline=undefined] The polyline tool init object
         * @param {String|Element} [options.tools.polyline.ctrl=undefined] The id attribute or the element itself which controls the tool, default the built-in menu voice
         * @param {Object} [options.tools.polyline.options=undefined] The tool options object, see {@link geodrawer.PolylineTool} for available properties
         * @param {Object} [options.tools.polygon=undefined] The polygon tool init object
         * @param {String|Element} [options.tools.polygon.ctrl=undefined] The id attribute or the element itself which controls the tool, default the built-in menu voice
         * @param {Object} [options.tools.polygon.options=undefined] The tool options object, see {@link geodrawer.PolygonTool} for available properties
         * @param {Object} [options.tools.circle=undefined] The circle tool init object
         * @param {String|Element} [options.tools.circle.ctrl=undefined] The id attribute or the element itself which controls the tool, default the built-in menu voice
         * @param {Object} [options.tools.circle.options=undefined] The tool options object, see {@link geodrawer.CircleTool} for available properties
         * @param {String|Element} [options.clear_map_ctrl='default'] The clear map controller (clears all drawings over the map).
         *                                                    If 'default' the built-in controller is used, if <code>null</code> the clear map
         *                                                    functionality is removed. If id attribute or an element the clear map functionality is attached to the element.
         * @param {String|Element} [options.export_map_ctrl='default'] The export map controller (exports all shapes drawed over the map).
         *                                                     If 'default' the built-in controller is used, if <code>null</code> the export map
         *                                                     functionality is removed. If id attribute or an element the clear map functionality is attached to the element.
         * @param {Function} [options.export_map_callback=null] The callback function to call when the export map button is pressed. The callback function receives one argument, the exported data as
         *                                                      returned by the ajs.maps.gmapdraw.map#exportMap method.
         * @param {Boolean} [options.geocoder_map_field=true] Whether or not to add the gecoder functionality which allows to center the map in a point defined through an address, or to
         *                                            pass the lat,lng coordinates found to the map click handlers (exactly as click over the map in a lat,lng point).
         * @param {String|Element} [options.tips_map_ctrl='default'] The help tips map controller (shows tips about drawing tools).
         *                                                     If 'default' the built-in controller is used, if <code>null</code> the tips box is not shown,
         *                                                     if id attribute or an element the functionality is attached to the element.
         *
         * @example
         * var mymap = new geodrawer.Map('my_map_canvas_id', {
         *     tools: {
         *         point: {
         *             options: {
         *                 max_items: 5
         *             }
         *         },
         *         circle: {}
         *     }
         * });
         *
         */
        geodrawer.Map = function (canvas, options) {
            // default options
            var _dftOpts = {
                center: [45, 7],
                zoom: 8,
                tools: {},
                clearMapCtrl: 'default',
                exportMapCtrl: 'default',
                exportMapCallback: null,
                geocoderMapField: true,
                tipsMapCtrl: 'default'
            }

            this._init = function (canvas, options) {
                this._canvas = $(canvas);
                if (!canvas.length) {
                    throw new Error('Canvas container not found!');
                }

                this._options = $.extend({}, _dftOpts, options);

                this._supportedTools = [
                    'point',
                    'polyline',
                    'polygon',
                    'circle'
                ]

                // internal state
                this._state = {
                    drawingTool: null, // actual drawing tool
                    tools: [] // available tools
                }

                this._map = null;
                // controllers
                this._ctrlContainer = null;
                this._controllers = {
                    clearMap: null,
                    clearMapEvent: null,
                    exportMap: null,
                    exportMapEvent: null,
                    tipsMap: null,
                    geocoder: null,
                    geocoderField: null,
                    geocoderCenterButton: null,
                    geocoderDrawButton: null
                }

                // check options!
                this._processOptions();
            };

            /**
             * Processes the options object setting properly some class properties
             * @return void
             */
            this._processOptions = function () {
                // init tools
                var self = this;
                $.each(this._supportedTools, function (index, tool_name) {
                    if (self._options.tools.hasOwnProperty(tool_name)) {
                        var handler = null;
                        var ctrl = self._options.tools[tool_name].ctrl || null;
                        // set tool
                        if(ctrl) {
                            handler = $(ctrl);
                            if(!handler.length) {
                                throw new Error('The given control handler for the ' + tool_name + ' tool is not a DOM element');
                            }
                        }
                        // add the tool
                        self.addTool(new geodrawer[tool_name + 'Tool'](self, handler, self._options.tools[tool_name].options || null));
                    }
                });
            };

            /**
             * @summary Adds a drawing tool
             * @memberof geodrawer.Map.prototype
             * @param {geodrawer.Tool} tool The tool object
             * @return void
             */
            this.addTool = function (tool) {
                if (!(tool instanceof geodrawer.tool)) {
                    throw new Error('The given tool object is not of the proper type');
                }

                if(this._supportedTools.indexOf(tool.getToolName()) === -1) {
                    throw new Error('The given tool is not supported');
                }
                this.state._tools[tool.getToolName()] = tool;
            },

            this._init(canvas, options);
        }

