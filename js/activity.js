define([
		"sugar-web/activity/activity",
		"messages","print",
		"activity/jquery-1.11.2.min",
		"activity/ol",
		"config","colormyworld","map"
	],
	function (activity,messages,print,jquery,ol,config,colormyworld,map){

	// Manipulate the DOM only when it is ready.
	require(['domReady!'], function (doc) {

		// Initialize the activity.
		activity.setup();
		print(colormyworld.test());
		print(map.test());
		map.setup_map();
		colormyworld.change_areaCB();

//		document.getElementById("cmw_bg").innerHTML="<h1>ColorMyWorld</h1>";

		var myButton = document.getElementById("my-button");
		myButton.onclick = function () {
		    print("You clicked me!");
		}
	});
});
