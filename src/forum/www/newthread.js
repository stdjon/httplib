
initalizeExpandingAreas();


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


function showPreview() {
    var txt = $('#fp-area textarea').val();
    var sel = $('#fp-render label.active input').val();
    $.ajax({
        type: 'POST',
        dataType: 'text',
        global: false,
        url: '/preview-post',
        data: 'r=' + sel + '&t=' + encodeURIComponent(txt),
        success: function(data) {
            $('#preview').html(data);
        }
    });
}


$('#fp-text').keydown(function (e) {

    if(e.ctrlKey && e.keyCode === 13) {
        $('#fp-submit').click();
    }
});
