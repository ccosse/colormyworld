define(["activity/ol","print","util","colormyworld"],
	function(ol,print,util,colormyworld){
	var me={};
	me.map=null;
	me.featureOverlay=null;
	me.HILIGHTS=[];

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

		window.map.on('click',function(evt){
			dummmy=window.map.forEachFeatureAtPixel(evt.pixel,function(target_feature,layer){
				var target_name=target_feature.get("NAME");
				if(!target_name)target_name=target_feature.get("Name");
				//if(String.toLowerCase(target_name)==window.app.current){;}
				print(target_name);
				colormyworld.check_feature(evt.pixel);
			});
		});

		window.map.on('pointermove',function(evt){
			if (evt.dragging) {
				return;
			}

			for(var hidx=0;hidx<me.HILIGHTS.length;hidx++){
				me.featureOverlay.removeFeature(me.HILIGHTS[hidx]);
			}

			dummmy=window.map.forEachFeatureAtPixel(evt.pixel,function(target_feature,layer){
				var target_name=target_feature.get("NAME");
				if(!target_name)target_name=target_feature.get("Name");

				if(colormyworld.currents.indexOf(target_name)<0){
					print(target_name);
					me.featureOverlay.addFeature(target_feature);
					me.HILIGHTS.push(target_feature);
				}
/*
				if(String.toLowerCase(target_name)==window.app.current){
					//this skips printing boundary to if(DEBUG)console.log
				}
				else if(target_name==window.app.current){
					//this skips printing boundary to if(DEBUG)console.log
				}
				else if(target_feature){
					me.featureOverlay.addFeature(target_feature);
					me.HILIGHTS.push(target_feature);
					//if(DEBUG)console.log(target_name);
				}
*/
			});
		});

		me.featureOverlay = new ol.FeatureOverlay({
		  map: window.map,
		  style: new ol.style.Style({
		  	stroke: new ol.style.Stroke({
		    	color: OUTLINE_COLOR,
		    	width: OUTLINE_WIDTH
		    }),
		  }),
		});

	}
	return me;
});
