define(["sugar-web/graphics/palette"], function (palette) {

	'use strict';

	var modepalette = {};

	modepalette.ModePalette = function (invoker, primaryText, menuData) {
		palette.Palette.call(this, invoker, primaryText);

		this.modeEvent = document.createEvent("CustomEvent");
		this.modeEvent.initCustomEvent('mode', true, true, {});
		this.remoteEvent = document.createEvent("CustomEvent");
		this.remoteEvent.initCustomEvent('remote', true, true, {});
		this.getPalette().className += " modepalette";

		var div = document.createElement('div');

		var that = this;

		var coloringbutton = document.createElement('button');
		coloringbutton.className = 'toolbutton palette-button palette-button-selected';
		coloringbutton.setAttribute('id','coloring-button');
		coloringbutton.setAttribute('title','Coloring');
		coloringbutton.onclick = function() {
			that.setMode('coloring');
		}
		var tourbutton = document.createElement('button');
		tourbutton.className = 'toolbutton palette-button palette-button-notselected';
		tourbutton.setAttribute('id','tour-button');
		tourbutton.setAttribute('title','Tour');
		tourbutton.onclick = function() {
			that.setMode('tour');
		}
		var interactivebutton = document.createElement('button');
		interactivebutton.className = 'toolbutton palette-button palette-button-notselected';
		interactivebutton.setAttribute('id','interactive-button');
		interactivebutton.setAttribute('title','Interactive');
		interactivebutton.onclick = function() {
			that.setMode('interactive');
		}
		this.setMode = function(lang) {
			var noMode = (this.getMode() == lang);
			coloringbutton.className = 'toolbutton palette-button palette-button-notselected';
			tourbutton.className = 'toolbutton palette-button palette-button-notselected';
			interactivebutton.className = 'toolbutton palette-button palette-button-notselected';
			if (noMode) {
				this.getPalette().dispatchEvent(this.modeEvent);
				return;
			}
			if (lang == 'tour') {
				tourbutton.className = 'toolbutton palette-button palette-button-selected';
				that.getPalette().dispatchEvent(that.modeEvent);
			} else if (lang == 'interactive') {
				interactivebutton.className = 'toolbutton palette-button palette-button-selected';
				that.getPalette().dispatchEvent(that.modeEvent);
			} else if (lang == 'coloring') {
				coloringbutton.className = 'toolbutton palette-button palette-button-selected';
				that.getPalette().dispatchEvent(that.modeEvent);
			}
		}

		div.appendChild(coloringbutton);
		div.appendChild(tourbutton);
		div.appendChild(interactivebutton);

		this.setContent([div]);

		// Pop-down the palette when a item in the menu is clicked.

		this.buttons = div.querySelectorAll('button');
	};

	var addEventListener = function (type, listener, useCapture) {
		return this.getPalette().addEventListener(type, listener, useCapture);
	};

	modepalette.ModePalette.prototype =
		Object.create(palette.Palette.prototype, {
			addEventListener: {
				value: addEventListener,
				enumerable: true,
				configurable: true,
				writable: true
			}
		});
	modepalette.ModePalette.prototype.setMode = function(lang) {
		this.setMode(lang);
	}
	modepalette.ModePalette.prototype.getMode = function() {
		if (document.getElementById("coloring-button").className == 'toolbutton palette-button palette-button-selected')
			return "Coloring";
		else if (document.getElementById("tour-button").className == 'toolbutton palette-button palette-button-selected')
			return "Tour";
		else if (document.getElementById("interactive-button").className == 'toolbutton palette-button palette-button-selected')
			return "Interactive";
		else
			return "";
	}
	return modepalette;
});
