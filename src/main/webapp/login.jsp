<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8"/>
	<meta http-equiv="X-UA-Compatible" content="IE=edge"/>
	<title>Room Booking System</title>
	<script type="text/javascript" src="lib/dojo/dojo/dojo.js" data-dojo-config="'parseOnLoad':true,'async':true,'packages':[{'name':'jasu','location':'../../../js/jasu'}]"></script>
	<script type="text/javascript">
		require([
		  	"dojo/ready",
		  	"dijit/registry",
		  	"dojo/cookie",
		  	'dojo/on',
			"dojo/request",
			"dojo/cookie",
			"dijit/registry",
			'jasu/common/Toolkit',
			"dojox/layout/ContentPane"
		],function(ready,registry,cookie,_on,http,cookie,registry,Toolkit){
			ready(function(){
				if (localStorage.rememberme && localStorage.rememberme != '') {
			        registry.byId('rememberme').set('value', 'checked');
			        registry.byId('loginId').set('value',localStorage.loginId);
			        registry.byId('loginPassword').set('value',localStorage.loginPassword);
			    } else {
			    	registry.byId('rememberme').set('value', '');
			        registry.byId('loginId').set('value','');
			        registry.byId('loginPassword').set('value','');
			    }
				
				_on(dojo.byId('loginBtn'),"click",function(){
					var _rememberme=registry.byId('rememberme').get('value');
					var _loginId=registry.byId('loginId').get('value');
					var _loginPassword=registry.byId('loginPassword').get('value');
					console.log(_loginId,_loginPassword,_rememberme);
					if(loginId==''){
						Toolkit.errorMessage("Login","Invalid User Id.");
					}else if(loginPassword==''){
						Toolkit.errorMessage("Login","Invalid Password.");
					}else{
						
						if(_rememberme=='checked' || _rememberme=='on'){
							localStorage.rememberme=_rememberme;
							localStorage.loginId=_loginId;
							localStorage.loginPassword=_loginPassword;
						}else{
							delete localStorage.rememberme;
							delete localStorage.loginId;
							delete localStorage.loginPassword;
						}
						try{
						      http.get('/reservation/login',{
									headers: {
										"X-Requested-With": null,
										'Authorization' :dojo.toJson({userId:_loginId,passwd:_loginPassword})
									},
									withCredentials: true
								}).then(
									function(data){
										var _json=dojo.fromJson(data);
										if(_json.status){
											dojo.forEach(registry.byId('topContainer').getChildren(),function(child){
												child.destroyRendering();
											});
											registry.byId('topContainer').set('href','/reservation');
											localStorage.user=dojo.toJson(_json.data);
										}else
											Toolkit.errorMessage("Login",_json.message);
									},
									function(error){
										console.log(error);
										
									});
					      }catch(e){
					    	  console.log(e);
					      }
					}
				});
				
				_on(dojo.byId('resetBtn'),"click",function(){
					dojo.byId("loginId").value="";
					dojo.byId("loginPassword").value="";
				});
			});
		});
	</script>
	
	<style>
		@import "css/booking.css";
	</style>
</head>
<body class="claro">
	<div id="topContainer" style="width:100%;height:100%;" data-dojo-type="dojox/layout/ContentPane">
		<div  class="loginpan">
	<div style="background-color:white;width:165px;height:37px;background-image:url('images/logo.png');right: 230px;position: absolute;top: 70px;transform: scale(2.0);"></div>
 	<div class="mblRoundRect" style="width: 350.0px; height: 180px; right: 100px; top: 150px; position: absolute; z-index: 900;">
 		<table width="100%" style="padding: 10px;">
 			<tr>
 				<td style="width: 90px;"><label for="loginId">UserId:</label></td>
 				<td><input data-dojo-type="dijit/form/TextBox" id='loginId' type="text" style="width:100%;margin: 5px;"></input></td>
 			</tr>
 			<tr>
 				<td><label for="loginPassword">Password:</label></td>
 				<td><input data-dojo-type="dijit/form/TextBox" id='loginPassword' type="password" style="width:100%;margin: 5px;"></input></td>
 			</tr>
 			<tr>
 				<td></td>
 				<td>
 					<label for="rememberme">Remember Me:</label><div data-dojo-type="dijit/form/CheckBox" id='rememberme'></div>
 				</td>
 			</tr>
 			<tr>
 				<td></td>
 				<td>
 					<button data-dojo-type="dijit/form/Button" id='resetBtn' style="margin-right: 15px;margin: 5px;">Reset</button>
 					<button data-dojo-type="dijit/form/Button" id='loginBtn' style="margin: 15px;">Login</button>
 				</td>
 			</tr>
 		</table>
	</div>
 </div>
	</div>
</body>
</html>
