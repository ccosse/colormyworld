define(["activity/ol","util"],function(ol,util){
	var me={};
	me.test=function(){return 'ColorMyWorld';}
	me.current = INSTALLED["keys"][0];
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
		var res=util.compute_resolution(INSTALLED[me.current]['bbox'],false,W,H);
		window.map.getView().setResolution(res);
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
						color: util.make_random_color(),
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


	return me;
});
