/**********************************************************

    Author          :Charles B. Cossé

    Organization    :Asymptopia Software | Software@theLimit

    Website         :www.asymptopia.org

    Email           :ccosse@gmail.com

    Copyright       :(C) 2017 Asymptopia Software

    License         :Apache 2.0

***********************************************************/
var base_html=
'<div class="animate" id="colorcfg_main" style="position:absolute;top:0px;width:100%;height:100%;z-index:10;display:none;">\
<div class="row">\
\
	<div class="column" id="column1">\
		<div class="card">\
			<div id="container1" class="container container1">\
			</div>\
		</div>\
	</div>\
\
	<div class="column" id="column2">\
		<div class="card">\
			<div id="container2" class="container container2">\
				<table id="widget_table" class="cp_table">\
				</table>\
				<hr/>\
				<button class="ccbutton" onclick="me.newSequenceCB()">New Sequence</button>\
				<button class="ccbutton" onclick="me.resetCB()">Reset</button>\
			</div>\
		</div>\
	</div>\
\
</div>\
<button class="ccbutton" id="doneB" onclick="me.doneCB()">Done</button>\
</div>';


var new_html=
'<table class="colorcfg_new cp_table">\
	<tbody>\
\
		<tr>\
			<td>\
				<svg class="colorcfg_new swatch_svg"></svg>\
			</td>\
			<td class="vslide_cell">\
				<div class="colorcfg_wrapper rotate">\
					<input type="range" class="colorcfg_new num_swatch_slider vslide red" min="1" max="100" step="1" value="102"/>\
				</div>\
			</td>\
			<td class="vslide_cell">\
				<div class="colorcfg_wrapper rotate">\
					<input type="range" class="colorcfg_new swatch_per_row_slider vslide red" min="1" max="25" step="1"/>\
				</div>\
			</td>\
		</tr>\
\
		<tr>\
			<td>\
				<svg class="colorcfg_new widget_svg"></svg>\
			</td>\
			<td colSpan="2">\
				<button class="colorcfg_new rgb_cycle ccbutton">RGB</button>\
			</td>\
			<td></td>\
		</tr>\
\
		<tr>\
			<td>\
				<table width="100%">\
					<tr><td>\
					<input type="range" style="width:100%" class="colorcfg_new mu_slider hslide red" min="1" max="255" step="1"/>\
					</td></tr><tr><td>\
					<input type="range" style="width:100%" class="colorcfg_new sigma_slider hslide red" min="1" max="120" step="1"/>\
					</td></tr>\
				</table>\
			</td>\
			<td></td>\
			<td></td>\
		</tr>\
	</tbody>\
</table>';



/*
	//leaving this snippet here...
	//This worked great in FFox, but Chrome+D3+w3=No!
	//Attach self to body, invisibly until called to show
	d3.selectAll("body")
		.append("div")
			.attr("class","animate colorcfg")
			.attr('id','colorcfg_main')//maybe chrome was getting confused w/too many?
//			.style('display','none')
			.style('position','absolute')
			.style('top','0px')
			.style('left','0px')
			.style('width','100%')
			.style('height','100%')
			.style('background-color','#555')
			.style('z-index',10)
	//		.html("<div w3-include-html='colorcfg.html'></div>")
		.append('button')
			.attr('id','doneB')
			.html('Done')
			.on('mousedown',function(){d3.selectAll(".colorcfg").style("display","none");me.doneCB();});

//	w3.includeHTML();
*/
