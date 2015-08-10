/**
* Rubicon Project: Solutions Engineering
* Client:          9456/eBay UK
* Name:            rp-ebay-passback.js
* Author:          Martin Hill
* Version:         1.0
* Description:     Custom tracking script to include first party data in passbacks
**/

// add JSON.stringify & parse functions for browsers that don't have native support, i.e. IE < 8.
if (!window.JSON) {
  window.JSON = {
    parse: function (sJSON) { return eval("(" + sJSON + ")"); },
    stringify: function (vContent) {
      if (vContent instanceof Object) {
        var sOutput = "";
        if (vContent.constructor === Array) {
          for (var nId = 0; nId < vContent.length; sOutput += this.stringify(vContent[nId]) + ",", nId++);
          return "[" + sOutput.substr(0, sOutput.length - 1) + "]";
        }
        if (vContent.toString !== Object.prototype.toString) { return "\"" + vContent.toString().replace(/"/g, "\\$&") + "\""; }
        for (var sProp in vContent) { sOutput += "\"" + sProp.replace(/"/g, "\\$&") + "\":" + this.stringify(vContent[sProp]) + ","; }
        return "{" + sOutput.substr(0, sOutput.length - 1) + "}";
      }
      return typeof vContent === "string" ? "\"" + vContent.replace(/"/g, "\\$&") + "\"" : String(vContent);
    }
  };
}

// sessionstorage / cookie get function n = name
rpgc = function(n)
{
	if (typeof sessionStorage !== 'undefined') {
		return sessionStorage.getItem(n);
	} else {
		var cv = document.cookie;
		var cs = cv.indexOf(' ' + n + '=');
		if (cs === -1) {
			cs = cv.indexOf(n + '=');
		}
		if (cs === -1) {
			cv = null;
		} else {
			cs = cv.indexOf('=', cs) + 1;
			var ce = cv.indexOf(';', cs);
			if (ce === -1) {
				ce = cv.length;
			}
			cv = unescape(cv.substring(cs,ce));
		}
		return cv;
	}
}

// get cookie values if rp_params object not available
if (typeof rpx_params === 'undefined') {
	rpx_params = JSON.parse(rpgc('rpx_params'));
}


