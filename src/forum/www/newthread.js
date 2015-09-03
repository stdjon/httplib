
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
        },
        error: function() {
            Dialog.alert({
                size: BootstrapDialog.SIZE_LARGE,
                type: BootstrapDialog.TYPE_DANGER,
                title: 'Warning',
                message: 'Could not preview (server error).',
            });
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


// insert category array into the select2 object as selected options, so the tags
// field is populated properly...
function populateCategories(select, hl, cats) {
    for(var i = 0; i < cats.length; i++) {
        var opt = $('<option></option>').text(cats[i]).val(cats[i]);
        if(hl === cats[i]) {
            opt.attr('selected', true);
        }
        opt.appendTo(select);
    }
}


function getCategoryList(cb) {
    $.ajax({
        type: 'POST',
        dataType: 'json',
        global: false,
        url: '/categories',
        success: function(data) {
            cb(data.categories);
        }
    });
}


function updateCategory(cat) {
    $.ajax({
        type: 'POST',
        dataType: 'json',
        global: false,
        url: '/col',
        data: 'c=' + encodeURIComponent(cat),
        success: function(data) {
            _g.ColourClass = _g.ColourId = data.colour;
            selectSwatch(_g.ColourClass);
        }
    });
}


function validateNewThread() {
    var result = false;

    var title = $('#title').val();
    var content = $('#fp-text').val();
    var isPost = $('#fp-cbx').val();
    var message = 'Can\'t create thread.';

    if(!title) {
        message += '\nPlease set a title.';
    }

    if(isPost === "on") {
        result = !!title && !!content;
        if(!content) {
            message += '\nPlease write something in the first post.';
        }
    } else {
        result = !!title;

    }

    if(!result) {
        Dialog.alert({
            size: BootstrapDialog.SIZE_LARGE,
            type: BootstrapDialog.TYPE_DANGER,
            title: 'Warning',
            message: message,
        });
    }

    return result;
}


getCategoryList(function(data) {
    populateCategories('select#category', _g.Category, data);
    updateCategory(_g.Category);
});


// install handler for (hacked) keypress events from select2 elements
$(document).ready(function() {
    $('body').on("s2_keypress", function(_, e) {
        keyHandler(e);
    });
    $('#fp-tags').on('change', function(e) {
        var v = $(this).val();
        $('#tags').val(encodeTagString(v));
    });
    $('select#category').on('select2:select', function(e) {
        updateCategory(e.params.data.text);
    });
});
