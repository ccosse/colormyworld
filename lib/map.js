define(["activity/ol","print","util"],function(ol,print,util){
	var me={};
	me.map=null;

	me.test=function(){return INSTALLED['keys'];}

	me.setup_map=function(){
		window.map = new ol.Map({
			layers:[],
			target: "cmw_bg",
			view: new ol.View({
				center:ol.proj.transform(INSTALLED["World"]["center"], 'EPSG:4326', 'EPSG:3857'),
				zoom: 2
			}),
		});
	}
	return me;
});
