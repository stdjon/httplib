// encode tag string (the individual tags do get double-URIencoded...)
function encodeTagString(tags) {
    tags = tags || [];
    for(var i = 0; i < tags.length; i++) {
        tags[i] = encodeURIComponent(tags[i]);
    }
    tags = tags.join('\0');
    return encodeURIComponent(tags);
}


function decodeTagString(tags) {
    tags = tags || "";
    tags = decodeURIComponent(tags);
    tags = tags.split('\0');
    var result = [];
    var j = 0;
    for(var i = 0; i < tags.length; i++) {
        var d = decodeURIComponent(tags[i]);
        if(d.length > 0) {
            result[j++] = d;
        }
    }
    return result;
}


function tagsHtml(tags) {
    var result = '';
    if(tags.length > 0) {
        result = 'Filed under: ';
        for(var i = 0; i < tags.length; i++) {
            result += '[<a href="' + _g.DefaultPrefix + '/tg/' +
                encodeURIComponent(tags[i]) + '">' + tags[i] + '</a>] '
        }
    }
    return result;
}


