define([
		"sugar-web/activity/activity",
		"messages","print",
		"activity/jquery-1.11.2.min",
		"activity/ol",
		"activity/l10n",
		"config","colormyworld","map","util","languagepalette"
	],
	function (activity,messages,print,jquery,ol,l10n,config,colormyworld,map,util,languagepalette){

	// Manipulate the DOM only when it is ready.
	require(['domReady!'], function (doc) {

		// Initialize the activity.
		activity.setup();
/*
//Was copying from SpeakActivity ... but taking shortcut now ... just cycle as built
		var datastoreObject = activity.getDatastoreObject();
		var languageButton = document.getElementById("select-language-button");
		var languagePalette = new languagepalette.ActivityPalette(languageButton, datastoreObject);
*/
		print(colormyworld.test());
		print(map.test());
		map.setup_map();
		colormyworld.change_areaCB(INSTALLED['keys'][0]);
		window.onresize=util.updateTitle;
		document.webL10n.setLanguage('en-US');
		print(document.webL10n.getLanguage());

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

		var languageButton = document.getElementById("select-language-button");
		languageButton.onclick = function () {
			var supported_languages=['en-us','fr','es','de','sw','gr','th','cn','it'];
			print(document.webL10n.getLanguage());
			var lang_idx=supported_languages.indexOf(document.webL10n.getLanguage());
			print(lang_idx);
			lang_idx+=1;
			if(lang_idx>supported_languages.length-1)lang_idx=0;
			document.webL10n.setLanguage(supported_languages[lang_idx]);
			print(document.webL10n.getLanguage());
			//colormyworld.change_areaCB();
			window.setTimeout(updateTitle,1000);
		}
		var regionButton = document.getElementById("select-region-button");
		regionButton.onclick = function () {
			print(colormyworld.current);
			var region_idx=INSTALLED['keys'].indexOf(colormyworld.current);
			print(region_idx);
			region_idx+=1;
			print(region_idx);
			if(region_idx>INSTALLED['keys'].length-1)region_idx=0;
			region=INSTALLED['keys'][region_idx];
			print("colormyworld.current="+region);
			colormyworld.change_areaCB(region);
		}

		var runButton = document.getElementById("run-button");
		runButton.onclick = function () {
		    print("Run!");
				colormyworld.startMove();
//				$(".control_panel").toggleClass("show");
		}

	});
});
