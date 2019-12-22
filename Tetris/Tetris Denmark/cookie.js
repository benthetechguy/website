// Cookie management routines

function Cookie()
{}

Cookie.expire = new Date(Date.now() + 864e+7); // 100 days ahead

Cookie.set = function (name, value, expires) {
	expires = expires || Cookie.expire;
	var curCookie = name + "=" + encodeURIComponent(value) + ((expires) ? "; expires=" + expires.toGMTString() : "");
	document.cookie = curCookie;
}

Cookie.get = function (name) {
	var dc = document.cookie;
	var prefix = name + "=";
	var begin = dc.indexOf("; " + prefix);
	if (begin == -1) {
		begin = dc.indexOf(prefix);
		if (begin != 0) return null;
	} 
	else
		begin += 2;
	var end = document.cookie.indexOf(";", begin);
	if (end == -1)
		end = dc.length;
	
	return decodeURIComponent(dc.substring(begin + prefix.length, end));
}