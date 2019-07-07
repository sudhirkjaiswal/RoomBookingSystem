/*
 * Source: tookit.js
 * Craete By:Sudhir Jaiswal
 * Created Date:17 Dec 2016
 */

define(["dojo/dom", "dojo/dom-attr", "dojo/_base/lang", "dojo/dom-style", "dijit/registry", "dojo/_base/json", "dojo/dom-construct",
	"dojo/dom-class", "dojo/query",'dijit/Dialog',"dijit/form/Button","dojo/_base/connect","dojo/aspect"], 
		function (_1, _2, _3, _4, _5, _6, _7, _8, _9,_11,_12,_13,_14) {
	return {
		errorMessage:errorMessage,
		warningMessage:warningMessage,
		infoMessage:infoMessage,
		comfirmMessage:comfirmMessage,
		inputDialog:inputDialog
	}
	  var _dialog=undefined,_onOkCallback,_onCancelCallback;
	   //_lastMessageType:"",
	   function _getDialog(){
		  if(_dialog){
              if(!_dialog.open){
			    return _dialog;
              }else{
                _dialog.show();
                return false;
              }
		   }
		   _dialog=new _11({
				id:'DialogMessage',
				style:'max-width:50%;',
                duration:0
			});
		   var _div=_7.create("div",{style:'display: table-row;'},_dialog.containerNode);
		   _dialog.iconDom=_7.create("div",{style:'display: table-cell;vertical-align: top;'},_div);
           var contentDiv =_7.create("div",{style:'display: table-cell;vertical-align: top;'},_div);
          
		   var contentDivContent =_7.create("div",{style:'display: table-cell;font-weight: bold;vertical-align: top;padding-left: 10px;'},_7.create("div",{style:'display: table-row;'},_7.create("div",{style:'display: table;'},contentDiv)));
           
           _dialog.messageDom=_7.create("p",{style:'font-weight: bold;min-height:60px;min-width: 400px;margin-top:0;'},contentDivContent);

		   
           _div=_7.create("div",{class:'toolkitDialogButtonContainer'},contentDivContent);
		   _dialog.okButton=new _12({
			   label:"Ok",
			   iconClass:'successIcon',
               style:"margin-right:5px",
			   onClick:_3.hitch(_dialog,"hide")
		   });
		   _dialog.okButton.placeAt(_div);
		   _dialog.cancelButton=new _12({
			   label:"Cancel",
			   iconClass:'dijitIconDelete',
               style:"margin-left:5px",
			   onClick:_3.hitch(_dialog,"hide")
		   });
		   
		   _dialog.cancelButton.placeAt(_div);
		   _4.set(_dialog.cancelButton.domNode,"display","none");
		   return _dialog;
	   }
	   
       function errorMessage(title,msg,onOkCallback) {
            var _dialog=_getDialog();
             if( _dialog){
                    _dialog.set("title",title ==" "?"&nbsp;":(title||"No Title"));
	                 _2.set(_dialog.iconDom,"class","toolkit_error_dialog_icon");
	                 _dialog.messageDom.innerHTML=msg||"No Message";
	                 
	                 if(_onOkCallback)
	                	 _onOkCallback.remove();
	                 if(onOkCallback)
	                	 _onOkCallback =_14.after(_dialog.okButton,"onClick",onOkCallback,true);
	                 
	                 _4.set(_dialog.cancelButton.domNode,"display","none");
                    _dialog.show();
                }
          
        }
       
        function warningMessage(title,msg,onOkCallback) {
        	 var _dialog=_getDialog();
             if( _dialog){
	             _dialog.set("title",title ==" "?"&nbsp;":(title||"No Title"));
	             _2.set(_dialog.iconDom,"class","toolkit_warning_dialog_icon");
	             _dialog.messageDom.innerHTML=msg||"No Message";
	            
	             if(_onOkCallback)
	            	 _onOkCallback.remove();
	             if(onOkCallback)
	            	 _onOkCallback =_14.after(_dialog.okButton,"onClick",onOkCallback,true);
	             
	             _4.set(_dialog.cancelButton.domNode,"display","none");
                _dialog.show();
            }
        }
        
        function infoMessage(title,msg,onOkCallback) {
        	var _dialog=_getDialog();
            if( _dialog){
            	 _dialog.set("title",title||"No Title");
	             _2.set(_dialog.iconDom,"class","toolkit_info_dialog_icon");
	             _dialog.messageDom.innerHTML=msg||"No Message";
	             
	             if(_onOkCallback)
	            	 _onOkCallback.remove();
	             if(onOkCallback)
	            	 _onOkCallback =_14.after(_dialog.okButton,"onClick",onOkCallback,true);
	             
	             _4.set(_dialog.cancelButton.domNode,"display","none");
                _dialog.show();
            }
        }
        
        function comfirmMessage(title,msg,onOkCallback,onCancelCallback) {
        	 var _dialog=_getDialog();
             if( _dialog){
            	 _dialog.set("title",title ==" "?"&nbsp;":(title||"No Title"));
	             _2.set(_dialog.iconDom,"class","toolkit_confirm_dialog_icon");
	             _dialog.messageDom.innerHTML=msg||"No Message";
	             
	             if(_onOkCallback)
	            	 _onOkCallback.remove();
	             if(onOkCallback)
	            	 _onOkCallback =_14.after(_dialog.okButton,"onClick",onOkCallback,true);
	             
	             if(_onCancelCallback)
	            	 _onCancelCallback.remove();
	             if(onCancelCallback)
	            	 _onCancelCallback =_14.after(_dialog.cancelButton,"onClick",onCancelCallback,true);

                _4.set(_dialog.cancelButton.domNode,"display","");
                _dialog.show();
            }
        }
        
        
        function inputDialog(title,dojoComponent,onOkCallback,onCancelCallback) {
        	 var _dialog=_getDialog();
             if( _dialog){
            	 _dialog.set("title",title ==" "?"&nbsp;":(title||"No Title"));
	             _2.set(_dialog.iconDom,"class","toolkit_confirm_dialog_icon");
	             dojo.empty(_dialog.messageDom);
	             
	             dojoComponent.placeAt(_dialog.messageDom);
	             if(_onOkCallback)
	            	 _onOkCallback.remove();
	             if(onOkCallback)
	            	 _onOkCallback =_14.after(_dialog.okButton,"onClick",onOkCallback,true);
	             
	             if(_onCancelCallback)
	            	 _onCancelCallback.remove();
	             if(onCancelCallback)
	            	 _onCancelCallback =_14.after(_dialog.cancelButton,"onClick",onCancelCallback,true);

                _4.set(_dialog.cancelButton.domNode,"display","");
                _dialog.show();
            }
        }
});
