//swatches/jumbotron colour

function liActiveA(cls, css) {
    css = css || '';
    return 'ul.' + cls + ' li.active a, ul.' + cls + ' li.active a:hover {' + css + '}'
}


function divAnchorTrg(css) {
    css = css || '';
    return 'div.anchor.trg div.post, div.anchor.trg:nth-child(odd) div.post {' + css + '}'
}


function divExpandingH1Area(css) {
    css = css || '';
    return 'div.expanding-h1-area textarea, div.expanding-h1-area pre {' + css + '}'
}


$('head').append(
    '<style id="active-colour" type="text/css">' + liActiveA('nav-tabs') + '</style>');

$('head').append(
    '<style id="pgn-colour" type="text/css">' + liActiveA('pagination') + '</style>');

$('head').append(
    '<style id="trg-colour" type="text/css">' + divAnchorTrg() + '</style>');

$('head').append(
    '<style id="expand-colour" type="text/css">' + divExpandingH1Area() + '</style>');


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
    $('#active-colour').text(liActiveA('nav-tabs', 'border-left-color: ' + col + ';'));
    $('#pgn-colour').text(liActiveA('pagination', 'border-bottom-color: ' + col + ';'));
    $('#trg-colour').text(divAnchorTrg('border-left-color: ' + col + ';'));
    $('#expand-colour').text(divExpandingH1Area('background-color: ' + col + '; color: ' + fg + ';'));
    postIframeMessage('hdrCol/' + col);
}


function initHdrCols() {
    //default to x360 (light gray)...
    if(''==_g.ColourId) {
        _g.ColourId = 'x360';
    }
    setHdrCols(_g.ColourId);
}


