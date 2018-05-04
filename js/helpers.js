"use strict";

String.prototype.hashCode = function(){
    var hash = 0;
    var i = 0;
    var char = "";
    if (this.length === 0) {
        return hash;
    }
    for (i = 0; i < this.length; i += 1) {
        char = this.charCodeAt(i);
        hash = ((hash<<5)-hash)+char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
};

var helpers = (function () {

    var getParameterByName = function(name, url) {
            if (!url) { 
        url = window.location.href;
        }
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
        var results = regex.exec(url);
        if (!results) {
            return null;
        }
        if (!results[2]) {
            return "";
        }
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    };
    return {
        getParameterByName: getParameterByName
    };
})();