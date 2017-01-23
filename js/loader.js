var l10n_s;

//This file corresponds to app.js in volo application
//3rd party dependencies, like jQuery -> lib
requirejs.config({
    baseUrl: "lib",
    paths: {
        activity: "../js"
    }
});

//application logic goes in ../js/activity.js
requirejs(["activity/activity"]);
