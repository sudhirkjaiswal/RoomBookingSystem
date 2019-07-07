require(["dojo/_base/Deferred",
		"dojo/_base/lang",
		"dojo/dom-construct",
		'dijit/registry',
		'dojo/request',
		"dojo/date/locale",
		"dijit/Tooltip",
		'jasu/common/Toolkit',
		'dojox/calendar/Calendar',
		'dijit/Calendar',
		'dijit/TitlePane',
		'dojo/store/Observable',
		'dojo/store/Memory'
		],
		function(Deferred,Lang,Construct,Registry,Request,_Date,Tooltip,Toolkit){
	var _operation={
			getMetaURL:function(module){
				var _metaURL;
				if(module=='RoomManager'){
					_metaURL='data/RoomManagement.json';
				}else if(module=='UserManager'){
					_metaURL='data/UserConfiguration.json';
				}else if(module=='RoomHistory'){
					_metaURL='data/RoomBookingHistory.json';
				}else if(module=='UserBookingManager'){
					_metaURL='data/UserBookingHistory.json';
				}else{
					console.log("getMetaURL:not supported");
				}
				return _metaURL;
			},
			getRESTURL:function(module){
				var _metaURL;
				if(module=='RoomManager'){
					_metaURL='api/room';
				}else if(module=='UserManager'){
					_metaURL='api/user';
				}else if(module=='RoomHistory' || module=='UserBookingManager'){
					_metaURL='api/roomBooking';
				}else{
					console.log("getMetaURL:not supported");
				}
				return _metaURL;
			},
			getMetaData:function(module,_onSuccess,_onFail){
				var _metaURL=this.getMetaURL(module);
				Request.get(_metaURL,{handleAs:'json'}).then(
				    function(_json){
				    	_onSuccess(_json);
				    },
				    function(_error){
				    	console.log(_error);
				    	_onFail(_error);
				    }
				);
			},
			addModuleData:function(moduleId,moduleTitle,width,height){
				try{
					var manager=Registry.byId(moduleId);
					var columns=manager.structure;
					var moduleURL=Reservation.manager.getRESTURL(moduleId);
					var dialog=Reservation.UI.createDialog({title:moduleTitle+": Add"});
					var borderLayout=new dijit.layout.BorderContainer({style:'width:'+width+'px;height:'+height+'px;'});
					dialog.addChild(borderLayout);
					
					var container=new dijit.layout.ContentPane({region:"center"});
					dojo.forEach(columns,function(column){
						if(column.onAdd){
							var component={
								label:column.name,
								name:column.field,
								type:column.type||'TextBox',
								require:column.require||false
							}
							
							if(component.type=='TextBox'){
								Reservation.UI.createTextBox(container,component);
							}else if(component.type=='Select'){
								component.options=column.options;
								component.style="width:100%";
								Reservation.UI.createSelect(container,component);
							}else if(component.type=='Textarea'){
								component.style='min-height: 50px;max-height: 50px;';
								Reservation.UI.createTextarea(container,component);
							}else if(component.type=='CheckBox'){
								Reservation.UI.createCheckBox(container,component);
							}else if(component.type=='DateTime'){
								Reservation.UI.createDateTime(container,component);
							}else{
								console.log("under construction");
							}
						}
					});
					borderLayout.addChild(container);
					var bottomPan=new dijit.layout.ContentPane({region:"bottom"});
					
					bottomPan.addChild(new dijit.form.Button({
						label:'Save',
						style:"float:right",
						iconClass:'finishIcon',
						onClick:function(){
							var _data={};
							dojo.forEach(container.getChildren(),function(child){
								if(child.name){
									if(child.type=='DateTime'){
										var _d=child.get('value');
										if(_d){
											var _t=child.get('TimeComponent');
											if(_t && _t.get('value')){
												_t=child.get('TimeComponent').get('value');
												_data[child.name]=(_d.getFullYear()+"-"+(_d.getMonth()+1)+"-"+_d.getDate()+" "+_t.getHours()+":"+_t.getMinutes()+":"+_t.getSeconds());
											}else{
												_data[child.name]=(_d.getFullYear()+"-"+(_d.getMonth()+1)+"-"+_d.getDate()+" 00:00:00");
											}
											
										}
									}else if(child.type=='CheckBox'){
											_data[child.name]=child.get('value')=='on' || child.get('value')=='checked' ;
									}else{
										_data[child.name]=child.get('value');
									}
								}
							});
							console.log("Save",_data);
							Request.post(moduleURL,{
									headers: {
								      "Content-Type": 'application/json',
								      "Accept": "application/json"
								    },data:dojo.toJson(_data)}).then(
								    function(jsonObj){
								    	var _json=dojo.fromJson(jsonObj);
								    	dialog.hide();
								    	if(_json.status){
								    		manager.store.newItem(_json.data);
								    		manager.store.save();
								    	}else
								    		Toolkit.errorMessage(moduleTitle+": Add",_json.message);
								    },
								    function(error){
								    	console.log(error);
								    	Toolkit.errorMessage(moduleTitle+": Add",error.response.data.message);
								    }
								);
						}
					}));
					bottomPan.addChild(new dijit.form.Button({
						label:'Cancel',
						style:"float:right",
						iconClass:'cancelIcon',
						onClick:function(){
							dialog.hide();
						}
					}));
					borderLayout.addChild(bottomPan);
					
					dialog.show();
				}catch(e){
					console.log(e);
				}
			},
			deleteModuleData:function(moduleId,moduleTitle){
				try{
					var manager=Registry.byId(moduleId);
					var moduleURL=Reservation.manager.getRESTURL(moduleId);
					if(manager.select.row.getSelected().length==0){
						Toolkit.warningMessage(moduleTitle+":Delete","Select atleast one row to delete.");
						return false;
					}
					
					Toolkit.comfirmMessage(moduleTitle+":Delete","Do you want to delete?",
							function(){
								dojo.forEach(manager.select.row.getSelected(),function(_id){
									Request.del(moduleURL+"/"+_id).then(
									    function(jsonObj){
									    	var _json=dojo.fromJson(jsonObj);
									    	if(_json.status){
									    		manager.store.deleteItem(manager.store._getItemByIdentity(_id));
									    	}
									    },
									    function(error){
									    	console.log(error);
									    	//Toolkit.errorMessage("Site Information: Delete",error.response.data.message);
									    }
									);
									
								});
								manager.store.save();
					});
				}catch(e){
					console.log(e);
				}
			},
			editModuleData:function(moduleId,moduleTitle,width,height){
				try{
					var manager=Registry.byId(moduleId);
					var moduleURL=Reservation.manager.getRESTURL(moduleId);
					if(manager.select.row.getSelected().length!=1){
						Toolkit.warningMessage(moduleTitle+":Edit","Select only one row to edit.");
						return false;
					}
					var columns=manager.structure;
					var _id=manager.select.row.getSelected()[0];
					var _item=manager.store._getItemByIdentity(_id);
					
					var dialog=Reservation.UI.createDialog({title:moduleTitle+": Edit"});
					var borderLayout=new dijit.layout.BorderContainer({style:'width:'+width+'px;height:'+height+'px;'});
					dialog.addChild(borderLayout);
					
					var container=new dijit.layout.ContentPane({region:"center"});
					dojo.forEach(columns,function(column){
						if(column.onAdd){
							var component={
								label:column.name,
								name:column.field,
								type:column.type||'TextBox',
								value:_item[column.field][0],
								require:column.require||false,
								disabled:column.editable===undefined?false:!column.editable
							}
							if(component.type=='TextBox'){
								Reservation.UI.createTextBox(container,component);
							}else if(component.type=='Select'){
								component.options=column.options;
								component.style="width:100%";
								Reservation.UI.createSelect(container,component);
							}else if(component.type=='Textarea'){
								component.style='min-height: 50px;max-height: 50px;';
								Reservation.UI.createTextarea(container,component);
							}else if(component.type=='CheckBox'){
								component.checked=_item[column.field][0];
								Reservation.UI.createCheckBox(container,component);
							}else if(component.type=='DateTime'){
								Reservation.UI.createDateTime(container,component);
							}else{
								console.log("under construction");
							}
						}
					});
					borderLayout.addChild(container);
					var bottomPan=new dijit.layout.ContentPane({region:"bottom"});
					
					bottomPan.addChild(new dijit.form.Button({
						label:'Update',
						style:"float:right",
						iconClass:'successIcon',
						onClick:function(){
							var _data={uid:_id};
							dojo.forEach(container.getChildren(),function(child){
								if(child.name)
									if(child.type=='DateTime'){
										var _d=child.get('value');
										if(_d){
											var _t=child.get('TimeComponent');
											if(_t && _t.get('value')){
												_t=child.get('TimeComponent').get('value');
												_data[child.name]=(_d.getFullYear()+"-"+(_d.getMonth()+1)+"-"+_d.getDate()+" "+_t.getHours()+":"+_t.getMinutes()+":"+_t.getSeconds());
											}else{
												_data[child.name]=(_d.getFullYear()+"-"+(_d.getMonth()+1)+"-"+_d.getDate()+" 00:00:00");
											}
											
										}
									}else if(child.type=='CheckBox'){
										_data[child.name]=child.get('checked');
									}else{
										_data[child.name]=child.get('value');
									}
							});
							console.log("Update",_data);
							Request.put(moduleURL+"/"+_id,{
									headers: {
								      "Content-Type": 'application/json',
								      "Accept": "application/json"
								    },data:dojo.toJson(_data)}).then(
								    function(jsonObj){
								    	var _json=dojo.fromJson(jsonObj);
								    	dialog.hide();
								    	if(_json.status){
								    		var _oldValue,_newValue;
								    		for(var key in _json.data){
								    			_oldValue=_item[key];
								    			if (_item[key].length == 1) {
								    				_oldValue = _item[key][0];
												} else {
													_oldValue = _item[key];
												}
								    			_newValue=_json.data[key]
								    			
								    			if(_oldValue!==_newValue){
								    				manager.store.setValue(_item,key,_newValue);
								    			}
								    		}
								    		
								    		manager.store.save();
								    		//manager.update();
								    	}else
								    		Toolkit.errorMessage(moduleTitle+": Edit",_json.message);
								    },
								    function(error){
								    	console.log(error);
								    	Toolkit.errorMessage(moduleTitle+": Edit",error.response.data.message);
								    }
								);
						}
					}));
					bottomPan.addChild(new dijit.form.Button({
						label:'Cancel',
						style:"float:right",
						iconClass:'dijitIconDelete',
						onClick:function(){
							dialog.hide();
						}
					}));
					borderLayout.addChild(bottomPan);
					
					dialog.show();
				}catch(e){
					console.log(e);
				}
			},
			viewDialog:function(moduleId,moduleTitle,_uid){
				Reservation.manager.getMetaData(moduleId,function(_json){
					if(_json){
						var _columns=_json.layout;
						Request.get(Reservation.manager.getRESTURL(moduleId)+"/"+_uid,{handleAs:'json'}).then(
						    function(_data1){
						    	if(_data1.status){
						    		var _data=_data1.data;
									var _listData=[];
									var _listObject=[];
									var _history=[];
									dojo.forEach(_columns,function(_column){
										//console.log(_column.field,_data[_column.field])
										if(_column.type=='RoomHistory' || _column.type=='UserHistory'){
											_history.push({key:_column.name,load:true,type:_column.type,field:_column.field,value:_uid});
										}else if(_column.ignoreOnManager){
											_listObject.push({key:_column.name,load:true,type:_column.type,field:_column.field,value:_uid});
										}else{
											if(_data[_column.field]){
												if(_column.type!=undefined && !(_column.type=="Textarea" ||_column.type=="Select" || _column.type=="DateTime")){
													_listObject.push({key:_column.name,value:_data[_column.field],type:_column.type});
												}else if(_column._decorator!=undefined && _column._decorator=="DateTime"){
													_listData.push({key:_column.name,value:{value:_data[_column.field],_decorator:_column._decorator}});
												}else{
													_listData.push({key:_column.name,value:_data[_column.field]});
												}
											}else{
												if(_column.type!=undefined && !(_column.type=="Textarea" ||_column.type=="Select" || _column.type=="DateTime")){
													_listObject.push({key:_column.name,value:null,type:_column.type});
												}else{
													_listData.push({key:_column.name,value:""});
												}
											}
										}
									});
									
									var _dialog=Reservation.UI.createDialog({title:moduleTitle+":Details View"});
									var _borderLayout=new dijit.layout.BorderContainer({style:"width:"+(window.innerWidth-50)+"px; height:"+(window.innerHeight-50)+"px"});
									
									
									var _top=new dijit.layout.ContentPane({region:"top",style:"border: none;"});
									Construct.create('span',{style:"margin: 24px;transform: scale(3);display: inline;float: left;",class:_json.iconClass},_top.containerNode);
									Construct.create('div',{style:"color: #00679e;font-size: 25px;font-weight: bolder;margin-left: 80px;",innerHTML:moduleTitle},_top.containerNode);
									Construct.create('div',{style:"margin-left: 80px;",innerHTML:_uid},_top.containerNode);
									_borderLayout.addChild(_top);
									
									var _container=new dijit.layout.TabContainer({region:"leading",style:"width:518px;"});
									
									var _list = Reservation.UI.createSimpleTable({
										key:"key",
										structure: [
								        	{"name": "Key", "field": "key", "width": "250px",decorator:function(_data){
								        		return "<span style='color:#00679e;font-weight: bolder;'>"+_data+"</span>";
								        	}},
											{"name": "Value", "field": "value", "width": "250px",decorator:function(_data){
												if(_data && _data._decorator=='DateTime'){
													var _d=_Date.format(new Date(_data.value),{
													    datePattern: "dd-MM-yyyy"
													  });
													return _d;
												}else{
													return _data;
												}
												
											}}
								        ],
								        data:_listData,
								        headerHidden: true
									});
									_list.title='Details';
									_container.addChild(_list);
									_borderLayout.addChild(_container);
									
									
									if(_history.length==1){
										Reservation.manager.getMetaData(_history[0].type,function(_json1){
											var _t=Reservation.UI.createSimpleTable({
									    		key:_json1.key,
									    		structure:_json1.layout,
									    		data:[]//(_object.value && _object.value!=null)?[_object.value]:[]
									    	});
											_t.title='Booking History';
											var _tabContainer=new dijit.layout.TabContainer({region:"center"});
											_tabContainer.addChild(_t);
											_borderLayout.addChild(_tabContainer);
											if(_history[0].load){
												Request.get(Reservation.manager.getRESTURL(_history[0].type)+"/query?key="+_history[0].field+"&value="+_history[0].value,{handleAs:'json'}).then(
												    function(_data2){
												    	console.log(_data2);
												    	if(_data2.status && _data2.data && _data2.data.length>0){
											    			_t.model.clearCache();
											    			_t.store.setData(_data2.data);
											    			_t.body.refresh();
												    	}
												    }
												);
											}else{
												var _storeData=(_history[0].value && _history[0].value!=null)?[_history[0].value]:[]
												if(_storeData.length>0){
													_t.model.clearCache();
													_t.store.setData(_storeData);
													_t.body.refresh();
												}
											}
										});
									}
									
									if(_listObject.length>0){
										var _tabContainer=new dijit.layout.TabContainer({region:"bottom",style:"height:200px;"});
										dojo.forEach(_listObject,function(_object){
											Reservation.manager.getMetaData(_object.type,function(_json1){
												var _t=Reservation.UI.createSimpleTable({
										    		key:_json1.key,
										    		structure:_json1.layout,
										    		data:[]//(_object.value && _object.value!=null)?[_object.value]:[]
										    	});
												if(_object.load){
													Request.get(Reservation.manager.getRESTURL(_object.type)+"/query?key="+_object.field+"&value="+_object.value,{handleAs:'json'}).then(
													    function(_data2){
													    	console.log(_data2);
													    	if(_data2.status && _data2.data && _data2.data.length>0){
												    			_t.model.clearCache();
												    			_t.store.setData(_data2.data);
												    			_t.body.refresh();
													    	}
													    }
													);
												}else{
													var _storeData=(_object.value && _object.value!=null)?[_object.value]:[]
													if(_storeData.length>0){
														_t.model.clearCache();
														_t.store.setData(_storeData);
														_t.body.refresh();
													}
												}
												//console.log(_t.store);
										    	//var _tab=new dijit.layout.ContentPane({title:_object.key});
										    	_t.title=_object.key;
										    	//_tab.addChild(_t);
										    	_tabContainer.addChild(_t);
											});
										});
										_borderLayout.addChild(_tabContainer);
									}
									
									_dialog.addChild(_borderLayout);
									_dialog.show();
						    	}
						    },
						    function(error){
						    	console.log(error);
						    }
						);
					}
				});
			},
			viewDetails:function(moduleId,moduleTitle){
				try{
					var _manager=Registry.byId(moduleId);
					if(_manager.select.row.getSelected().length!=1){
						Toolkit.warningMessage(moduleTitle+":Details View","Select only one row to Show Details View.");
						return false;
					}
					var _uid=_manager.select.row.getSelected()[0];
					this.viewDialog(moduleId,moduleTitle,_uid);
				}catch(e){
					console.log(e);
				}
			}
		};
		_operation.RoomManager={
				add:function(){
					Reservation.manager.addModuleData('RoomManager','Room Manager',430,500);
				},
				delete:function(){
					Reservation.manager.deleteModuleData('RoomManager','Room Manager');
				},
				edit:function(){
					Reservation.manager.editModuleData('RoomManager','Room Manager',430,500);
				},
				view:function(){
					Reservation.manager.viewDetails('RoomManager','Room Manager');
				},
				reservation:function(){
					try{
						var manager=Registry.byId("RoomManager");
						if(manager.select.row.getSelected().length!=1){
							Toolkit.warningMessage("Room Reservation","Select only one row to reserve Room.");
							return false;
						}
						var _id=manager.select.row.getSelected()[0];
						var _item=manager.store._getItemByIdentity(_id);
						
						var dialog=Reservation.UI.createDialog({title:"Room Reservation"});
						var _borderLayout=new dijit.layout.BorderContainer({style:"width:"+(window.innerWidth-50)+"px; height:"+(window.innerHeight-50)+"px",design:'sidebar', gutters:true});
						dialog.addChild(_borderLayout);
						
						var _leftContainer=new dijit.layout.ContentPane({region:"leading",splitter:false,style:"width:400px;"});
						
						var _datePicker=new dijit.Calendar({value:new Date(),
							isDisabledDate: function (d) {
					            var d = new Date(d);
					            d.setHours(0, 0, 0, 0);
					            var today = new Date();
					            today.setHours(0, 0, 0, 0);
					            return dojo.date.difference(today, d) < 0;
					        },style:"width: 100%;"
						});
						
						_leftContainer.addChild(_datePicker);
						
						var userPanel=new dijit.TitlePane({title:"User's", style:'margin-top:10px;'});
						
						_leftContainer.addChild(userPanel);
						
						var _eventTitlePane=new dijit.TitlePane({title:"Booking Properties", style:'margin-top:10px;'});
						var _checkbox=Reservation.UI.createCheckBox(_eventTitlePane,{
							label:"Book Now",
							name:"bookNow",
							checked:true
						});
			            
						var _bookAt=Reservation.UI.createDateTime(_eventTitlePane,{
							label:"Book From",
							name:"bookfrom",
							disabled:true,
							require:true
						});
						_checkbox.onChange=function(){
							_bookAt.set("disabled",this.checked);
							_bookAt.TimeComponent.set("disabled",this.checked);
							if(!this.checked){
								var today = new Date();
								var min=today.getMinutes();
								min=min+15-min%15;
					            today.setMinutes(min, 0, 0);
					            console.log(today);
								_bookAt.set("value",today);
								_bookAt.TimeComponent.set("value",today);
							}
						}
						var _today = new Date();
						var _min=_today.getMinutes();
						_min=_min+15-_min%15;
			            _today.setMinutes(_min, 0, 0);
						var _expireAt=Reservation.UI.createDateTime(_eventTitlePane,{
							label:"Expire At",
							name:"expireAt",
							value:_today,
							require:true
						});
						
						_bookAt.onChange=function(){
							if(this.value && this.value!=null){
								var _date=new Date(); 
								var _bookedDate=this.value;
								if(_date.getFullYear()==_bookedDate.getFullYear() && _date.getMonth()==_bookedDate.getMonth() && _date.getDate()==_bookedDate.getDate()){
									_bookedDate.setHours(_date.getHours());
									_bookedDate.setMinutes(_date.getMinutes());
									this.TimeComponent.constraints.min=_bookedDate;
								}else{
									this.TimeComponent.constraints.min=null;
									_bookedDate.setHours(0);
									_bookedDate.setMinutes(0);
								}
								
								this.TimeComponent.set("value",_bookedDate);
								_expireAt.set('value',_bookedDate);
								_expireAt.constraints.min=_bookedDate;
							}
						}
						_bookAt.TimeComponent.onChange=function(){
							if(this.value && this.value!=null){
								var _bookedDate=_bookAt.value;
								_bookedDate.setHours(this.value.getHours());
								_bookedDate.setMinutes(this.value.getMinutes());
								var min=_bookedDate.getMinutes();
								min=min+15;
								_bookedDate.setMinutes(min, 0, 0);
								_expireAt.TimeComponent.constraints.min=_bookedDate;
								_expireAt.TimeComponent.set("value",_bookedDate);
							}
						}
						_expireAt.onChange=function(){
							if(this.value && this.value!=null){
								var _date=_bookAt.value; 
								var _bookedDate=this.value;
								if(_date.getFullYear()==_bookedDate.getFullYear() && _date.getMonth()==_bookedDate.getMonth() && _date.getDate()==_bookedDate.getDate()){
									_bookedDate.setHours(_bookAt.TimeComponent.value.getHours());
									_bookedDate.setMinutes(_bookAt.TimeComponent.value.getMinutes());
								}else{
									_bookedDate.setHours(0);
									_bookedDate.setMinutes(0);
								}
								this.TimeComponent.constraints.min=_bookedDate;
								this.TimeComponent.set("value",_bookedDate);
							}
						}
						var _comments=Reservation.UI.createTextarea(_eventTitlePane,{
							label:"Comments",
							name:"comments",
							style:'min-height: 50px;max-height: 50px;',
							value:'Hey! I am using.',
							require:true
						});
	
						_eventTitlePane.addChild(new dijit.form.Button({
							label:'Book',
							//style:"float:right",
							iconClass:'successIcon',
							onClick:function(){
								
								var bookedAt;
								var expireAt;
								var _d=new Date();
								if(_checkbox.checked){
									_d.setSeconds(0,0);
									bookedAt=_d;
								}else{
									bookedAt=_bookAt.value;
									bookedAt.setHours(_bookAt.TimeComponent.value.getHours(),_bookAt.TimeComponent.value.getMinutes(),0,0);
								}
								expireAt=_expireAt.value;
								expireAt.setHours(_expireAt.TimeComponent.value.getHours(),_expireAt.TimeComponent.value.getMinutes(),0,0);
								var _data={isNow:_checkbox.checked,bookingDetails:{room:{uid:_id},bookedAt:bookedAt.getTime(),expireAt:expireAt.getTime(),comments:_comments.value,user:{uid:User.uid}}};
								console.log("bookedAt:"+bookedAt,"expireAt:"+expireAt);
								console.log("bookedAt:"+bookedAt.getTime(),"expireAt:"+expireAt.getTime());
								console.log("Book:",_data);
								Request.post("/api/roomBooking",{
									headers: {
								      "Content-Type": 'application/json',
								      "Accept": "application/json"
								    },data:dojo.toJson(_data)}).then(
									    function(jsonObj){
									    	var _json=dojo.fromJson(jsonObj);
									    	if(_json.status){
									    		dialog.hide();
									    		console.log(_json);
									    	}else
									    		Toolkit.errorMessage("Room Reservation",_json.message);
									    },
									    function(error){
									    	console.log(error);
									    	Toolkit.errorMessage("Room Reservation",error.response.data.message);
									    }
									);
							}
						}));
						_eventTitlePane.addChild(new dijit.form.Button({
							label:'Cancel',
							//style:"float:right",
							iconClass:'dijitIconDelete',
							onClick:function(){
								dialog.hide();
							}
						}));
						_leftContainer.addChild(_eventTitlePane);
						
						
						_borderLayout.addChild(_leftContainer);
						var _container=new dijit.layout.ContentPane({region:"center"});
						
						var _store=new dojo.store.Observable(new dojo.store.Memory({data:{
							identifier: 'uid',
						      items: []
						}}));
						
						var calendarVisibility={}
						var _calender=new dojox.calendar.Calendar({
							date:(new Date()),
							store:_store,
							startTimeAttr: "bookedAt",
							endTimeAttr: "expireAt",
							minDate:new Date(),
							summaryAttr:"user",
							summaryRenderer:(function(_summany){return _summany.userName;}),
							columnViewProps:{minHours:0,maxHours :24},
							isItemEditable: function(item, rendererKind){
							    return false;
							  },
							  isItemResizeEnabled: function(item, rendererKind){
							    return false;
							  },
							  isItemMoveEnabled: function(item, rendererKind){
							    return false;
							  }
							
						});
						
						var itemToRendererKindFunc = function(item){
							if(calendarVisibility[item.subColumn])
								return this._defaultItemToRendererKindFunc(item);
							else
								return null
						};
						
						_calender.columnView.set("itemToRendererKindFunc", itemToRendererKindFunc);
						_calender.columnView.secondarySheet.set("itemToRendererKindFunc", itemToRendererKindFunc);
						_calender.matrixView.set("itemToRendererKindFunc", itemToRendererKindFunc);
						
						_calender.on("itemRollOver", function(e){
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
						
						console.log(_calender);
						_container.addChild(_calender);
						_borderLayout.addChild(_container);
						
						_datePicker.on("change", function(e){
							var d = this.get("value");
							_calender.set("date", d);
						});	
						
						dialog.show();
						Request.get('/api/roomBooking/query?key=room&value='+_id,{handleAs:'json'}).then(
							    function(jsonObj){
							    	//console.log("json",jsonObj.data);
							    	if(jsonObj){
							    		var Users={};
							    		dojo.forEach(jsonObj.data, function(_data) {
							    			_data.calendar=_data.user.uid;
							    			_store.add(_data);
							    			Users[_data.user.uid]=_data.user.userName;
							    		});
							    		for(var key in Users){
							    			calendarVisibility[key]=true;
							    			var uerCal=Reservation.UI.createCheckBox(userPanel,{
												label:Users[key],
												name:key,
												checked:true
											});
							    			uerCal.on("change", function(v){
												calendarVisibility[this.name] = v;
							    				_calender.currentView.invalidateLayout();
											});
							    		}
							    	}
							    	
							    },
							    function(error){
							    	console.log(error);
							    	Toolkit.errorMessage("Room Reservation",error.response.data.message);
							    }
							);
						
					}catch(e){
						console.log(e);
					}
				}
		};
		
		
		_operation.UserManager={
				
				add:function(){
					Reservation.manager.addModuleData('UserManager','User Management',405,300);
				},
				delete:function(){
					Reservation.manager.deleteModuleData('UserManager','User Management');
				},
				edit:function(){
					Reservation.manager.editModuleData('UserManager','User Management',405,300);
				},
				view:function(){
					Reservation.manager.viewDetails('UserManager','User Management');
				},
				changePassword:function(){
					try{
						var dialog=Reservation.UI.createDialog({title:"Change Password:"});
						var borderLayout=new dijit.layout.BorderContainer({style:'width:410px;height:200px;'});
						dialog.addChild(borderLayout);
						
						var container=new dijit.layout.ContentPane({region:"center"});
						Reservation.UI.createTextBox(container,{
							label:"Old Password",
							name:"oldPassword",
							type:'Password'
						});
						Reservation.UI.createTextBox(container,{
							label:"New Password",
							name:"nwPassword",
							type:'Password'
						});
						Reservation.UI.createTextBox(container,{
							label:"Re-Password",
							name:"rePassword",
							type:'Password'
						});
						borderLayout.addChild(container);
						var bottomPan=new dijit.layout.ContentPane({region:"bottom"});
						
						bottomPan.addChild(new dijit.form.Button({
							label:'Update',
							style:"float:right",
							iconClass:'successIcon',
							onClick:function(){
								var _data={uid:User.uid};
								dojo.forEach(container.getChildren(),function(child){
									_data[child.name]=child.get('value');
								});
								console.log("Update",_data);
								if(_data.rePassword!=_data.nwPassword){
									Toolkit.errorMessage("Change Password:","New Password and Re-Password are not matching.");
									return;
								}else if(_data.nwPassword==_data.oldPassword){
									Toolkit.errorMessage("Change Password:","New Password and Old Password are same.");
									return;
								}
								Request.put("/reservation/changePassword",{
									headers: {
								      "Content-Type": 'application/json',
								      "Accept": "application/json"
								    },data:dojo.toJson(_data)}).then(
									    function(jsonObj){
									    	var _json=dojo.fromJson(jsonObj);
									    	dialog.hide();
									    	if(_json.status){
									    		if (localStorage.rememberme && localStorage.rememberme != '') {
									    			localStorage.loginPassword=_data.nwPassword;
									    		}
									    		Toolkit.infoMessage("Change Password:","Successfully Password changed.");
									    		
									    	}else
									    		Toolkit.errorMessage("Change Password:",_json.message);
									    },
									    function(error){
									    	console.log(error);
									    	Toolkit.errorMessage("Change Password:",error.response.data.message);
									    }
									);
							}
						}));
						bottomPan.addChild(new dijit.form.Button({
							label:'Cancel',
							style:"float:right",
							iconClass:'dijitIconDelete',
							onClick:function(){
								dialog.hide();
							}
						}));
						borderLayout.addChild(bottomPan);
						
						dialog.show();
					}catch(e){
						console.log(e);
					}
				},
				updateSelf:function(){
					try{
						var dialog=Reservation.UI.createDialog({title:"Update Profile: Edit"});
						var borderLayout=new dijit.layout.BorderContainer({style:'width:410px;height:300px;'});
						dialog.addChild(borderLayout);
						
						var container=new dijit.layout.ContentPane({region:"center"});
						Reservation.UI.createTextBox(container,{
							label:"User Name",
							name:"userName",
							type:'TextBox',
							value:User.userName||"",
							require:true
						});
						Reservation.UI.createTextBox(container,{
							label:"Mobile",
							name:"mobile",
							type:'TextBox',
							value:User.mobile||"",
							require:false
						});
						Reservation.UI.createTextBox(container,{
							label:"E-Mail",
							name:"email",
							type:'TextBox',
							value:User.email||"",
							require:false
						});
						Reservation.UI.createTextarea(container,{
							label:"Description",
							name:"description",
							type:'Textarea',
							value:User.description||"",
							style:'min-height: 50px;max-height: 50px;',
							require:false
						});
						
						borderLayout.addChild(container);
						var bottomPan=new dijit.layout.ContentPane({region:"bottom"});
						
						bottomPan.addChild(new dijit.form.Button({
							label:'Update',
							style:"float:right",
							iconClass:'successIcon',
							onClick:function(){
								var _data={uid:User.uid};
								dojo.forEach(container.getChildren(),function(child){
									_data[child.name]=child.get('value');
								});
								console.log("Update",_data);
								Request.put("/reservation/updateProfile",{
									headers: {
								      "Content-Type": 'application/json',
								      "Accept": "application/json"
								    },data:dojo.toJson(_data)}).then(
									    function(jsonObj){
									    	var _json=dojo.fromJson(jsonObj);
									    	dialog.hide();
									    	if(_json.status){
									    		if(_json.data.userName!=window.User.userName){
									    			dojo.byId("userName").innerHTML="Welcome to "+_json.data.userName;
									    		}
									    		window.User=_json.data;
									    		localStorage.user=dojo.toJson(_json.data);
									    	}else
									    		Toolkit.errorMessage(moduleTitle+": Edit",_json.message);
									    },
									    function(error){
									    	console.log(error);
									    	Toolkit.errorMessage(moduleTitle+": Edit",error.response.data.message);
									    }
									);
							}
						}));
						bottomPan.addChild(new dijit.form.Button({
							label:'Cancel',
							style:"float:right",
							iconClass:'dijitIconDelete',
							onClick:function(){
								dialog.hide();
							}
						}));
						borderLayout.addChild(bottomPan);
						
						dialog.show();
					}catch(e){
						console.log(e);
					}
				}
		};
		
		_operation.UserBookingManager={
				cancel:function(){
					Reservation.manager.deleteModuleData('UserBookingManager','User Booking History');
				},
		};
		
		
		Lang.setObject('Reservation.manager',_operation);
	});