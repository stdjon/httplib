loadAllFonts = false;

function setFonts(c, is_nav) {
    var f = _font_map[c];
    var h = _font_data[f.h].bold;

    setCommonFonts(f.p)

    if(is_nav) {
        var p = _font_data[f.p].regular;
        setNavFonts(h, p);
    } else {
        setMainFonts(h, c);
    }
}


function setCommonFonts(p) {
    var pr = _font_data[p].regular;
    var pb = _font_data[p].bold;
    var pi = _font_data[p].italic;
    var pbi = _font_data[p].bolditalic;

    $('div.user-font').css('font-family', pr);
    $('div.user-font b, div.user-font strong').css('font-family', pb);
    $('div.user-font i, div.user-font em').css('font-family', pi);
    $('div.user-font b i, div.user-font b i, ' +
        'div.user-font strong em, div.user-font em strong').css('font-family', pbi);
    $('div.user-font .expanding-area pre, div.user-font .expanding-area textarea').css('font-family', pr);
}


function setNavFonts(h, p) {
    $('.user-font button').css('font-family', p);
    $('a#pagename').css('font-family', h);
}


function setMainFonts(h, c) {
    $('.user-font h1, .user-font h2, .user-font h3, ' +
        '.user-font h4, .user-font h5, .user-font h6' +
        '.user-font .expanding-h1-area pre, ' +
        '.user-font .expanding-h1-area textarea').css('font-family', h);

    postIframeMessage('font/' + c);
}


function initFonts() {
    //default to serif1...
    if(!_g.FontClass) {
        _g.FontClass = 'serif1';
    }
    setFonts(_g.FontClass);
    if(loadAllFonts) {
        postIframeMessage('fonts');
    }
}


