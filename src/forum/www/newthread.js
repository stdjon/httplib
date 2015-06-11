// Initialize expanding-areas
$(function() {
    $('div.expanding-area').each(function() {
        var area = $('textarea', $(this));
        var span = $('span', $(this));
        area.bind('input', function() {
        span.text(area.val());
        });
        span.text(area.val());
        $(this).addClass('active');
    });
});


// Swatch selection handling
function selectSwatch(id) {
    $('span.swatch').removeClass('selected');
    $('span#' + id).addClass('selected');
    $('input#colour').val(id);
    setHdrCols(id);
}


function firstPost() {
    var on = $('#fp-cbx').prop('checked');
    if(on) {
        $('#fp-controls').removeClass('concealed');
    } else {
        $('#fp-controls').addClass('concealed');
    }
}
