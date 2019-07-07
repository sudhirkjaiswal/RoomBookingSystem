define(["dojo/_base/Deferred",
		"dojo/_base/lang",
		"dojo/dom-construct",
		'dijit/registry',
		'dojo/request',
		'jasu/common/Toolkit',
		'dojo/data/ItemFileWriteStore',
		"gridx/Grid",
		"gridx/core/model/cache/Sync",
		"gridx/modules/IndirectSelect",
		"gridx/modules/RowHeader",
		"gridx/modules/ColumnResizer",
		"gridx/modules/ToolBar",
		"gridx/modules/extendedSelect/Row",
		"gridx/modules/SingleSort",
		"gridx/modules/CellWidget",
		"gridx/modules/Focus",
		"gridx/modules/Filter",
		"gridx/modules/filter/FilterBar",
		"gridx/modules/NestedSort",
		"gridx/core/model/extensions/FormatSort",
		"dijit/Dialog",
		'dijit/form/ValidationTextBox',
		'dijit/form/Select',
		'dijit/form/Textarea'
		],
		function(Deferred,Lang,Construct,_registry,request,Toolkit,Memory,Grid,Cache,IndirectSelect,RowHeader,ColumnResizer,ToolBar,ExtendedSelectRow,SingleSort,CellWidget,Focus,Filter,FilterBar,NestedSort,FormatSort){
			return {
				init:init,
				createTable:_createTable,
			}
			function init(_url){
				//console.log(_url);
				request.get(_url,{handleAs:'json'}).then(
					    function(obj){
					    	var _container=_registry.byId('mainContainer');
							dojo.forEach(_container.getChildren(),function(child){
								child.destroyRendering();			
							});
							dojo.empty(_container.containerNode);
							_createTable(_container,obj);
					    },
					    function(error){
					    	console.log(error);
					    }
					);
			}
			function _createTable(_container,_json){
				try{
					var store = new Memory({data:  {
					      identifier: _json.key,
					      items: []
				    }});

					var managerGrid = new Grid({
			        store: store,
			        cacheClass: Cache,
			        structure: _json.layout,
			        modules: [
			        	ToolBar,
			        	ColumnResizer, 
			        	{moduleClass :ExtendedSelectRow,triggerOnCell : true},
			        	RowHeader,IndirectSelect,
			        	Focus,Filter,FilterBar,NestedSort
			        ],
			        modelExtensions: [
			        	FormatSort
					]});
					if(_json.name)
						_createManagerHeader(managerGrid,_json.name,_json.iconClass);
					if(_json.tools)
					_createManagerTools(managerGrid,_json.manager,_json.tools);
					
					_container.addChild(managerGrid);
					managerGrid.startup();
					_container.resize({});
				}catch(e){
					console.log(e);
				}
			}
			function _createManagerHeader(grid,_name,_icon){
				Construct.create("span",{class:_icon,style:' float: left;margin-right: 5px;'},grid.toolBar.domNode)
				Construct.create("div",{innerHTML:_name,style:'float:left;color: #00679e;font-size: 25px;font-weight: bolder;padding-right: 50px;'},grid.toolBar.domNode);
			}
			function _createManagerTools(grid,_manger,_tools){
				var toolBar=grid.toolBar.widget;
				var _actions=Jasu.manager[_manger];
				
				for(var i=_tools.length-1;i>=0;i--){
					var _opt={style:'float:right'};
					if(_tools[i].iconClass)
						_opt.iconClass=_tools[i].iconClass;
					if(_tools[i].name)
						_opt.label=_tools[i].name;
					if(_actions)
						_opt.onClick=_actions[_tools[i].action]||function(){console.log("not supporting..");}
					
					var _button = new dijit.form.Button(_opt);
					toolBar.addChild(_button);
				}
			}
});