define(["d3.v4.min"],
	function(d3){
		var me={};
		me.show=function(){
			d3.selectAll("body")
				.append("div")
					.attr("class","colorcfg")
					.style('position','absolute')
					.style('top','0px')
					.style('left','0px')
					.style('width','100%')
					.style('height','100%')
					.style('background-color','#555')
					.style('z-index',10)
				.append('button')
					.attr('id','exitB')
					.html('Done')
					.on('mousedown',function(){d3.selectAll(".colorcfg").style("display","none")})
		}
		me.getColorsList=function(){
			var cp;
			cp={//reds
				'r':{'mu':205.16,'sigma':27.3},
				'g':{'mu':71.9,'sigma':25.4},
				'b':{'mu':36.18,'sigma':28.36}
			}
			cp={//fuscia
				'r':{'mu':192.57,'sigma':33.75},
				'g':{'mu':29.26,'sigma':19.4},
				'b':{'mu':56.05,'sigma':16.54}
			}
			cp={//greens
				'r':{'mu':38.25,'sigma':21.2},
				'g':{'mu':149.47,'sigma':30.47},
				'b':{'mu':109.05,'sigma':24.62}
			}
			cp={//blues
				'r':{'mu':31.4,'sigma':25.01},
				'g':{'mu':114.5,'sigma':23.26},
				'b':{'mu':164.97,'sigma':32.89}
			}
			cp={//test
				'r':{'mu':50,'sigma':parseInt(Math.random()*20)},
				'g':{'mu':35,'sigma':parseInt(Math.random()*15)},
				'b':{'mu':170,'sigma':parseInt(Math.random()*30)}
			}
			NUM_COLORS=10;
			var rlist=[];
			for(var idx=0;idx<NUM_COLORS;idx++){
				var rval=cp['r']['mu']-cp['r']['sigma']+Math.random()*2*cp['r']['sigma'];///NUM_COLORS
				var gval=cp['g']['mu']-cp['g']['sigma']+Math.random()*2*cp['g']['sigma'];///NUM_COLORS;
				var bval=cp['b']['mu']-cp['b']['sigma']+Math.random()*2*cp['b']['sigma'];///NUM_COLORS;
				var A_CHANNEL=255;
				var color_str="RGBA("+parseInt(rval)+","+parseInt(gval)+","+parseInt(bval)+","+A_CHANNEL+")";
				rlist.push(color_str);
			}
			return rlist;
		}
		return me;
	}
);
