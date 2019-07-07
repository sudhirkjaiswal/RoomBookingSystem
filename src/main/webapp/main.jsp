<script type="text/javascript">
require([
	"dojo/parser",
  	"dojo/ready",
  	"dojo/request",
  	"dijit/registry",
	  'dojo/aspect',
	  "dojo/dom-style",
	  'dojo/dom-geometry',
	  "dojo/dom-class",
	  "dojo/query",
	  "dojo/dom-construct",
	  'jasu/common/Menu',
	  "dijit/dijit",
	  "dijit/layout/BorderContainer",
	  "dijit/layout/ContentPane",
	  "dojox/layout/ContentPane",
	  "dojox/layout/ExpandoPane",
	  "dijit/MenuBar",
	  'jasu/common/Manager',
	  'jasu/ui-factory/UI-Builder',
	  'jasu/common/ManagerActions'
],function(parser,ready,http,registry,Aspect,domStyle,_coord,domClass,domQuery,Construct,Menu){
	ready(function(){
		window.User=dojo.fromJson(localStorage.user);
		
		dojo.byId("userName").innerHTML="Welcome to "+User.userName;
		var menubar=registry.byId("ReservationMenuBar");
		var treeContainer=registry.byId("treeContainer");
		Menu.createMenus(menubar,"data/menu.json",treeContainer,User.role);
		Aspect.after(treeContainer,"resize",function(){
			if(this._showing){
				var _q=domQuery('.titleDiv',this.titleWrapper);
				if(_q.length>0){
					dojo.destroy(_q[0]);
				}
			}
		},true);
		
		Aspect.before(treeContainer,"toggle",function(){
			if(this._showing){                           
				Construct.create('div',{class:'titleDiv titleDivRotate',style:'width:20px;left:0;transform: rotate(90deg); transform-origin: left bottom 0;',innerHTML:"Reservation"},this.titleWrapper);
			}
		},true);
		
		registry.byId("logout").set("onClick",function(){
			try{
			      http.get('/reservation/logout',{
					}).then(
						function(data){
							var _json=dojo.fromJson(data);
							console.log(_json);
							if(_json.status)
								delete localStorage.user;
								dojo.forEach(registry.byId('topContainer').getChildren(),function(child){
									child.destroyRendering();
								});
								//console.log(registry.byId('topContainer'));
								window.location.href="/reservation";
								//registry.byId('topContainer').set('href','/reservation');
						},
						function(error){
							console.log(error);
							
						});
		      }catch(e){
		    	  console.log(e);
		      }
		});
		
		Reservation.UI.createManagerTable(registry.byId('mainContainer'),true,'data/RoomManagement.json','api/room');
	});
});
</script>

 <div id="mainBorderContainer" data-dojo-type="dijit/layout/BorderContainer" persist="false" gutters="true" style="min-width: 1em; min-height: 1px; z-index: 0; width: 100%; height: 100%;">
   <div data-dojo-type="dijit/layout/ContentPane" region="top" splitter="false" maxSize="Infinity" style="height: 91px;">
     <div style="background-color:white;">
		<div style="background-color:white;width:165px;height:37px;background-image:url('images/logo.png');display: inline;float: left;"></div>
		<span id="ReservationMenuBar" data-dojo-type="dijit/MenuBar" style="display: inline-block;position: relative;top: 60px;border:none;background-color:white;">
     </span>
	 
	 <div data-dojo-type="dijit/form/DropDownButton" iconClass="helpDropdownIcon" class="helpDropdown">
	  	<span data-dojo-type="dijit/Menu">
	  		 <span data-dojo-type="dijit/MenuItem" label="Update Profile" iconClass="owner" onClick="Reservation.manager.UserManager.updateSelf"></span>
			 <span data-dojo-type="dijit/MenuItem" label="Help" iconClass="help"></span>
			 <span data-dojo-type="dijit/MenuItem" label="About" iconClass="about"></span>
			 <span data-dojo-type="dijit/MenuItem" label="Change Password" iconClass="ch_pass" onClick="Reservation.manager.UserManager.changePassword"></span>
			 <span id="logout" data-dojo-type="dijit/MenuItem" label="Logout" iconClass="lock"></span>
		</span>
	 </div>
	 <div id="userName" style="position: absolute;top: 10px;right: 20px;color: #00679e;"></div>
	 <div style="float: right;font-size: 50px;font-style: oblique;color: #00679e;font-family: Times New Roman;padding: 15px;padding-right: 75px;">Room Booking System</div>
	 <!-- div style="background-color:white;width:389px;height:35px;background-image:url('images/search-bar-2.jpg');right: 80px;position: absolute;top: 81px;"></div-->
	 
	 </div>
   </div>
   <div id="treeContainer" data-dojo-type="dojox/layout/ExpandoPane" region="left" minSize=250 maxSize=400 style="width:250px;border: 1px #b5bcc7 solid !important;" splitter=true gutters=false title='Reservation'></div>
   <div id="mainContainer" data-dojo-type="dojox/layout/ContentPane" region="center"></div>
 </div>
