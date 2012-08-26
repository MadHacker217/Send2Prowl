//
// Special thanks to Eric Lammerts (lammerts.org) for his help.
//


var prowlingFireFox = function () {
	var prefManager = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
	return {
		init : function () {
			gBrowser.addEventListener("load", function () {
				var autoRun = prefManager.getCharPref("extensions.prowlingfirefox.autorun");
				if (!autoRun) {
					// put alert here, if needed.
				}
			}, false);
		},
			
		run : function () {
				var req = new XMLHttpRequest();
				req.onreadystatechange = function(){
					if (req.readyState == 1) {
						var url = window.top.getBrowser().selectedBrowser.contentWindow.location.href;
						var title = window.top.getBrowser().selectedBrowser.contentDocument.title;
						var api = prefManager.getCharPref("extensions.prowlingfirefox.api");

						var params = 'apikey='+ api +
						     '&application='+ "Send2Prowl" +
						     '&event='+ escape(title) +
						     '&url='+ escape(url) +
						     '&description='+ escape(url);

						req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
						req.send(params);
					}
					if (req.readyState == 4) {
						if (req.status != 200) {
							var errmsg = 'Error sending URL to Prowl: ' + req.status;
							if(req.responseXML) {
								var errs = req.responseXML.getElementsByTagName('error');
								if(errs.length) {
									errmsg += ' (' + errs[0].textContent + ')';
								}
							}
							alert(errmsg);
						}
					}
				};
				req.open('POST', 'https://prowlapp.com/publicapi/add', true);
		}
	};
}();
window.addEventListener("load", prowlingfirefox.init, false);


