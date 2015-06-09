//swatches/jumbotron colour

function liActiveA(css) {
    css = css || '';
    return 'ul.nav-tabs li.active a, ul.nav-tabs li.active a:hover {' + css + '}'
}


function divAnchorTrg(css) {
    css = css || '';
    return 'div.anchor.trg div.post, div.anchor.trg:nth-child(odd) div.post {' + css + '}'
}


$('head').append(
    '<style id="active-colour" type="text/css">' + liActiveA() + '</style>');


$('head').append(
    '<style id="trg-colour" type="text/css">' + divAnchorTrg() + '</style>');


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
    $('#active-colour').text(liActiveA('border-left-color: ' + col + ';'));
    $('#trg-colour').text(divAnchorTrg('border-left-color: ' + col + ';'));
    postIframeMessage('hdrCol/' + col);
}


function initHdrCols() {
    //default to x360 (light gray)...
    if(''==_g.ColourId) {
        _g.ColourId = 'x360';
    }
    setHdrCols(_g.ColourId);
}
