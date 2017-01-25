define([
		"sugar-web/activity/activity",
		"messages","print",
		"activity/jquery-1.11.2.min",
		"activity/ol",
		"activity/l10n",
		"config","colormyworld","map","util"
	],
	function (activity,messages,print,jquery,ol,l10n,config,colormyworld,map,util){

	// Manipulate the DOM only when it is ready.
	require(['domReady!'], function (doc) {

		// Initialize the activity.
		activity.setup();
		print(colormyworld.test());
		print(map.test());
		map.setup_map();
		colormyworld.change_areaCB();

		document.webL10n.setLanguage('fr');
		print(document.webL10n.getLanguage());
		print(document.webL10n.get('France'));

		var updateTitle=window.onresize=function(){
			var app_title=String.split(document.webL10n.get('appname'),'');
			var persistent_title_div=document.getElementById("persistent_title_div");
			html="";
			for(var tidx=0;tidx<app_title.length;tidx++){
				var rand_color=util.mkBrightRGBA();
				html+="<span style='text-shadow:none;font-family:Mickey;color:"+rand_color+";'>"+app_title[tidx]+"</span>";
			}
			persistent_title_div.innerHTML=html;
			util.resize();
		}
		window.setTimeout(updateTitle,1000);

		var myButton = document.getElementById("my-button");
		myButton.onclick = function () {
		    print("You clicked me!");
				colormyworld.change_areaCB();
		}

		var runButton = document.getElementById("run-button");
		runButton.onclick = function () {
		    print("Run!");
				colormyworld.startMove();
		}

	});
});
