var _fonts = {
    serif1: {
        h: "simonetta",
        p: "andada",
    },
    serif2: {
        h: "simonetta",
        p: "playfair_display",
    },
    sans1: {
        h: "amaranth",
        p: "amble",
    },
    sans2: {
        h: "amaranth",
        p: "blogger_sans",
    },
};

var _fonts_mono = [
    "office_code_pro_dmedium",
    "m_1mmedium",
];


$('head').append(
    '<style id="active-font" type="text/css"></style>');



function fontClasses(p) {

    var pr = _font_data[p].regular;
    var pb = _font_data[p].bold;
    var pi = _font_data[p].italic;
    var pbi = _font_data[p].bolditalic;

    return '' +
        'div.user-font { font-family: "' + pr + '"; }\n' +
        'div.user-font b, div.user-font strong { font-family: "' + pb + '"; }\n' +
        'div.user-font i, div.user-font em { font-family: "' + pi + '"; }\n' +
        'div.user-font b i, div.user-font b i, ' +
        'div.user-font strong em, div.user-font em strong { font-family: "' + pbi + '"; }\n' +
        'div.user-font pre, div.user-font textarea { font-family: "' + pr + '"; }\n' +
        '';
}


function setFonts(c, is_nav) {
    var f = _fonts[c];
    var h = _font_data[f.h].bold;

    $('#active-font').text(fontClasses(f.p));

    if(is_nav) {
        var p = _font_data[f.p].regular;
        setNavFonts(h, p);
    } else {
        setMainFonts(h, c);
    }
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
    if(''==_g.FontClass) {
        _g.FontClass = 'serif1';
    }
    setFonts(_g.FontClass);
}


