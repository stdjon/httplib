//swatches/jumbotron colour

function liActiveA(css) {
    css = css || '';
    return 'ul.nav-tabs li.active a, ul.nav-tabs li.active a:hover {' + css + '}'
}


function divAnchorTrg(css) {
    css = css || '';
    return 'div.anchor.trg p, div.anchor.trg:nth-child(odd) p {' + css + '}'
}


$('head').append(
    '<style id="active-colour" type="text/css">' + liActiveA() + '</style>');


$('head').append(
    '<style id="trg-colour" type="text/css">' + divAnchorTrg() + '</style>');


function setHdrCols(c, b) {
    var fg = b ? "#444" : "#ccc";
    var sl = b ? '55%, 55%' : '88%, 25%';
    var col = 'hsl(' + c + ', ' + sl + ')';

    $('.container .jumbotron').css('background-color', col);
    $('.container .jumbotron').css('color', fg);
    $('div.outside').css('border-left-color', col);
    $('#active-colour').text(liActiveA('border-left-color: ' + col + ';'));
    $('#trg-colour').text(divAnchorTrg('border-left-color: ' + col + ';'));
    postIframeMessage('hdrCol/' + col);
}


function initHdrCols() {
    var cols = [
        0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180,
        202.5, 225, 247.5, 270, 292.5, 315, 337.5 ];
    var idx = Math.floor(Math.random() * cols.length);
    var light = !!Math.floor(Math.random() * 2);

    setHdrCols(cols[idx], light);
}
