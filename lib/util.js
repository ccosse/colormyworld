define(["activity/ol"],function (ol) {
    return {
			correct_style:new ol.style.Style({
			  fill: new ol.style.Fill({
			    color: "rgba(255,255,0,0.25)"
			  }),
			  stroke: new ol.style.Stroke({
			    color: "gold",
			    width: 2
			  }),
			}),
			point_correct_style:new ol.style.Style({
				image:new ol.style.Circle({
					radius:10,
					stroke: new ol.style.Stroke({
						color: "rgba(255,0,0,1)",
						width: 5
					}),
					fill: new ol.style.Fill({
						color: "rgba(255,255,0,1)",
					}),
				})
			}),

mkRandomColor:function(){
	var rval="#";
	var chars=["0","1","5","6","A","B","C","D","E","F"];
	for(var dummy=0;dummy<6;dummy++){
		var cidx=parseInt(Math.random()*chars.length);
		try{rval+=chars[cidx];}
		catch(e){rval+="F";}
	}
	return rval;
},
mkBrightRGBA:function(){
	var R_CHANNEL=parseInt(Math.random()*255);
	var G_CHANNEL=parseInt(Math.random()*255);
	var B_CHANNEL=parseInt(Math.random()*255);

	if(R_CHANNEL+G_CHANNEL+B_CHANNEL<300){
		var dice=parseInt(Math.random()*3);
		if(dice==0)R_CHANNEL=255;
		else if(dice==1)G_CHANNEL=255;
		else if(dice==2)B_CHANNEL=255;
		else{;}
	}

	var A_CHANNEL=255;
	var rval="RGBA("+R_CHANNEL+","+G_CHANNEL+","+B_CHANNEL+","+A_CHANNEL+")";
	return rval;
},

computeResolution:function(bbox,is3857,W,H){

	var xmax=bbox[2];
	var xmin=bbox[0];
	var ymin=bbox[1];
	var ymax=bbox[3];

	var p1,p2;
	if(is3857){
		p2=[xmax,ymax];
		p1=[xmin,ymin];
	}
	else{
		p2=ol.proj.transform([xmax,ymax],"EPSG:4326","EPSG:3857");
		p1=ol.proj.transform([xmin,ymin],"EPSG:4326","EPSG:3857");
	}

	if(true)console.log(p1+", "+p2);

	var dx=p2[0]-p1[0];
	var dy=p2[1]-p1[1];


	var AR_win=W/H;
	var AR_shp=dx/dy;

	var res;
	if(AR_win>1){
		if(AR_shp<1){
			res=dy/H;
		}
		else if(AR_shp>AR_win){
			res=dx/W;
		}
		else{
			res=dy/H;
		}
	}
	else{//AR_win<1
		if(AR_shp>1){
			res=dx/W;
		}
		else if(AR_shp<AR_win){
			res=dy/H;
		}
		else{
			res=dx/W;
		}
	}
	if(true)console.log("res="+res);
	return res;
}
}});
