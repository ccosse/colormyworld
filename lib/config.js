var OUTLINE_COLOR="rgba(255,255,0,255)";
var OUTLINE_WIDTH=2;
var INSTALLED={
	"keys":[
		"Africa","Europe","Middle East","Asia","Central America","North America",
		"South America","Caribbean","Australia","Antarctica","Islands","OpenStreetMap2"
	],
	"Middle East":{
		"path":"data/middle_east/",
		"bbox":[24.71, 12.11, 63.34, 42.11],
		"center":[43.5,28],
		"color":"rgba(255,255,0,0)",
		"fill":"rgba(0,100,40,0)",
		"width":2,
		"polygon_sources":[
			{"filename":"middle_east.geojson","color":"rgba(200,200,200,1)","fill":'rgba(100,100,100,0.25)','width':1,"category":"Middle East","layer_name":'Middle East Nations'},
		],
		"point_sources":[],
		"line_sources":[],
		"gpx_sources":[]
	},
	"Asia":{
		"path":"data/asia/",
		"bbox":[19.63,-11.64,179.0, 75.85],
		"center":[105.,40.],
		"color":"rgba(255,255,0,0)",
		"fill":"rgba(0,100,40,0)",
		"width":2,
		"polygon_sources":[
			{"filename":"asia.geojson","color":"rgba(200,200,200,1)","fill":'rgba(100,100,100,0.25)','width':1,"category":"Asia","layer_name":'Asian Nations'},
		],
		"point_sources":[],
		"line_sources":[],
		"gpx_sources":[]
	},
	"North America":{
		"path":"data/north_america/",
		"bbox":[-187.52, 14.55,-12.15, 83.62],
		"center":[-99,49.05],
		"color":"rgba(255,255,0,0)",
		"fill":"rgba(0,100,40,0)",
		"width":2,
		"polygon_sources":[
			{"filename":"north_america.geojson","color":"rgba(200,200,200,1)","fill":'rgba(100,100,100,0.25)','width':1,"category":"North America","layer_name":'North American Nations'},
		],
		"point_sources":[],
		"line_sources":[],
		"gpx_sources":[]
	},
	"Central America":{
		"path":"data/central_america/",
		"bbox":[-92.25,  7.21,-77.20, 18.49],
		"center":[-84.,12.8],
		"color":"rgba(255,255,0,0)",
		"fill":"rgba(0,100,40,0)",
		"width":2,
		"polygon_sources":[
			{"filename":"central_america.geojson","color":"rgba(200,200,200,1)","fill":'rgba(100,100,100,0.25)','width':1,"category":"Central America","layer_name":'Central American Nations'},
		],
		"point_sources":[],
		"line_sources":[],
		"gpx_sources":[]
	},
	"South America":{
		"path":"data/south_america/",
		"bbox":[-109.45,-55.92,-29.84, 13.38],
		"center":[-69.4,-21.9],
		"color":"rgba(255,255,0,0)",
		"fill":"rgba(0,100,40,0)",
		"width":2,
		"polygon_sources":[
			{"filename":"south_america.geojson","color":"rgba(200,200,200,1)","fill":'rgba(100,100,100,0.25)','width':1,"category":"South America","layer_name":'South American Nations'},
		],
		"point_sources":[],
		"line_sources":[],
		"gpx_sources":[]
	},
	"Islands":{
		"path":"data/islands/",
		"bbox":[-187.25,-59.47,183.88, 80.76],
		"center":[0,10.5],
		"color":"rgba(255,255,0,0)",
		"fill":"rgba(0,100,40,0)",
		"width":2,
		"polygon_sources":[
			{"filename":"islands.geojson","color":"rgba(200,200,200,1)","fill":'rgba(100,100,100,0.25)','width':1,"category":"Islands","layer_name":'Island Nations'},
		],
		"point_sources":[],
		"line_sources":[],
		"gpx_sources":[]
	},
/*
	"Test":{
		"path":"data/test/",
		"bbox":[-32.,28.,41.,73.],
		"center":[9,55],
		"color":"rgba(255,255,0,0)",
		"fill":"rgba(0,100,40,0)",
		"width":2,
		"polygon_sources":[
			{"filename":"test.geojson","color":"rgba(200,200,200,1)","fill":'rgba(100,100,100,0.25)','width':1,"category":"Test","layer_name":'Nations'},
		],
		"point_sources":[],
		"line_sources":[],
		"gpx_sources":[]
	},
*/
	"Australia":{
		"path":"data/australia/",
		"bbox":[105.63,-54.75,159.10,-10.05],
		"center":[132,-32.4],
		"color":"rgba(255,255,0,0)",
		"fill":"rgba(0,100,40,0)",
		"width":2,
		"polygon_sources":[
			{"filename":"australia.geojson","color":"rgba(200,200,200,1)","fill":'rgba(100,100,100,0.25)','width':1,"category":"Australia","layer_name":'Australia Region'},
		],
		"point_sources":[],
		"line_sources":[],
		"gpx_sources":[]
	},
	"Antarctica":{
		"path":"data/antarctica/",
		"bbox":[-179.00,-65.00,179.00,-60.50],
		"center":[0,-75],
		"color":"rgba(255,255,0,0)",
		"fill":"rgba(0,100,40,0)",
		"width":2,
		"polygon_sources":[
			{"filename":"antarctica.geojson","color":"rgba(200,200,200,1)","fill":'rgba(100,100,100,0.25)','width':1,"category":"Antarctica","layer_name":'Antarctica Region'},
		],
		"point_sources":[],
		"line_sources":[],
		"gpx_sources":[]
	},
	"Africa":{
		"toggle":true,
		"path":"data/africa/",
		"bbox":[-25.36,-40.97, 63.50, 40.54],
		"center":[19.,3.0],
		"color":"rgba(255,255,0,0)",
		"fill":"rgba(0,100,40,0)",
		"width":2,
		"polygon_sources":[
			{"filename":"africa.geojson","color":"rgba(200,200,200,1)","fill":'rgba(100,100,100,0.25)','width':1,"category":"Africa","layer_name":'African Nations'},
		],
		"point_sources":[],
		"line_sources":[],
		"gpx_sources":[]
	},
	"Europe":{
		"path":"data/europe/",
		"bbox":[-31.29, 27.64, 40.18, 71.16],
		"center":[4,51.3],
		"color":"rgba(255,255,0,0)",
		"fill":"rgba(0,100,40,0)",
		"width":2,
		"polygon_sources":[
			{"filename":"europe.geojson","color":"rgba(200,200,200,1)","fill":'rgba(100,100,100,0.25)','width':1,"category":"Europe","layer_name":'European Nations'},
		],
		"point_sources":[],
		"line_sources":[],
		"gpx_sources":[]
	},
	"Caribbean":{
		"path":"data/caribbean/",
		"bbox":[-84.95,  1.19,-53.98, 26.93],
		"center":[-69.,14.05],
		"color":"rgba(255,255,0,0)",
		"fill":"rgba(0,100,40,0)",
		"width":2,
		"polygon_sources":[
			{"filename":"caribbean.geojson","color":"rgba(200,200,200,1)","fill":'rgba(100,100,100,0.25)','width':1,"category":"Caribbean","layer_name":'Caribbean Nations'},
		],
		"point_sources":[],
		"line_sources":[],
		"gpx_sources":[]
	},
/*
	"World":{
		"path":"data/world/",
		"bbox":[-172,-60,172,60],
        "center":[0,20],
        "color":"rgba(255,0,0,0)",
        "fill":"rgba(0,100,0,0.1)",
        "width":0,
        "polygon_sources":[
            {"filename":"world_borders.geojson","color":"rgba(200,200,200,1)","fill":'rgba(100,100,100,.25)','width':1,"category":"World","layer_name":'World Countries'},
        ],
        "point_sources":[],
        "line_sources":[],
				"gpx_sources":[]
    },
*/
		'OpenStreetMap2':{//This used to create checkbox but hard-coded w.r.t. add/removal of layer
			'type':'tile',
			//'api':'ol.layer.Tile',
			//'layer':new ol.layer.Tile({preload:14,opacity:1.0,title:'OpenStreetMap2',source:BASE_SOURCES['OpenStreetMap2']}),
			//'source':BASE_SOURCES['OpenStreetMap2'],
			'polygon_sources':[],
			"point_sources":[],
			"line_sources":[],
			"gpx_sources":[],
			'feature_names':[],
			'style':null,
			'colors':{},
			'toggle':false,
		},
}
