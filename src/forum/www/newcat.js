
initalizeExpandingAreas();


// Swatch selection handling
function selectSwatch(id) {
    $('span.swatch').removeClass('selected');
    $('span#' + id).addClass('selected');
    $('input#colour').val(id);
    setHdrCols(id);
}



