define(["activity/ol","util","print"],function(ol,util,print){
	var me={};
	me.popup=document.createElement("div");
	me.popup.id="popup";
	me.test=function(){return 'ColorMyWorld';}
	me.current = INSTALLED["keys"][0];
	me.current_feature=null;
	me.last_timeout=null;
	me.tour=true;
	me.DELAY=1500.;
	me.RUNNING=true;

	me.BASE_SOURCES={
		'OpenStreetMap2':new ol.source.OSM(),
	};
	me.CATEGORIES={
		'keys':[],
		'Base Layers':{
			'keys':['OpenStreetMap2'],
			'OpenStreetMap2':{
				'type':'tile',
				'api':'ol.layer.Tile',
				'layer':new ol.layer.Tile({preload:14,opacity:1.0,title:'OpenStreetMap2',source:me.BASE_SOURCES['OpenStreetMap2']}),
				'source':me.BASE_SOURCES['OpenStreetMap2'],
				'feature_names':[],
				'style':null,
				'colors':{},
				'toggle':false,
			},
		},
	};
	me.resize=function(){
		var W=window.innerWidth;
		var H=window.innerHeight;
		var res=util.computeResolution(INSTALLED[me.current]['bbox'],false,W,H);
		window.map.getView().setResolution(res);
	}
	me.get_enabled_candidates=function(){
		var candidates=[];
		var keys=me.CATEGORIES['keys'];
		for(var kidx=0;kidx<keys.length;kidx++){
			var category=keys[kidx];
			if(true)console.log("checking "+category);
			var layer_names=me.CATEGORIES[category]['keys'];
			if(true)console.log("layer_names="+layer_names+" "+typeof(layer_names));
			for(var lidx=0;lidx<layer_names.length;lidx++){
				var layer_name=layer_names[lidx];
				if(true)console.log("checking "+category+"."+layer_name);
				if(me.CATEGORIES[category][layer_name]['toggle']){
					var feature_names=me.CATEGORIES[category][layer_name]['feature_names'];
					for(var fidx=0;fidx<feature_names.length;fidx++){
						var feature_name=feature_names[fidx];
						if(true)console.log("checking "+category+"."+layer_name+"."+feature_name);
						if(me.CATEGORIES[category][layer_name]['features'][feature_name]['candidate']){
							var pyld={
								'category':category,
								'layer_key':layer_name,
								'feature_name':feature_name,
							};
							if(true)console.log("adding candidate: "+feature_name);
							candidates.push(pyld);
						}
					}
				}
			}
		}

		return candidates;
	}
	me.change_areaCB=function(){
		current_idx=parseInt(Math.random()*INSTALLED['keys'].length);
		me.current=INSTALLED['keys'][current_idx];
		//Remove all layers from map, reclaim memory
		for(var cidx=0;cidx<me.CATEGORIES['keys'].length;cidx++){
			category=me.CATEGORIES['keys'][cidx];
			for(var lidx=0;lidx<me.CATEGORIES[category]['keys'].length;lidx++){
				var layer_name=me.CATEGORIES[category]['keys'][lidx];
				if(true)console.log("removing layer: "+layer_name);
				window.map.removeLayer(me.CATEGORIES[category][layer_name]['layer']);
				delete(me.CATEGORIES[category][layer_name]);
			}
			delete(me.CATEGORIES[category]);
		}
		me.CATEGORIES['keys']=[];

		try{
			if(true)console.log("Removing layer: BOUNDARY");
			window.map.removeLayer(me.CATEGORIES['BOUNDARY']['layer']);
			delete(me.CATEGORIES['BOUNDARY']);
		}
		catch(e){/*if(true)console.log(e);*/}

		//Refill layers structure
		var rval=me.prepare_layers();

		if(true)console.log("Adding BOUNDARY layer");
		window.map.addLayer(me.CATEGORIES['BOUNDARY']['layer']);

		var keys=me.CATEGORIES['keys'];
		for(var kidx=0;kidx<keys.length;kidx++){
			var category=keys[kidx];
			if(true)console.log('Adding '+me.CATEGORIES[category]['keys'].length);
			var layer_names=me.CATEGORIES[category]['keys'];
			for(var lidx=0;lidx<layer_names.length;lidx++){
				var layer_name=layer_names[lidx];
				if(true)console.log("Adding layer: "+layer_name);
				window.map.addLayer(me.CATEGORIES[category][layer_name]['layer']);
			}
		}

		window.map.getView().setCenter(ol.proj.transform(INSTALLED[me.current]["center"], 'EPSG:4326', 'EPSG:3857'));

		//resize (calls set res)
		me.resize();

		window.setTimeout(me.fill_all_features,2000,false);

//		var layer=me.CATEGORIES['Base Layers']['OpenStreetMap2']['layer'];
//		window.map.addLayer(layer);
	}
	me.fill_all_features=function(){
		var categories=me.CATEGORIES['keys'];
		for(var cidx=0;cidx<categories.length;cidx++){
			var category=categories[cidx];
			var layer_names=me.CATEGORIES[category]['keys'];
			for(var lidx=0;lidx<layer_names.length;lidx++){
				var layer_name=layer_names[lidx];
				var features=me.CATEGORIES[category][layer_name]['source'].getFeatures();
				for(var fidx=0;fidx<features.length;fidx++){
					var feature_name=null;
					feature_name=features[fidx].get("Name");
					if(!feature_name)feature_name=features[fidx].get("NAME");
					//if(true)console.log(feature_name);
					me.CATEGORIES[category][layer_name]['features'][feature_name]={
						'feature':features[fidx],
						'candidate':true,
					}
					me.CATEGORIES[category][layer_name]['feature_names'].push(feature_name);
				}
			}
		}
//		window.control_panel.rebuild();
	}

	me.prepare_layers=function(){

		if(true)console.log("me.prepare_layers: "+me.current);

		me.LAYERS={'keys':[],}

		for(var pidx=0; pidx<INSTALLED[me.current]["polygon_sources"].length;pidx++){
			var src_url=INSTALLED[me.current]["path"] + INSTALLED[me.current]["polygon_sources"][pidx]["filename"];
			var polygon_source=new ol.source.Vector({
				url: src_url,
				format: new ol.format.GeoJSON()
			});

			var polygon_layer= new ol.layer.Vector({
				source: polygon_source,
				style:new ol.style.Style({
					stroke: new ol.style.Stroke({
						color: INSTALLED[me.current]["polygon_sources"][pidx]["color"],
						width: INSTALLED[me.current]["polygon_sources"][pidx]["width"]
					}),
					fill: new ol.style.Fill({
						color: INSTALLED[me.current]["polygon_sources"][pidx]["fill"],
					})
				}),
			});
			polygon_layer.set("type","Polygon");

			var category=INSTALLED[me.current]["polygon_sources"][pidx]["category"];
			var layer_name=INSTALLED[me.current]["polygon_sources"][pidx]["layer_name"];
			polygon_layer.set("layer_name",layer_name);

			if(me.CATEGORIES['keys'].indexOf(category)<0){
				if(true)console.log("new category: "+category);
				me.CATEGORIES['keys'].push(category);
				me.CATEGORIES[category]={'keys':[],};
			}
			me.CATEGORIES[category]['keys'].push(layer_name);
			me.CATEGORIES[category][layer_name]={
				'layer':polygon_layer,'source':polygon_source,feature_names:[],'features_off':[],
				features:{},'style':null,'colors':{},'toggle':true,'type':'Polygon'
			};

		}

		me.point_layers=[];
		for(var pidx=0;pidx<INSTALLED[me.current]["point_sources"].length;pidx++){

			var src_url=INSTALLED[me.current]["path"] + INSTALLED[me.current]["point_sources"][pidx]["filename"];
			var point_source=new ol.source.Vector({
				url: src_url,
				format: new ol.format.GeoJSON()
			});

			var point_layer= new ol.layer.Vector({
				source: point_source,
				style:new ol.style.Style({
					image:new ol.style.Circle({
						radius:INSTALLED[me.current]["point_sources"][pidx]["radius"],
						stroke: new ol.style.Stroke({
							color: INSTALLED[me.current]["point_sources"][pidx]["color"],
							width: INSTALLED[me.current]["point_sources"][pidx]["width"]
						}),
						fill: new ol.style.Fill({
							color: INSTALLED[me.current]["point_sources"][pidx]["fill"],
						}),
					})
				}),
			});
			point_layer.set("type","Point");

			var category=INSTALLED[me.current]["point_sources"][pidx]["category"];
			layer_name=INSTALLED[me.current]["point_sources"][pidx]["layer_name"];
			point_layer.set("layer_name",layer_name);

			if(me.CATEGORIES['keys'].indexOf(category)<0){
				if(true)console.log("new category: "+category);
				me.CATEGORIES['keys'].push(category);
				me.CATEGORIES[category]={'keys':[],};
			}
			me.CATEGORIES[category]['keys'].push(layer_name)
			me.CATEGORIES[category][layer_name]={
				'layer':point_layer,'source':point_source,feature_names:[],'features_off':[],
				features:{},'style':null,'colors':{},'toggle':true,'type':'Point'
			}
		}

		me.line_layers=[];
		for(var lidx=0;lidx<INSTALLED[me.current]["line_sources"].length;lidx++){
			var src_url=INSTALLED[me.current]["path"] + INSTALLED[me.current]["line_sources"][lidx]["filename"];
			var line_source=new ol.source.Vector({
				url: src_url,
				format: new ol.format.GeoJSON()
			});

			var line_layer= new ol.layer.Vector({
				source: line_source,
				style:new ol.style.Style({
					stroke: new ol.style.Stroke({
						color: INSTALLED[me.current]["line_sources"][lidx]["color"],
						width: INSTALLED[me.current]["line_sources"][lidx]["width"]
					}),
				})
			});
			line_layer.set("type","Line");

			var category=INSTALLED[me.current]["line_sources"][lidx]["category"];
			layer_name=INSTALLED[me.current]["line_sources"][lidx]["layer_name"];
			line_layer.set("layer_name",layer_name);

			if(me.CATEGORIES['keys'].indexOf(category)<0){
				if(true)console.log("new category: "+category);
				me.CATEGORIES['keys'].push(category);
				me.CATEGORIES[category]={'keys':[],};
			}
			me.CATEGORIES[category]['keys'].push(layer_name)
			me.CATEGORIES[category][layer_name]={
				'layer':line_layer,'source':line_source,feature_names:[],'features_off':[],
				features:{},'style':null,'colors':{},'toggle':true,'type':'Line'
			}
		}


		me.gpx_layers=[];
		for(var lidx=0;lidx<INSTALLED[me.current]["gpx_sources"].length;lidx++){
			var src_url=INSTALLED[me.current]["path"] + INSTALLED[me.current]["gpx_sources"][lidx]["filename"];
			var gpx_source=new ol.source.Vector({
				url: src_url,
				format: new ol.format.GPX()
			});

			var gpx_layer= new ol.layer.Vector({
				source: gpx_source,
					style: new ol.style.Style({
					stroke: new ol.style.Stroke({
						color: util.mkRandomColor(),
						width: 3
					})
				}),
			});
			gpx_layer.set("type","gpx");

			var category=INSTALLED[me.current]["gpx_sources"][lidx]["category"];
			layer_name=INSTALLED[me.current]["gpx_sources"][lidx]["layer_name"];
			gpx_layer.set("layer_name",layer_name);
			console.log("layer_name="+layer_name);

			if(me.CATEGORIES['keys'].indexOf(category)<0){
				if(true)console.log("new category: "+category);
				me.CATEGORIES['keys'].push(category);
				me.CATEGORIES[category]={'keys':[],};
			}
			me.CATEGORIES[category]['keys'].push(layer_name)
			me.CATEGORIES[category][layer_name]={
				'layer':gpx_layer,'source':gpx_source,feature_names:[],'features_off':[],
				features:{},'style':null,'colors':{},'toggle':true,'type':'gpx'
			}
		}

		var boundary_source=new ol.source.Vector({
			url: INSTALLED [me.current]["path"] + 'boundary.geojson',
			format: new ol.format.GeoJSON()
		});
		var boundary_layer = new ol.layer.Vector({
			source: boundary_source,
			style:new ol.style.Style({
				stroke: new ol.style.Stroke({
					color: INSTALLED[me.current]["color"],
					width: INSTALLED[me.current]["width"]
				}),
				fill: new ol.style.Fill({
					color: INSTALLED[me.current]["fill"],
				}),
			}),
		});

		me.CATEGORIES['BOUNDARY']={
			'api':'ol.layer.Vector',
			'layer':boundary_layer,
			'source':boundary_source,
			'feature_names':[],
			'features_off':[],
			'features':{},
			'style':null,
			'colors':{},
			'toggle':true,
			'type':'Polygon',
		};

		if(true)console.log("prepare_layers done");
		return 1;

	}//END:me.prepare_layers

//GAME ORCHESTRATION:
	me.startMove=function(feature){

		if(me.RUNNING==false)return;

		if(true)console.log("startMove");

		try{window.clearTimeout(me.last_timeout);}
		catch(e){if(true)console.log(e);}

		if(!feature){

			var candidates=me.get_enabled_candidates();

			if(candidates.length==0){
				if(true)console.log("returning me.end_game()");
				return me.end_game();
			}

			if(true)console.log("me.startMove no feature passed so selecting");

			var ridx=parseInt(Math.random()*candidates.length);
			if(true)console.log("cycling ridx="+ridx.toString()+"/"+candidates.length);

			for(var dummy=0;dummy<ridx;dummy++){
				//if(true)console.log(dummy+"/"+ridx);
				candidates.push(candidates.shift());
			}
			if(true)console.log("shifting me.current_feature");
			me.current_feature=candidates.shift();//should check if getting what was intended

		}
		else{
			if(true)console.log("me.startMove with feature passed");
		}

		var target_name=null;
		target_name=me.current_feature['feature_name'];

		var target_layer_name=me.current_feature['layer_key'];

		var xhtml="<center><h3>Next:</h3><h1>"+target_name+"</h1><h3>"+target_layer_name+"</h3></center>";
		if(true)console.log("me.startMove:"+target_name+" "+target_layer_name);
		me.showPopup(xhtml);
	}
	me.showPopup=function(xhtml){
		while(me.popup.childNodes.length>0){
			try{me.popup.removeChild(me.popup.childNodes[0]);}
			catch(e){if(true)console.log(e);}
		}
		me.popup.innerHTML="";

		var info_div=document.createElement("div");
		info_div.classname="info_div";
		info_div.innerHTML=xhtml;

		me.popup.appendChild(info_div);

		//these need to go into ggmc.css
		me.popup.style.left=(window.innerWidth/2-300/2)+"px";
		me.popup.style.top=(window.innerHeight/2-200/2)+"px";
		me.popup.style.width=(300)+"px";
		me.popup.style.height=(200)+"px";
		me.popup.style.opacity=0.0;
		document.body.appendChild(me.popup);
		$("#popup").animate(
			{opacity:1.0},
			me.DELAY,
			function(){
				me.last_timeout=window.setTimeout(me.popdown,1*me.DELAY);
			}
		);
	}
	me.popdown=function(e){

		if(true)console.log("popdown");
		try{window.clearTimeout(me.last_timeout);}
		catch(e){}

		$("#popup").animate(
			{opacity:0.0},
			me.DELAY,
			function(){

				try{document.body.removeChild(me.popup);}
				catch(e){;}

				if(me.tour && me.current_feature!=null){

					var f=me.current_feature;
					var category=f['category'];
					var layer_name=f['layer_key'];
					var feature_name=f['feature_name'];

					var bbox=me.CATEGORIES[category][layer_name]['features'][feature_name]['feature'].getGeometry().getExtent();

					var center_of_feature=[(bbox[0]+bbox[2])/2.,(bbox[1]+bbox[3])/2.];
					me.pan_zoom(center_of_feature);
				}
			}
		);
	}

	me.end_game=function(){
		try{document.body.removeChild(me.popup);}
		catch(e){if(true)console.log("me.end_game");}
		var xhtml='<center><h1>Congratulations!<br>You Finished!</h1></center>';
		if(true)console.log(xhtml);
		popup(xhtml);
		//NEED:game stats
		document.getElementById("playB").innerHTML='<img src="./static/ggmc/img/flaticon/play.png" class="icon"/>';
	}
	var NUM_COLORS=30;
	var DEFAULT_STROKE="RGBA(200,200,200,1.0)";
	me.random_styles=[];
	for(var dummy=0;dummy<NUM_COLORS;dummy++){
		var random_style=new ol.style.Style({
			fill: new ol.style.Fill({
				color: util.mkBrightRGBA()
			}),
			stroke:new ol.style.Stroke({color: DEFAULT_STROKE,width: 1}),
		});
		me.random_styles.push(random_style);
	}

	me.check_feature = function(pixel) {
		print(me.current_feature);
		if(!me.current_feature)return;

		if(true)console.log("me.check_feature clearing last_timeout");
		window.clearTimeout(me.last_timeout);

		var feature;
		var features=[];
		var found=false;

		if(!pixel && me.tour){

			var category=me.current_feature['category'];
			var layer_name=me.current_feature['layer_key'];
			var feature_name=me.current_feature['feature_name'];

			features.push(me.CATEGORIES[category][layer_name]['features'][feature_name]['feature']);
		}
		else{

			dummy=window.map.forEachFeatureAtPixel(pixel,function(feature,layer){
				var target_name=null;
				target_name=feature.get("NAME");
				if(!target_name)target_name=feature.get("Name");
				if(true)console.log("returning: "+target_name);
				features.push(feature);
			});
		}

		if(features.length>0 && !found){

			for(var fidx=0;fidx<features.length;fidx++){

				feature=features[fidx];
				var category=me.current_feature['category'];
				var target_name=null;
				target_name=me.current_feature['feature_name'];
				target_layer=me.current_feature['layer_key'];
				if(true)console.log(fidx.toString()+" "+target_layer+"."+target_name);
				target_feature=me.CATEGORIES[category][target_layer]['features'][target_name]['feature'];
				if(feature==target_feature){

					if(true)console.log("***** Correct! *****");

					if(me.CATEGORIES[category][target_layer]['type']=="Point"){
						feature.setStyle(util.point_correct_style);
					}
					else{
						var ridx=parseInt(Math.random()*me.random_styles.length);
						feature.setStyle(me.random_styles[ridx]);
//						feature.setStyle(util.correct_style);
					}

					found=true;

					//toggle as candidate
					me.CATEGORIES[category][me.current_feature['layer_key']]['features'][target_name]['candidate']=false;

					//delete(me.current_feature);
					me.current_feature=null;

					if(me.tour){
						if(true)console.log("check_feature setting timeout for pan_zoom_home");
						me.last_timeout=window.setTimeout(me.pan_zoom_home,3*me.DELAY);
					}
					else{
						window.setTimeout(me.startMove,1*me.DELAY);
					}
					return;
				}
				else{
					var feature_name=null;
					feature_name=feature.get("NAME");
					if(!feature_name)feature_name=feature.get("Name");
					if(true)console.log(feature_name+" != "+target_feature.toString());
				}

			}

			if(true)console.log("starting move passing feature: "+target_name);
			me.startMove(feature);
		}
		else{
			if(true)console.log("game over");
		}
	}
	me.pan_zoom=function(location){

			if(true)console.log("pan_zoom: "+location);

			var this_delay=4*me.DELAY;

			var bounce = ol.animation.bounce({
			  resolution:window.map.getView().getResolution()*1.2,
			  duration:this_delay
			});

			var pan = ol.animation.pan({
			  source: window.map.getView().getCenter(),
			  duration:this_delay
			});

			var zoom = ol.animation.zoom({
				resolution: window.map.getView().getResolution(),
				duration:this_delay
			});

			window.map.beforeRender(pan);
			window.map.beforeRender(zoom);

			var f=me.current_feature;
			var category=f['category'];
			var layer_name=f['layer_key'];
			var feature_name=f['feature_name'];

			var bbox=me.CATEGORIES[category][layer_name]['features'][feature_name]['feature'].getGeometry().getExtent();

			var res=util.computeResolution(bbox,true,window.innerWidth,window.innerHeight);
			res*=1.2;
			if(res==0)res=100;

			window.map.getView().setResolution(res);
			window.map.getView().setCenter(location);

			if(me.current_feature != null){
				if(true)console.log("pan_zoom setting timeout for check_feature");
				me.last_timeout=window.setTimeout(me.check_feature,this_delay);
			}
			else{
				if(true)console.log("pan_zoom calling start_move directly");
				me.start_move(null);
			}
		}
	me.pan_zoom_home=function(){
		if(true)console.log("bounce_home");

		var this_delay=4*me.DELAY;

		var pan = ol.animation.pan({
		  source: window.map.getView().getCenter(),
		  duration:this_delay
		});

		var zoom = ol.animation.zoom({
			resolution: window.map.getView().getResolution(),
			duration:this_delay
		});

		window.map.beforeRender(pan);
		window.map.beforeRender(zoom);

		var W=window.innerWidth;
		var H=window.innerHeight;
		var bbox=INSTALLED[me.current]['bbox'];
		var res=util.computeResolution(bbox,false,W,H);
		window.map.getView().setResolution(res);

		var location=ol.proj.transform([(bbox[0]+bbox[2])/2.,(bbox[1]+bbox[3])/2.],"EPSG:4326","EPSG:3857");;
		window.map.getView().setCenter(location);

		if(true)console.log('pan_zoom_home setting timeout for start_move');
		me.last_timeout=window.setTimeout(me.startMove,this_delay);
	}

	return me;
});
