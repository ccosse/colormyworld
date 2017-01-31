define([
		"sugar-web/activity/activity",
		"messages","print",
		"activity/jquery-1.11.2.min",
		"activity/ol",
		"activity/hammer.min",
		"activity/l10n",
		"config","colormyworld","map","roll_up_div","util","languagepalette"
	],
	function (activity,messages,print,jquery,ol,hammer,l10n,config,colormyworld,map,rollupdiv,util,languagepalette){

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
//		colormyworld.change_areaCB(1,INSTALLED['keys'][0]);
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

			print(util.enscore("You Finished"));
			print(util.descore(document.webL10n.get(util.enscore("You Finished"))));
//			print(util.descore(document.webL10n.get('You_Finished')));

		}
		window.setTimeout(updateTitle,1000);

		var languageButton = document.getElementById("select-language-button");
		var languageLabel = document.getElementById("select-language-label");
		languageButton.onclick = function () {
			var supported_languages={
				'keys':['en-us','fr','es','it','de','sw','gr','th','cn'],
				'en-us':'English',
				'fr':'French',
				'es':'Spanish',
				'it':'Italian',
				'de':'German',
				'sw':'Swahili',
				'gr':'Greek',
				'th':'Thai',
				'cn':'Chinese'
			};
			print(document.webL10n.getLanguage());
			var lang_idx=supported_languages['keys'].indexOf(document.webL10n.getLanguage());
			print(lang_idx);
			lang_idx+=1;
			if(lang_idx>supported_languages['keys'].length-1)lang_idx=0;
			document.webL10n.setLanguage(supported_languages['keys'][lang_idx]);
			print(document.webL10n.getLanguage());
			//colormyworld.change_areaCB();
			languageLabel.innerHTML=supported_languages[supported_languages['keys'][lang_idx]];
			window.setTimeout(updateTitle,1000);
		}
/*
		var regionButton = document.getElementById("select-region-button");
		var regionLabel = document.getElementById("select-region-label");
		regionButton.onclick = function () {
			print(colormyworld.current);
			var region_idx=INSTALLED['keys'].indexOf(colormyworld.current);
			print(region_idx);
			region_idx+=1;
			print(region_idx);
			if(region_idx>INSTALLED['keys'].length-1)region_idx=0;
			region=INSTALLED['keys'][region_idx];
			print("colormyworld.current="+region);
			regionLabel.innerHTML="Region: "+region;
			colormyworld.change_areaCB(1,region);//keep adding/updating
		}
*/
		var runButton = document.getElementById("run-button");
		runButton.onclick = function () {
			colormyworld.toggleRunning();
		}
		var modeButton = document.getElementById("select-mode-button");
		var modeLabel = document.getElementById("select-mode-label");
		modeButton.onclick = function () {
		    if(colormyworld.getTour()==true){
					colormyworld.setTour(false);
					modeButton.title="Mode: Interactive";
					modeLabel.innerHTML="Mode: Interactive";
				}
				else{
					colormyworld.setTour(true);
					modeButton.title="Mode: Tour"
					modeLabel.innerHTML="Mode: Tour";
				}
//				$(".control_panel").toggleClass("show");
		}
		$("#tb").click(function(e){
			print("tb clicked");
			$("#control_panel").toggleClass("hhide");
		});


		var layer_checkboxCB=function(e){
			if(true)console.log(e.target.id);
			var img=e.target;
			var category=e.target.id.split("_")[0];
			category=category.replace("ZZZ"," ");
			var layer_name=e.target.id.split("_")[1];
			layer_name=layer_name.replace("ZZZ"," ");

			if(util.get_basename(img.src)=="checkbox-0.png"){
				img.src="img/checkbox-1.png";
				if(category=="Base Layers"){
					print("Base Layer");
					//window.map.getLayers().insertAt(0, window.app.CATEGORIES[category][layer_name]['layer']);
					//window.app.CATEGORIES[category][layer_name]['toggle']=true;
					colormyworld.change_areaCB(true,layer_name);
				}
				else{
					print("Non Base Layer");
					//window.map.addLayer(window.app.CATEGORIES[category][layer_name]['layer']);
					//window.app.CATEGORIES[category][layer_name]['toggle']=true;
					colormyworld.change_areaCB(true,layer_name);
				}
			}
			else{
				print("removing ..."+e.target.id);
				print(category);
				print(layer_name);
				img.src="img/checkbox-0.png";
				colormyworld.change_areaCB(false,layer_name);
			}
		}
		var make_layer_row=function(category,layer_name){
			if(true)console.log("make_layer_row: "+category+"."+layer_name);
			var rdiv=document.createElement("div");
			var rtab=document.createElement("table");
			rtab.className="layer_table";
			var rrtab=rtab.insertRow(-1);
			var crtab=rrtab.insertCell(-1);

			var layer_label=document.createElement("div");
			layer_label.innerHTML=layer_name;
			layer_label.className="layer_label";
			var id=layer_name+parseInt(1E9*Math.random()).toString();
			layer_label.id=id;
			crtab.className="layer_cell";
			crtab.appendChild(layer_label);

			var crtab=rrtab.insertCell(-1);
			crtab.className="icon_cell";
			var idn=category.replace("_"," ")+"_"+layer_name+"_"+parseInt(1E9*Math.random());
			if(true)console.log("idn="+idn);
			var img=new Image();
			img.id=idn;
			img.className="icon";

			var toggle=false;
			toggle=INSTALLED[layer_name]['toggle'];
			if(toggle){
				img.src="img/checkbox-1.png";
				colormyworld.change_areaCB(true,layer_name);
			}
			else
				img.src="img/checkbox-0.png";

			crtab.appendChild(img);
			img.addEventListener("click",layer_checkboxCB,false);

			var crtab=rrtab.insertCell(-1);
			crtab.className="icon_cell";
			var idn=category+"_"+layer_name+"_hamburger_"+parseInt(1E9*Math.random());
			var img=new Image();
			img.id=idn;
			img.className="icon";
			img.src="img/interface-1.png";
			crtab.appendChild(img);
//			img.addEventListener("click",me.popoutCB,false);


			rdiv.appendChild(rtab);
			return rdiv;
		}

		$("#control_panel").append(util.make_hr("hr0"));
		var category="Regions";
		var opts={
			'category':category,
			'parent_id':'control_panel',
			'id':category.replace("_"," "),
			'className':'roll_up_div',
			'roll_up_class':'rollup',
			'roll_up_name':category.replace("_"," "),
			'arrow_img':'img/arrow.png',
			'roll_up_icon_src':'img/arrow.png',
		};
		var rollup=new RollUpDiv(opts);
		var lt=document.createElement("table");//lt=LayersTable
		lt.className="layer_table";
		var layer_names=INSTALLED['keys'];
		for(var lidx=0;lidx<layer_names.length;lidx++){
			var layer_name=layer_names[lidx];
			var r=lt.insertRow(-1);
			var c=r.insertCell(-1);
			c.appendChild(make_layer_row(category,layer_name));
		}
		rollup.rollup.appendChild(lt);
		$("#control_panel").append(util.make_hr("hr1"));

	});
});
