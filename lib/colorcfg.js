/**********************************************************

    Author          :Charles B. Cossé

    Organization    :Asymptopia Software | Software@theLimit

    Website         :www.asymptopia.org

    Email           :ccosse@gmail.com

    Copyright       :(C) 2017 Asymptopia Software

    License         :Apache 2.0

***********************************************************/
define(["d3.v4.min"],
	function(d3){
		me={}
		me.cfg=null;
//		me.doneCB=doneCB;
		me.widget_prefixes=[];
		me.slider_suffs=['_3','_4','_7','_8'];
		me.svg=null;
		me.g=null;//"g"=graphics node in d3/svg terminology
		me.x_axis=null;
		me.r_pts=null;
		me.g_pts=null;
		me.b_pts=null;

		document.body.innerHTML+=base_html;//self-contained! (was better using w3.includeHTML but no work in chrome)
		me.resetCB=function(){
			console.log('resetCB');
			d3.selectAll(".colorcfg")
				.attr('display',function(){console.log(this.id);return 'none';})
				.remove();
			delete(me.cfg);
			window.localStorage.clear();

		}
		me.pad=function(num, size){
			//https://stackoverflow.com/questions/2998784/how-to-output-integers-with-leading-zeros-in-javascript
			var s = num+"";
			while (s.length < size) s = "0" + s;
			return s;
		}
		me.show=function(){
			console.log("colorcfg.show")
			d3.select("#colorcfg_main").style("display","block");
			d3.timeout(me.make_swatches,100);
			if(me.widget_prefixes.length<1)me.newSequenceCB();
			me.recenter();
		}
		me.newSequenceCB=function(){
			//colorcfg_main .style must= display:block before calling this

			//Initialize localStorage data if not already exist
			if(!window.localStorage['colorcfg']){
				console.log('newSequenceCB initializing localStorage data');
				me.cfg={'prefixes':[],'favorite_colors':[],};
				window.localStorage['colorcfg']=JSON.stringify(me.cfg);
			}

			d3.selectAll("#widget_table")
				.append('tr')
				.append('td')
				.append("div")
					.attr('class','colorcfg_new')
					.html(new_html);
	//				.html("<div w3-include-html='widget.html'></div>");

			d3.timeout(me.assign_ids,100);//This is a one-time call

		}
		me.assign_ids=function(){
			//Trick: select .colorcfg_new, define ids, then remove _new from .className.
	//		w3.includeHTML();//pity this didn't work in Chroome w/d3 ... w3 couldn't find container1

			console.log('assign_ids')
			var count=0;
			var common_id_prefix='configctrl_'+parseInt(Math.random()*1E7);
			me.widget_prefixes.push(common_id_prefix);

			d3.selectAll(".colorcfg_new")
				.attr('id',function(){var rval=common_id_prefix+"_"+count;console.log(d3.select(this).attr('class'),count);count+=1;return rval;})
				.attr('class',function(){return d3.select(this).attr('class').replace('colorcfg_new','colorcfg');});

			d3.select("#"+common_id_prefix+"_6")
				.on('mousedown',function(){me.cycleRGB(common_id_prefix);});

			me.update(common_id_prefix);//now that we've got a common_id_prefix we can update

		}
		me.recenter=function(){
			d3.select("#column2")
				.style('position','absolute')
				.style('left',parseInt(window.innerWidth/2-400)+"px");
		}
		me.update=function(prefix){
			//update rgb curves and palettes
			console.log('update: '+prefix);

			//we only show R|G|B at a time, so data lives in localStorage
			if(!me.cfg[prefix]){
				me.cfg[prefix]={
					'swatch_per_row':'7',
					'num_swatch':'10',
					'red':{'mu':'135','sigma':'11'},
					'green':{'mu':'135','sigma':'11'},
					'blue':{'mu':'135','sigma':'11'},
					'swatch_pts':d3.select("#"+prefix+"_2").append("g"),
					'seq':[],//this is what gets returned ... sequence of rgba
				}
				me.cfg['prefixes'].push(prefix);
			}

			//This widget's x-axis on svg
			var w_svg=parseInt(d3.select("#"+prefix+"_5").style('width'));
			var h_svg=parseInt(d3.select("#"+prefix+"_5").style('height'));
			console.log("SVG: w,h =",w_svg,h_svg);

			me.x_axis = d3.scaleLinear()
				.range([10,w_svg-10])
				.domain([0,256]);

			d3.select("#"+prefix+"_5")
				.style('background-color','#CCC')
				.append("g")
					.attr("class", "axis axis--x")
					.attr("transform", "translate(0,"+(h_svg-20)+")")
					.call(d3.axisBottom(me.x_axis)
						.ticks(6)
						.tickSize(0)
						.tickPadding(6));

			me.cfg[prefix]['red']['pts']=d3.select("#"+prefix+"_5").append("g");
			me.cfg[prefix]['green']['pts']=d3.select("#"+prefix+"_5").append("g");
			me.cfg[prefix]['blue']['pts']=d3.select("#"+prefix+"_5").append("g");

			//@cycleRGB we apply r|g|b per slider, from loop.
			//We're loading each slider while we know what channel to load it with. (better/alt way in d3 but this for debugging for now)
			me.load(0,0,prefix);//load red values, slider 0
			me.load(0,1,prefix);//load red values, slider 1
			me.load(0,2,prefix);//load red values, slider 2
			me.load(0,3,prefix);//load red values, slider 3

			me.rgb_curves(prefix);
			me.rgb_swatches(prefix);
		}
		me.rgb_curves=function(prefix){
			//redraw the r|g|b distributions
			//This widget's x-axis on svg
			var line = d3.line()
				.x(function(d) {return me.x_axis(d[0])})
				.y(function(d) {return d[1]})
				.curve(d3.curveCatmullRom.alpha(0.5));


			//we only save to me.cfg when switch rgb channels ... so 2/3 me.cfg values are correct
			//we only want to update red ... need 3x point groups for sure ... so need to maintain structure me.data={keys,key1,key2:{r/g/b/mu/sigma/npts/nswatch}}
			console.log("prefix=",prefix);

			var r_gen_data=[];
			var g_gen_data=[];
			var b_gen_data=[];
			for(var xidx=0;xidx<255;xidx+=2){
				r_gen_data.push( [xidx,100*Math.exp( -0.5*( (xidx-me.cfg[prefix]['red']['mu'])/(me.cfg[prefix]['red']['sigma']) *(xidx-me.cfg[prefix]['red']['mu'])/(me.cfg[prefix]['red']['sigma']) )) ] );
				g_gen_data.push( [xidx,100*Math.exp( -0.5*( (xidx-me.cfg[prefix]['green']['mu'])/(me.cfg[prefix]['green']['sigma']) *(xidx-me.cfg[prefix]['green']['mu'])/(me.cfg[prefix]['green']['sigma']) )) ] );
				b_gen_data.push( [xidx,100*Math.exp( -0.5*( (xidx-me.cfg[prefix]['blue']['mu'])/(me.cfg[prefix]['blue']['sigma']) *(xidx-me.cfg[prefix]['blue']['mu'])/(me.cfg[prefix]['blue']['sigma']) )) ] );
			}

			me.cfg[prefix]['red']['pts'].selectAll('.pts').remove();
			me.cfg[prefix]['green']['pts'].selectAll('.pts').remove();
			me.cfg[prefix]['blue']['pts'].selectAll('.pts').remove();

			me.cfg[prefix]['red']['pts'].append("path")
				.datum(r_gen_data)
				.attr("class","pts")
				.attr("fill", "none")
				.attr("stroke", "red")
				.attr("stroke-linejoin", "round")
				.attr("stroke-linecap", "round")
				.attr("stroke-width", 2)
				.attr("d", line);

			me.cfg[prefix]['green']['pts'].append("path")
				.datum(g_gen_data)
				.attr("class","pts")
				.attr("fill", "none")
				.attr("stroke", "green")
				.attr("stroke-linejoin", "round")
				.attr("stroke-linecap", "round")
				.attr("stroke-width", 2)
				.attr("d", line);


			me.cfg[prefix]['blue']['pts'].append("path")
				.datum(b_gen_data)
				.attr("class","pts")
				.attr("fill", "none")
				.attr("stroke", "blue")
				.attr("stroke-linejoin", "round")
				.attr("stroke-linecap", "round")
				.attr("stroke-width", 2)
				.attr("d", line);
	}
		me.rgb_swatches=function(prefix){
			//remake this widget's sequence of swatches
			console.log("rgb_swatches");

			me.cfg[prefix]['seq']=[];
			var SEQUENTIAL=true;
			var A_CHANNEL=255;
			if(SEQUENTIAL){
				for(var idx=0;idx<me.cfg[prefix]['num_swatch'];idx++){
					var rval=me.cfg[prefix]['red']['mu']-me.cfg[prefix]['red']['sigma']+idx/me.cfg[prefix]['num_swatch']*2*me.cfg[prefix]['red']['sigma'];///NUM_COLORS
					var gval=me.cfg[prefix]['green']['mu']-me.cfg[prefix]['green']['sigma']+idx/me.cfg[prefix]['num_swatch']*2*me.cfg[prefix]['green']['sigma'];///NUM_COLORS
					var bval=me.cfg[prefix]['blue']['mu']-me.cfg[prefix]['blue']['sigma']+idx/me.cfg[prefix]['num_swatch']*2*me.cfg[prefix]['blue']['sigma'];///NUM_COLORS
					var color_str="RGBA("+parseInt(rval)+","+parseInt(gval)+","+parseInt(bval)+","+A_CHANNEL+")";
					me.cfg[prefix]['seq'].push(color_str);
				}
			}
			else{
				for(var idx=0;idx<me.cfg[prefix]['num_swatch'];idx++){
					var rval=me.cfg[prefix]['red']['mu']-me.cfg[prefix]['red']['sigma']+Math.random()*2*me.cfg[prefix]['red']['sigma'];///NUM_COLORS
					var gval=me.cfg[prefix]['green']['mu']-me.cfg[prefix]['green']['sigma']+Math.random()*2*me.cfg[prefix]['green']['sigma'];///NUM_COLORS
					var bval=me.cfg[prefix]['blue']['mu']-me.cfg[prefix]['blue']['sigma']+Math.random()*2*me.cfg[prefix]['blue']['sigma'];///NUM_COLORS
					var color_str="RGBA("+parseInt(rval)+","+parseInt(gval)+","+parseInt(bval)+","+A_CHANNEL+")";
					me.cfg[prefix]['seq'].push(color_str);
				}
			}

			//swatch_div
			var N=me.cfg[prefix]['num_swatch'];
			var NR=me.cfg[prefix]['swatch_per_row'];
			console.log("NR=",NR);
			console.log(parseInt(d3.select("#"+prefix+"_2").style('width')));
			var dx=parseInt(parseInt(d3.select("#"+prefix+"_2").style('width'))/NR);
			console.log("dx=",dx);

			me.cfg[prefix]['swatch_pts'].selectAll('.swatch').remove();

			var swatch=me.cfg[prefix]['swatch_pts'].selectAll(".swatch")
				.data(me.cfg[prefix]['seq']);

			swatch.enter()
				.append("svg:rect")
					.attr("class", function(d){return "new swatch"})
					.attr("id",function(d,i){console.log(d);return prefix+"_"+d})
					.attr("width", dx)
					.attr("height", dx)
					.style("fill",function(d){return d;})
					.attr("x", function(d,i) { return dx*(i-NR*parseInt(i/NR) )})
					.attr("y", function(d,i) { return dx*parseInt(i/NR) });

			console.log("done")
		}
		me.getColorsList=function(){
			if(!me.cfg || me.cfg['prefixes'].length==0){
				console.log('me.cfg DNE yet');
				return ["RGBA(49,53,99,255)","RGBA(51,76,101,255)","RGBA(54,99,103,255)","RGBA(57,123,105,255)","RGBA(60,146,108,255)","RGBA(63,170,110,255)","RGBA(66,193,112,255)"];
			}
			var prefix;
			var rval=[];
			for(var pidx=0;pidx<me.cfg['prefixes'].length;pidx++){
				prefix=me.cfg['prefixes'][pidx];
				for(var sidx=0;sidx<me.cfg[prefix]['seq'].length;sidx++){
					rval.push(me.cfg[prefix]['seq'][sidx]);
				}
			}
			return rval;
		}
		me.make_swatches=function(){

			//chrome doesn't see container1 ... d3, w3, chrome, which is the problem?
			//gonna have to re-develop this functionality for chrome.
			//the w3 import _does_ work here: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_html_include_1
			//for now solution is inject 2x pre-formatted html sections (base_html and new_html)

			var w=parseInt(d3.selectAll(".container1").style("width"))-32;
			var h=parseInt(window.innerHeight)-60;
			if(window.innerWidth<1200)h/=2.;

			d3.selectAll(".container2")
				.style("height",(parseInt(window.innerHeight)-25)+"px");

			var nx=7;
			var dx=parseInt(w/nx);
			var ny=parseInt(h/dx)*.9;
			var N=nx*ny;

			var svg = d3.selectAll(".container1").html("").append("svg")//force remake
				.attr("width", w)
				.attr("height", h)
				.style('background-color','navy');

			svg.selectAll("rect")
				.data(d3.range(N))
				.enter().append("rect")
				.attr("width",dx+"px")
				.attr("height",dx+"px")
				.attr('x',function(d){return (d-(nx*parseInt(d/nx)))*(dx);})
				.attr('y',function(d){return parseInt(d/nx)*dx;})
				.attr('fill',function(d) { return d3.hsl(d % nx / nx * 360, 1, Math.floor(d / nx) / ny); });
		}
		me.save=function(rgb_idx,sidx,prefix){
			//this rgb stuff could be replaced with global current_rgb
			var keys=['red','green','blue'];
			var key=keys[rgb_idx];
			if(sidx==0)me.cfg[prefix]['num_swatch']=d3.select("#"+prefix+me.slider_suffs[sidx]).property('value');
			else if(sidx==1)me.cfg[prefix]['swatch_per_row']=d3.select("#"+prefix+me.slider_suffs[sidx]).property('value');
			else if(sidx==2)me.cfg[prefix][key]['mu']=d3.select("#"+prefix+me.slider_suffs[sidx]).property('value');
			else if(sidx==3)me.cfg[prefix][key]['sigma']=d3.select("#"+prefix+me.slider_suffs[sidx]).property('value');
			else {;}
			//only need save to window.localStorage at doneCB
		}
		me.doneCB=function(){
			d3.select("#colorcfg_main").style('display','none');
			colormyworld.update_styles();
		}
		me.load=function(rgb_idx,sidx,prefix){
			var keys=['red','green','blue'];
			var key=keys[rgb_idx];
			if(sidx==0)
				d3.select("#"+prefix+me.slider_suffs[0])
					.property('value',me.cfg[prefix]['num_swatch'].toString())
					.on('input',function(d){d3.select(this).property('value',+this.value);me.cfg[prefix]['num_swatch']=+this.value;me.rgb_swatches(prefix);});
			else if(sidx==1)
				d3.select("#"+prefix+me.slider_suffs[1])
					.property('value',me.cfg[prefix]['swatch_per_row'].toString())
					.on('input',function(d){d3.select(this).property('value',+this.value);me.cfg[prefix]['swatch_per_row']=+this.value;me.rgb_swatches(prefix);});
			else if(sidx==2)
				d3.select("#"+prefix+me.slider_suffs[2])
					.property('value',me.cfg[prefix][key]['mu'].toString())
					.on('input',function(d){d3.select(this).property('value',+this.value);me.cfg[prefix][key]['mu']=+this.value;me.rgb_curves(prefix);me.rgb_swatches(prefix);});
			else if(sidx==3)
				d3.select("#"+prefix+me.slider_suffs[3])
					.property('value',me.cfg[prefix][key]['sigma'].toString())
					.on('input',function(d){d3.select(this).property('value',+this.value);me.cfg[prefix][key]['sigma']=+this.value;me.rgb_curves(prefix);me.rgb_swatches(prefix);});
		}

		me.cycleRGB=function(prefix){
			for(sidx=0;sidx<me.slider_suffs.length;sidx++){//cycling over all 4 sliders
				var idn=prefix+me.slider_suffs[sidx];
				d3.select("#"+idn)//select slider[sidx]
					.attr("class",function(){
						var xclass=d3.select(this).attr('class');
						if(xclass.indexOf("red")>-1){me.save(0,sidx,prefix);me.load(1,sidx,prefix);return xclass.replace("red","green");}
						else if(xclass.indexOf("green")>-1){me.save(1,sidx,prefix);me.load(2,sidx,prefix);return xclass.replace("green","blue");}
						else if(xclass.indexOf("blue")>-1){me.save(2,sidx,prefix);me.load(0,sidx,prefix);return xclass.replace("blue","red");}
						return xclass;
					});
			}
			me.rgb_curves(prefix);
		}

		try{me.cfg=JSON.parse(window.localStorage['colorcfg']);}
		catch(e){console.log('No configuration found in localStorage, will re-create at first newSequenceCB')}

		return me;
	}
);
