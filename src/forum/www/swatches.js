//swatches/jumbotron colour

$('head').append('<style id="dynamic-css" type="text/css"></style>');


function liActiveA(cls, css) {
    css = css || '';
    return 'ul.' + cls + ' li.active a, ul.' + cls + ' li.active a:hover {' + css + '} '
}


function divAnchorTrg(css) {
    css = css || '';
    return 'div.anchor.trg div.post, div.anchor.trg:nth-child(odd) div.post {' + css + '} '
}


function divExpandingH1Area(css) {
    css = css || '';
    return 'div.expanding-h1-area textarea, div.expanding-h1-area pre {' + css + '} '
}


function colFromId(cx) {
    var col;
    var b = ('x' === cx[0]);
    var c = cx.slice(1);
    if(360 == c) {
        var sl = b ? '0%, 55%' : '0%, 25%';
        col = 'hsl(0, ' + sl + ')';
    } else {
        var sl = b ? '55%, 55%' : '88%, 25%';
        col = 'hsl(' + c + ', ' + sl + ')';
    }
    return col;
}

function setHdrCols(cx) {
    var fg, sl, col;

    col = colFromId(cx);
    var b = ('x' === cx[0]);

    fg = b ? "#444" : "#ccc";

    $('.container .jumbotron').css('background-color', col);
    $('.container .jumbotron').css('color', fg);
    $('div.outside').css('border-left-color', col);

    $('#dynamic-css').text(
        liActiveA('nav-tabs', 'border-left-color: ' + col + ';') +
        liActiveA('pagination', 'border-bottom-color: ' + col + ';') +
        divAnchorTrg('border-left-color: ' + col + ';') +
        divExpandingH1Area('background-color: ' + col + '; color: ' + fg + ';') );

    postIframeMessage('hdrCol', col);
}


function initHdrCols() {
    // TODO: we can probably get rid of ColourId at some point...
    if(!_g.ColourId) {
        _g.ColourId = _g.ColourClass;
    }
    if(!_g.ColourId) {
        _g.ColourId = 'x360';
    }
    setHdrCols(_g.ColourId);
}


