define(["activity/ol"],function(ol){
	var me={};
	me.test=function(){return INSTALLED['keys'];}
	BASE_SOURCES={
		'Satellite':new ol.source.MapQuest({layer:'sat'}),
		'OpenStreetMap':new ol.source.MapQuest({layer:'osm'}),
		'OpenStreetMap2':new ol.source.OSM(),
	};
	CATEGORIES={
		'keys':[],
		'Base Layers':{
			'keys':['Satellite','OpenStreetMap','OpenStreetMap2'],
			'Satellite':{
				'type':'tile',
				'api':'ol.layer.Tile',
				'layer':new ol.layer.Tile({minResolution:500,preload:14,opacity:1.0,title:'Satellite',source:BASE_SOURCES['Satellite']}),
				'source':BASE_SOURCES['Satellite'],
				'feature_names':[],
				'style':null,
				'colors':{},
				'toggle':true,
			},
			'OpenStreetMap':{
				'type':'tile',
				'api':'ol.layer.Tile',
				'layer':new ol.layer.Tile({preload:14,opacity:1.0,title:'OpenStreetMap',source:BASE_SOURCES['OpenStreetMap']}),
				'source':BASE_SOURCES['OpenStreetMap'],
				'feature_names':[],
				'style':null,
				'colors':{},
				'toggle':false,
			},
			'OpenStreetMap2':{
				'type':'tile',
				'api':'ol.layer.Tile',
				'layer':new ol.layer.Tile({preload:14,opacity:1.0,title:'OpenStreetMap2',source:BASE_SOURCES['OpenStreetMap2']}),
				'source':BASE_SOURCES['OpenStreetMap2'],
				'feature_names':[],
				'style':null,
				'colors':{},
				'toggle':false,
			},
		},

	};


	var cmw_map = new ol.Map({
		layers:[],
		target: "cmw_bg",
		view: new ol.View({
			center:ol.proj.transform(INSTALLED["World"]["center"], 'EPSG:4326', 'EPSG:3857'),
			zoom: 2
		}),
	});
	var layer=new ol.layer.Tile({preload:14,opacity:1.0,title:'OpenStreetMap2',source:BASE_SOURCES['OpenStreetMap2']});
	cmw_map.addLayer(layer);

	return me;
});
