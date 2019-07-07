/*
 * Source: tookit.js
 * Craete By:Sudhir Jaiswal
 * Created Date:17 MAY 2017
 */

define([
	"dojo/_base/lang",
	"dojo/dom-construct",
	'dijit/registry',
	'dojo/request',
	"dijit/Tooltip",
	"dojo/date/locale",
	"dojo/date/stamp",
	'jasu/common/Toolkit',
	"dijit/MenuBarItem",
	"dijit/PopupMenuBarItem",
	"dijit/MenuItem",
	"dijit/Menu",
	"dijit/MenuSeparator",
	"dijit/MenuBar",
	"dijit/tree/ObjectStoreModel"],function(lang,construct,registry,request,Tooltip,_Date,_stamp,Toolkit){
	return{
		createMenus:createMenus
	}
	function createMenus(_dom,_url,treeContainer,_role){
		_loadJson(_dom,_url,treeContainer,_role);
	}
	function _loadJson(_dom,_url,treeContainer,_role){
		request.get(_url,{handleAs:'json'}).then(
			    function(obj){
					_createMenus(_dom,obj,_role);
					_createMenuTree(treeContainer,obj,_role);
			    },
			    function(error){
			    	console.log(error);
			    }
			);
	}
	function _createMenuTree(treeContainer,_json,_role){
		try{
			var _store = new dojo.store.Memory({ data: [{id:"root",label:"root",subMenu:_json.menu}],
			getChildren: function(object){
				var _child=[];
				dojo.forEach(object.subMenu,function(_c){
					if(_c.show.indexOf(_role)>-1){
						if(_c.type!='MenuSeparator'){
							_child.push(_c);
						}
					}
				});
				return _child;
	        }});
			var _treeModel = new dijit.tree.ObjectStoreModel({
				store:_store,
				query: {id: "root"},
				labelAttr: "label",
		        mayHaveChildren: function(item){
		            return "subMenu" in item;
		        }
			});
			
			var _tree = new dijit.Tree({
		        title:'Reservation Tree',
		    	model: _treeModel,
		    	//id:'dataModelTreeContainer',
		    	showRoot:false,
		    	autoExpand: true,
		        getIconClass: function(item, opened){
					return item.iconClass;
		        },
		        onClick :function(_item){
					menuAction(_item);
		        }
		    });
			treeContainer.addChild(_tree);
		}catch(e){
			console.log(e);
		}
	}
	function _createMenus(menubar,_json,_role){
		if(menubar==undefined || _json==undefined){
			return;
		}
	
		dojo.forEach(_json.menu,function(menuItem){
			if(menuItem.show.indexOf(_role)>-1){
				if(menuItem.subMenu==null || menuItem.subMenu==undefined){
					menubar.addChild(new dijit.MenuBarItem({
						label:menuItem.label,
						//class:menuItem.class,
						iconClass:menuItem.iconClass,
						onClick:function(){
							menuAction(this);
						}
					}));
				}else{
					menubar.addChild(_createSubmenu(menuItem),_role);
				}
			}
		});
		
	}
	
	function _createSubmenu(menuItem,_role){
		try{
			
			var menu=new dijit.Menu({});
			dojo.forEach(menuItem.subMenu,function(item){
				if(item.show.indexOf(_role)>-1){
					if(item.type=='MenuSeparator'){
						menu.addChild(new dijit.MenuSeparator());
					}else{
						menu.addChild(new dijit.MenuItem({
							label:item.label,
							//class:menuItem.class,
							iconClass:item.iconClass,
							onClick:function(){
								menuAction(this);
							}
						}));
					}
				}
			});
			var popupmenu=new dijit.PopupMenuBarItem({
				label:menuItem.label,
				//class:menuItem.class,
				iconClass:menuItem.iconClass,
				popup:menu
			});
			return popupmenu;
		}catch(e){
			console.log(e);
		}
	}
	function menuAction(_item){
		var _container=registry.byId('mainContainer');
		if(_item.label=='Room'){
			Reservation.UI.createManagerTable(_container,true,'data/RoomManagement.json','api/room');
		}else if(_item.label=='My Booking'){
			Reservation.UI.createManagerTable(_container,true,'data/UserBookingHistory.json','/api/roomBooking/query?key=user&value='+User.uid);
		}else if(_item.label=='Calender'){
			dojo.forEach(_container.getChildren(),function(child){
				child.destroyRendering();
				child.destroy();
			});
			dojo.empty(_container.containerNode);
			
			var _store=new dojo.store.Observable(new dojo.store.Memory({data:{
				identifier: 'uid',
			      items: []
			}}));
			var _calendar=registry.byId("myBookingCal");
			if(_calendar)
				_calendar.destroyRendering();
			
			_calendar=new dojox.calendar.Calendar({
				id:"myBookingCal",
				date:new Date(),
				store:_store,
				startTimeAttr: "bookedAt",
				endTimeAttr: "expireAt",
				minDate:new Date(),
				summaryAttr:"room",
				summaryRenderer:(function(_summany){return _summany.name;}),
				columnViewProps:{minHours:0,maxHours :24},
				isItemEditable: function(item, rendererKind){
				    return false;
				},
				isItemResizeEnabled: function(item, rendererKind){
					return false;
				},
				isItemMoveEnabled: function(item, rendererKind){
					return false;
				},
				decodeDate: function(s){
					//console.log("decodeDate",new Date(s));
					return new Date(s);
				},
				encodeDate: function(d){
					//console.log("encodeDate",new Date(d));
				    return new Date(d);
				}
			});
			
			_calendar.on("itemContextMenu", function(e){
				dojo.stopEvent(e.triggerEvent);
				var calendarContextMenu=registry.byId('calendarContextMenu');
				calendarContextMenu._openMyself({ 
					target: e.renderer.domNode, 
					coords: {x: e.triggerEvent.pageX, y: e.triggerEvent.pageY} 
				});
				_calendar.selectedItem=e.item;
			});
			_calendar.on("itemRollOver", function(e){
				//console.log("itemRollOver", e);
				new Tooltip({
			        connectId: [e.renderer.id],
			        selector: "dl",
			        //showDelay:200,
			        label: "<div style='padding:10px;'>" +
			        		"<h1 style='background-color:green;'>"+e.item.room.name+"</h1>" +
	        				"<h3>"+e.item.room.location+"</h3>" +
	        				"<div style='color:grey;'><span style='color:black;'>User:</span>"+e.item.user.userName+"</div>" +
    						"<div style='color:grey;'><span style='color:black;'>Start:</span>"+_Date.format(new Date(e.item.bookedAt),{datePattern: "dd-MM-yyyy"})+"</div>" +
							"<div style='color:grey;'><span style='color:black;'>End:</span>"+_Date.format(new Date(e.item.expireAt),{datePattern: "dd-MM-yyyy"})+"</div>" +
							"<div style='color:grey;'><span style='color:black;'>Comments:</span>"+e.item.comments+"</div>" +
						"</div>"
			    });
			});
			var calendarContextMenu=registry.byId('calendarContextMenu');
			
			if(calendarContextMenu){
				calendarContextMenu.destroyRendering();
				calendarContextMenu.destroy();
			}
			calendarContextMenu=new dijit.Menu({id:'calendarContextMenu',style:"display: none;"});
			calendarContextMenu.addChild(new dijit.MenuItem({
				iconClass:'dijitIcon dijitIconDelete',
				label:'Cancel',
				onClick:function(){
					console.log(_calendar.selectedItem);
					if(_calendar.selectedItem.user.uid!=User.uid){
						Toolkit.warningMessage("Reservation Booking","You can not Cancel booked by someother user.");
					}else{
						Toolkit.comfirmMessage("Reservation Booking:","Do you want to Cancel?",
							function(){
								request.del("api/roomBooking/"+_calendar.selectedItem.uid).then(
								    function(jsonObj){
								    	var _json=dojo.fromJson(jsonObj);
								    	if(_json.status){
								    		_calendar.store.remove(_calendar.selectedItem.uid);
								    	}
								    },
								    function(error){
								    	console.log(error);
								    }
								);
							});
					}
				}
			}));
			calendarContextMenu.startup();
			_container.addChild(_calendar);

			request.get('/api/roomBooking',{handleAs:'json'}).then(
				    function(jsonObj){
				    	console.log("json",jsonObj.data);
				    	if(jsonObj){
				    		dojo.forEach(jsonObj.data, function(_data) {
				    			console.log(_data);
				    			_store.add(_data);
				    		});
				    	}
				    },
				    function(error){
				    	console.log(error);
				    	Toolkit.errorMessage("Room Reservation",error.response.data.message);
				    }
				);
		}else if(_item.label=='User'){
			Reservation.UI.createManagerTable(_container,true,'data/UserConfiguration.json','api/user');
		}
	}
});
	