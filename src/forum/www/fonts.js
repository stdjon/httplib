loadAllFonts = false;

function setFonts(c, mc, is_nav) {
    var f = _font_map[c];
    var mf = _font_map[mc];
    var h = _font_data[f.h].bold;

    setCommonFonts(f.p, mf.p, h)

    if(is_nav) {
        var p = _font_data[f.p].regular;
        setNavFonts(h, p);
    } else {
        setMainFonts(h, c, mc);
    }
}


function setCommonFonts(p, m, h) {
    var pr = _font_data[p].regular;
    var pb = _font_data[p].bold;
    var pi = _font_data[p].italic;
    var pbi = _font_data[p].bolditalic;
    var mr = _font_data[m].regular;

    $('div.user-font').css('font-family', pr);
    $('div.user-font b, div.user-font strong').css('font-family', pb);
    $('div.user-font i, div.user-font em').css('font-family', pi);
    $('div.user-font b i, div.user-font b i, ' +
        'div.user-font strong em, div.user-font em strong').css('font-family', pbi);
    $('div.user-font .expanding-area.expanding-p-area pre, div.user-font .expanding-area-p-area textarea').css('font-family', pr);
    $('div.user-font .expanding-area.expanding-h1-area pre, div.user-font .expanding-area.expanding-h1-area textarea').css('font-family', h);
    $('div.user-font .expanding-area.expanding-h4-area pre, div.user-font .expanding-area.expanding-h4-area textarea').css('font-family', h);
    $('div.user-font code, div.user-font pre, div.user-font tt').css('font-family', mr);
}


function setNavFonts(h, p) {
    $('.user-font button').css('font-family', p);
    $('a#pagename').css('font-family', h);
}


function setMainFonts(h, c, mc) {
    $('.user-font h1, .user-font h2, .user-font h3, ' +
        '.user-font h4, .user-font h5, .user-font h6' +
        '.user-font .expanding-h1-area pre, ' +
        '.user-font .expanding-h1-area textarea' +
        '.user-font .expanding-h4-area pre, ' +
        '.user-font .expanding-h4-area textarea').css('font-family', h);

    postIframeMessage('font', c, mc);
}


function initFonts() {
    //default to serif1...
    if(!_g.FontClass) {
        _g.FontClass = 'serif1';
    }
    if(!_g.MonoFontClass) {
        _g.MonoFontClass = 'mono1';
    }

    setFonts(_g.FontClass, _g.MonoFontClass);

    if(loadAllFonts) {
        postIframeMessage('fonts');
    }
}


