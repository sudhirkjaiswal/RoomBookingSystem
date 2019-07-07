require([
	"dojo/on",
	"dojo/dom", 
	"dojo/dom-style",
	'dojo/dom-geometry',
	"dojo/dom-class",
	"dojo/query",
	"dojo/_base/Deferred",
	"dojo/_base/lang",
	"dojo/dom-construct",
	'dijit/registry',
	'dojo/request',
	'dojo/aspect',
	"dojo/date/locale",
	'jasu/common/Toolkit',
	'dojo/data/ItemFileWriteStore',
	"gridx/Grid",
	"gridx/core/model/cache/Sync",
	"gridx/modules/IndirectSelect",
	"gridx/modules/RowHeader",
	"gridx/modules/ColumnResizer",
	"gridx/modules/ToolBar",
	"gridx/modules/select/Row",
	"gridx/modules/SingleSort",
	"gridx/modules/CellWidget",
	"gridx/modules/Focus",
	"gridx/modules/Filter",
	"gridx/modules/filter/FilterBar",
	"gridx/modules/NestedSort",
	"gridx/core/model/extensions/FormatSort",
	"gridx/modules/Pagination",
	"gridx/modules/pagination/PaginationBar",
	"dijit/Dialog",
	'dijit/form/ValidationTextBox',
	'dijit/form/Select',
	'dijit/form/Textarea',
	"dojox/form/Uploader",
	"dijit/ProgressBar",
	"dijit/layout/ContentPane",
	"dijit/layout/BorderContainer",
	"dijit/layout/TabContainer",
	"dojox/layout/ExpandoPane",
	"dijit/form/FilteringSelect",
	"dijit/Tree",
	"dijit/form/CheckBox",
	"gridx/modules/VirtualVScroller"
	],
		function(on,dom,domStyle,_coord,domClass,domQuery,Deferred,Lang,Construct,Registry,Request,Aspect,_Date,Toolkit,Memory,Grid,Cache,IndirectSelect,RowHeader,ColumnResizer,ToolBar,ExtendedSelectRow,SingleSort,CellWidget,Focus,Filter,FilterBar,NestedSort,FormatSort,Pagination,PaginationBar){
			var _ui={};
			
			dojo.extend(dijit.Tree, {
				refresh: function () {

					// reset the itemNodes Map
					this._itemNodesMap = {};

					// reset the state of the rootNode
					this.rootNode.state = "UNCHECKED";

					// Nullify the tree.model's root-children
					this.model.root.children = null;

					// remove the rootNode
					if (this.rootNode) {
						this.rootNode.destroyRecursive();
					}

					// reload the tree
					this._load();
				}
			});
			
			_ui.createDialog=function(_json){
				try{
					var dialog=new dijit.Dialog({
						//id:'wizardDialog',
						title:_json.title||'Reservation Window',
						style:_json.style ||'',
						_onKey:function(evt){
								if(evt.keyCode == dojo.keys.ESCAPE) {
									var confirmResult=confirm("Do you want to close this Window?");
									if(!confirmResult){
										return;
									}
								}
								this.inherited("_onKey",arguments);
						},
						onHide:function(){
							dojo.forEach(this.getChildren(),function(child){
								child.destroy();			
							});
							if(_json.cancelCallBack)
								_json.cancelCallBack();
						}		
					});
					
					return dialog;
				}catch(e){
					console.log(e);
				}
			}
			_ui.createTextBox=function(_container,_json){
				try{
					var _row=Construct.create("div",{style:'display: table-row;'},_container.containerNode);
					var _cell=new dijit.form.ValidationTextBox(_json);
					if(_json.require && _json.require==true)
						Construct.create("label",{class:'cell',for:_cell.id,innerHTML:_json.label+'<span class="indicator">&nbsp;</span>:'},_row);
					else
						Construct.create("label",{class:'cell',for:_cell.id,innerHTML:_json.label+':'},_row);
					_cell.placeAt(_row);
					return _cell;
				}catch(e){
					console.log(e);
				}
			}
			
			_ui.createSelect=function(_container,_json){
				try{
					var _row=Construct.create("div",{style:'display: table-row;'},_container.containerNode);
					var _cell=new dijit.form.Select(_json);
					if(_json.require && _json.require==true)
						Construct.create("label",{class:'cell',for:_cell.id,innerHTML:_json.label+'<span class="indicator">&nbsp;</span>:'},_row);
					else
						Construct.create("label",{class:'cell',for:_cell.id,innerHTML:_json.label+':'},_row);
					_cell.placeAt(_row);
					return _cell;
				}catch(e){
					console.log(e);
				}
			}
			_ui.createCheckBox=function(_container,_json){
				try{
					var _row=Construct.create("div",{style:'display: table-row;'},_container.containerNode);
					var _cell=new dijit.form.CheckBox(_json);
					if(_json.require && _json.require==true)
						Construct.create("label",{class:'cell',for:_cell.id,innerHTML:_json.label+'<span class="indicator">&nbsp;</span>:'},_row);
					else
						Construct.create("label",{class:'cell',for:_cell.id,innerHTML:_json.label+':'},_row);
					_cell.placeAt(_row);
					return _cell;
				}catch(e){
					console.log(e);
				}
			}
			_ui.createImg=function(_container,_json){
				try{
					var _row=Construct.create("div",{style:'display: table-row;'},_container.containerNode);
					Construct.create("label",{class:'cell',innerHTML:_json.label},_row);
					Construct.create("div",{style:'background-image: url("'+_json.url+'");height: '+_json.height+';width: '+_json.width+';',innerHTML:'&nbsp;'},_row);
				}catch(e){
					console.log(e);
				}
			}
			_ui.createMapView=function(_container,_json){
				console.log(_container,_container._contentBox);
				try{
					var _map=Construct.create("div",{style:'width: 1255px;height: 350px;position: absolute;top: 10px;left: 430px;'},_container.containerNode);
					
					    map = new Map(_map);
					    var ny = {
					    	      latitude : 12.9254873,
					    	      longitude : 77.6412545
					    	    };
					    // create a GfxLayer
					    var layer = new GfxLayer();
					    // create a Point geometry at New York location
					    var p = new Point({x:ny.longitude, y:ny.latitude});
					    // create a GeometryFeature
					    var f = new GeometryFeature(p);
					    // set the shape properties, fill and stroke
					    f.setFill([ 0, 128, 128 ]);
					    f.setStroke([ 0, 0, 0 ]);
					    f.setShapeProperties({
					      r : 20
					    });
					    // add the feature to the layer
					    layer.addFeature(f);
					    // add layer to the map
					    map.addLayer(layer);
					    // fit to New York with 0.1 degrees extent
					    map.fitTo({
					    position : [ ny.longitude, ny.latitude ],
					                 extent : 0.1
					    });
				}catch(e){
					console.log(e);
				}
			}
			_ui.createTextarea=function(_container,_json){
				try{
					var _row=Construct.create("div",{style:'display: table-row;'},_container.containerNode);
					var _cell=new dijit.form.Textarea(_json);
					if(_json.require && _json.require==true)
						Construct.create("label",{class:'cell',for:_cell.id,innerHTML:_json.label+'<span class="indicator">&nbsp;</span>:'},_row);
					else
						Construct.create("label",{class:'cell',for:_cell.id,innerHTML:_json.label+':'},_row);
					_cell.placeAt(_row);
					return _cell;
				}catch(e){
					console.log(e);
				}
			}
			
			_ui.createDateTime=function(_container,_json){
				var _row=Construct.create("div",{style:'display: table-row;'},_container.containerNode);
				
				if(_json.require && _json.require==true)
					Construct.create("label",{class:'cell',innerHTML:_json.label+'<span class="indicator">&nbsp;</span>:'},_row);
				else
					Construct.create("label",{class:'cell',innerHTML:_json.label+':'},_row);
				
				var _cell=Construct.create("div",{class:'datetime'},_row);
				var _cell1=new dijit.form.DateTextBox({name:_json.name,disabled:_json.disabled||false,value:_json.value||new Date(),constraints:{ min: new Date(), datePattern: 'dd-MM-yy'},placeHolder:'dd-MM-yy'});
				_cell1.placeAt(_cell);
				var _cell2=new dijit.form.TimeTextBox({disabled:_json.disabled||false,value:_json.value||new Date(),constraints:{min: new Date(),timePattern: 'HH:mm'}, placeHolder:'00:00'});
				_cell2.placeAt(_cell);
				
				_cell1.set("TimeComponent",_cell2);
				_cell1.set('type','DateTime');
				return _cell1;
				
			}
			_ui.createUploader=function(_container,_json){
				try{
					var _row=Construct.create("div",{style:'display: table-row;'},_container.containerNode);
					Construct.create("div",{class:'cell',innerHTML:''},_row);
					var _cell=new dojox.form.Uploader(_json);
					
					dojo.connect(_cell, "onComplete", function(dataArray){
						console.log("onComplete:", dataArray)
					});
					dojo.connect(_cell, "onChange", function(dataArray){
						dojo.forEach(dataArray, function(file){
							console.log("display:", file)
							var div = dojo.create('div', {className:'thumb',style:'width: 1255px;height: 350px;position: absolute;top: 10px;left: 430px;'});
							var span = dojo.create('span', {className:'thumbbk'}, div);
							var img = dojo.create('img', {src:"images/5g-networks.jpg"}, span);
							_row.appendChild(div);
						});
					});
					_cell.placeAt(_row);
					return _cell;
				}catch(e){
					console.log(e);
				}
			}
			
			_ui.createManagerTable=function(_container,cleanContainer,_metaURL,_dataURL){
				try{
					Request.get(_metaURL,{handleAs:'json'}).then(
					    function(_json){
					    	if(cleanContainer && cleanContainer==true)
							dojo.forEach(_container.getChildren(),function(child){
								child.destroyRendering();
								child.destroy();
							});
							dojo.empty(_container.containerNode);
							return _ui.createTable(_container,_json,_dataURL);
					    },
					    function(error){
					    	console.log(error);
					    }
					);
				}catch(e){
					console.log(e);
				}
			}
			_ui._statusFormatter=function(_data){
				if(_data=='Complete')
					return "<span style='color: green;'>"+_data+"</span>";
				else if(_data=='New')
					return "<span style='color: blue;'>"+_data+"</span>";
				else if(_data=='Pending')
					return "<span style='color: red;'>"+_data+"</span>";
			}
			_ui._statusDecorator=function(_data){
				return "<div data-dojo-type='dijit.ProgressBar' data-dojo-attach-point='progBar' data-dojo-props='maximum: 100,value:0' class='gridxHasGridCellValue' style='width: 100%;height: 18px;'></div>";
			}
			_ui._statusCellValue=function(gridData, storeData, cellWidget){
		    	cellWidget.progBar.set('value',storeData);
			}
			_ui.createSimpleTable=function(_json){
				//console.log(_json);
				try{
					var _structure=[];
					dojo.forEach(_json.structure,function(_col){
						if(!_col.igroreOnChild){
							_structure.push(_col);
							if(_col._decorator){
								if(_col._decorator=='DateTime'){
									_col.decorator=function(_data){
										if(_data!==null && _data!=undefined){
											var _d=_Date.format(new Date(_data),{
											    datePattern: "dd-MM-yyyy"
											  });
											return _d;
										}
									}
								}else if(_col._decorator.type=='link'){
									_col._linkId=_col._decorator.id;
									_col._linkDisplay=_col._decorator.display;
									_col.decorator=function(_data){
										if(_data!==null && _data!=undefined){
											if(typeof _data=='object')
												return "<a href=\"javascript:Reservation.manager.viewDialog('"+this.type+"','"+this.name+"','"+_data[this._linkId]+"')\">"+_data[this._linkDisplay]+"</a>";
											else
												return _data;
										}
									}
								}
							}
						}
					});
					var _table = new gridx.Grid({
						//id:_json.manager,
				        store: new dojo.store.Memory({data:  {
						      identifier: _json.key,
						      items: _json.data
					    }}),
				        cacheClass: "gridx/core/model/cache/Sync",
				        structure: _structure,
				        headerHidden: _json.headerHidden||false
			        });
					return _table;
				}catch(e){
					console.log(e)
				}
			}
			
			_ui.createTable=function(_container,_json,_dataURL){
				try{
					var store = new Memory({data:  {
					      identifier: _json.key,
					      items: []
				    }});
					var _structure=[];
					dojo.forEach(_json.layout,function(_col){
						if(!_col.ignoreOnManager){
							_structure.push(_col);
							if(_col.setCellValue){
								_col.setCellValue=_ui[_col.setCellValue];
							}
							if(_col._decorator){
								if(_col._decorator=='DateTime'){
									_col.decorator=function(_data){
										if(_data!==null && _data!=undefined){
											var _d=_Date.format(new Date(_data),{
											    datePattern: "dd-MM-yyyy"
											  });
											return _d;
										}
									}
								}else if(_col._decorator.type=='link'){
									_col._linkId=_col._decorator.id;
									_col._linkDisplay=_col._decorator.display;
									_col.decorator=function(_data){
										if(_data!==null && _data!=undefined){
											return "<a href=\"javascript:Reservation.manager.viewDialog('"+this.type+"','"+this.name+"','"+_data[this._linkId]+"')\">"+_data[this._linkDisplay]+"</a>";
										}
									}
								}
							}else if(_col.decorator){
								_col.decorator=_ui[_col.decorator];
							}
						}
					});
					var managerGrid = new Grid({
						id:_json.manager,
				        store: store,
				        cacheClass: Cache,
				        structure: _structure,
				        paginationInitialPageSize: 25,
				        selectRowTriggerOnCell: true,
				        selectRowMultiple : _json.selection?(_json.selection!='single'):true,
				        modules: [
				        	ToolBar,
				        	ColumnResizer, 
				        	ExtendedSelectRow,
				        	IndirectSelect,
				        	RowHeader,CellWidget,
				        	Focus,Filter,FilterBar,NestedSort,Pagination,PaginationBar,
				        	"gridx/modules/VirtualVScroller"
				        ],
				        modelExtensions: [
				        	FormatSort
			        ]});
					if(_json.name){
						Construct.create("span",{class:_json.iconClass,style:' float: left;margin-right: 5px;'},managerGrid.toolBar.domNode)
						Construct.create("div",{innerHTML:_json.name,style:'float:left;color: #00679e;font-size: 25px;font-weight: bolder;padding-right: 50px;'},managerGrid.toolBar.domNode);
					}
					
					if(_json.tools){
						var toolBar=managerGrid.toolBar.widget;
						var _actions=Reservation.manager[_json.manager];
						
						for(var i=_json.tools.length-1;i>=0;i--){
							if(_json.tools[i].show && _json.tools[i].show.indexOf(User.role)>-1){
								var _opt={style:'float:right'};
								if(_json.tools[i].iconClass)
									_opt.iconClass=_json.tools[i].iconClass;
								if(_json.tools[i].label)
									_opt.label=_json.tools[i].label;
								
								if(_json.tools[i].tooltip)
									_opt.tooltip=_json.tools[i].tooltip;
								if(_actions)
									_opt.onClick=_actions[_json.tools[i].action]||function(){console.log("not supporting..");}
								
								if(_json.tools[i].type=="Uploader"){
									_opt.name="upload";
									_opt.multiple=_json.tools[i].multiple || false;
									_opt.uploadOnSelect=_json.tools[i].uploadOnSelect || false;
									_opt.url=_json.tools[i].url;
									_opt.onComplete=_actions[_json.tools[i].onComplete] || function(){console.log("not supporting..");}
									toolBar.addChild(new dojox.form.Uploader(_opt));
								}else{
									toolBar.addChild(new dijit.form.Button(_opt));
								}
							}
						}
					}
					
					_container.addChild(managerGrid);
					managerGrid.startup();
					_container.resize({});
					if(_dataURL){
						Request.get(_dataURL,{handleAs:'json'}).then(
						    function(_dataJson){
						    	if(_dataJson.status){
							    	dojo.forEach(_dataJson.data,function(_data){
						    			managerGrid.store.newItem(_data);
							    	});
							    	managerGrid.store.save();
						    	}
						    },
						    function(error){
						    	console.log(error);
						    }
						);
					}
					return managerGrid;
				}catch(e){
					console.log(e);
				}
			}
			
	Lang.setObject('Reservation.UI',_ui);
});