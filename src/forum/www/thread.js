var data = {
    bb_active: '',
    tx_active: '',
    hs_active: '',
};


function openExpandingArea(id, label, mode, btn_id) {
    $('<div id="'+ label +'" class="reply post">' +
        '<div class="expanding-area expanding-p-area">' +
            '<pre><span></span><br></pre>' +
            '<textarea id="te-' + label + '" placeholder="['+ mode + ']" name="content"></textarea>' +
        '</div>' +
        '<div id="rnd-' + label + '" class="btn-group" data-toggle="buttons">' +
            '<label class="btn btn-xs btn-default btn-info ' + data.bb_active + '">' +
                '<input type="radio" name="renderer" value="bbcode"/> BBCode' +
            '</label>' +
            '<label class="btn btn-xs btn-default btn-info ' + data.tx_active + '">' +
                '<input type="radio" name="renderer" value="textile" /> Textile' +
            '</label>' +
            '<label class="btn btn-xs btn-default btn-info ' + data.hs_active + '">' +
                '<input type="radio" name="renderer" value="htmlsan" /> HTML' +
            '</label>' +
        '</div>&nbsp;' +
        '<button class="btn btn-xs btn-warning" value="Preview" ' +
            'onclick="showPreview(\'' + label + '\'); return false;">Preview</button>' +
        '<button class="btn btn-xs btn-success" value="Reply" ' +
            'onclick="submit(\'' + label + '\'); return false;">Reply</button>' +
        '<button class="btn btn-xs btn-danger" value="Cancel" ' +
            'onclick="cancel' + mode + '(\'' + btn_id +'\', \'' + id +'\', \'#' + label + '\'); return false;">Cancel</button>' +
        '<div class="preview-window">' +
            '<span id="prv-' + label + '"><br></span>' +
        '</div>' +
    '</div>').insertAfter(id);
    $('#te-' + label).focus();

    initalizeExpandingAreas();
}


function showPreview(label) {
    var txt = $('#' + label + ' textarea').val();
    var sel = $('#rnd-' + label + ' label.active input').val();
    $.ajax({
        type: 'POST',
        dataType: 'text',
        global: false,
        url: '/preview-post',
        data: 'r=' + sel + '&t=' + encodeURIComponent(txt),
        success: function(data) {
            $('#prv-' + label).html(data);
        }
    });
}


function cancel(data, btn_id, id, label) {
    $(label).remove();
    $(id).data(data, false);
    $(btn_id).css('color', $(id).data('old-color'));
}


function reply(btn, id, pid) {
    var btn_id = '#' + $(btn).attr('id');

    if($(id).data('reply-open')) {
        cancelReply(btn_id, id, '#r' + pid);

    } else {
        openExpandingArea(id, 'r' + pid, 'Reply', btn_id);

        $(id).data('reply-open', true).
            data('old-color', $(btn).css('color'));
        $(btn).css('color', colFromId(_g.ColourId));
    }
}


function cancelReply(btn_id, id, label) {
    cancel('reply-open', btn_id, id, label);
}


function edit(btn, id, pid) {
    var btn_id = '#' + $(btn).attr('id');

    if($(id).data('edit-open')) {
        cancelEdit(btn_id, id, '#e' + pid);

    } else {
        openExpandingArea(id, 'e' + pid, 'Edit', btn_id);

        $(id).data('edit-open', true).
            data('old-color', $(btn).css('color'));
        $(btn).css('color', colFromId(_g.ColourId));
    }
}


function cancelEdit(btn_id, id, label) {
    cancel('edit-open', btn_id, id, label);
}


function quote(btn, id, pid) {
    if($(id).data('quote-open')) {
        $(id).data('quote-open', false);
        $(btn).css('color', $(id).data('old-color'));
    } else {
        $(id).data('quote-open', true).
            data('old-color', $(btn).css('color'));
        $(btn).css('color', colFromId(_g.ColourId));
    }
}


function thumbsup(btn, id, pid) {
    if($(id).data('thumbed')) {
        $(id).data('thumbed', false);
        $(btn).css('color', $(id).data('old-color')).
            attr('class', 'fa fa-fw fa-thumbs-o-up');
    } else {
        $(id).data('thumbed', true).
            data('old-color', $(btn).css('color'));
        $(btn).css('color', colFromId(_g.ColourId)).
            attr('class', 'fa fa-fw fa-thumbs-up');
    }
}


function star(btn, id, pid) {
    if($(id).data('starred')) {
        $(id).data('starred', false);
        $(btn).css('color', $(id).data('old-color')).
            attr('class', 'fa fa-fw fa-star-o');
    } else {
        $(id).data('starred', true).
            data('old-color', $(btn).css('color'));
        $(btn).css('color', colFromId(_g.ColourId)).
            attr('class', 'fa fa-fw fa-star');
    }
}


function initThreadPage(transform) {
    _g.Transform = transform;

    switch(transform) {
        case 'bbcode': {
            data.bb_active = 'active';
            break;
        }
        case 'textile': {
            data.tx_active = 'active';
            break;
        }
        default: {
            data.hs_active = 'active';
            break;
        }
    }
}


