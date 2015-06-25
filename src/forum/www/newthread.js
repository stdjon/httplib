
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


function keyHandler(e) {

    if(e.ctrlKey) {
        switch(e.keyCode) {
            case 13: { //'Enter'
                $('#fp-submit').click();
                e.preventDefault();
                break;
            }
            case 80: { //'P'
                $('#fp-preview').click();
                e.preventDefault();
                break;
            }
            case 85: { //'U'
                $('#bb-rb').click();
                e.preventDefault();
                break;
            }
            case 73: { //'I'
                $('#tx-rb').click();
                e.preventDefault();
                break;
            }
            case 79: { //'O'
                $('#hs-rb').click();
                e.preventDefault();
                break;
            }
        }
    }
}

$('#fp-text').keydown(keyHandler);


// install handler for (hacked) keypress events from select2 elements
$(document).ready(function() {
    $('body').on("s2_keypress", function(_, e) {
        keyHandler(e);
    });
    $('#fp-tags').on('change', function(e) {
        var v = $(this).val();
        $('#tags').val(encodeTagString(v));
    });


})
