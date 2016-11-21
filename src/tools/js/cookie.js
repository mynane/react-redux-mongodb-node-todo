const Cookie = {
    getItem: function(name) {
        var cookieName = encodeURIComponent(name) + "=",
            cookieStart = document.cookie.indexOf(cookieName),
            cookieValue = null,
            cookieEnd;
        if (cookieStart > -1) {
            cookieEnd = document.cookie.indexOf(";", cookieStart);
            if (cookieEnd == -1) {
                cookieEnd = document.cookie.length;
            }
            cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd));
        }
        return cookieValue;
    },
    setItem: function(name, value, time) {
        var cookieText = encodeURIComponent(name) + "=" + encodeURIComponent(value)+"; path=/";
        var date = new Date();
        if (time != undefined) {
            date.setTime(date.getTime() + time);
            cookieText += "; expires=" + date.toGMTString();
        }
        document.cookie = cookieText;
    },
    removeItem: function(name) {
        this.setItem(name, "", -24*10000);
    }
};

export default Cookie;