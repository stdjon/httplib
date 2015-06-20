var _d = {
    bb_active: '',
    tx_active: '',
    hs_active: '',
    windows: {},
};


// FIXME: template this!
function openExpandingArea(id, label, mode, btn_id) {
    $('<div id="'+ label +'" class="reply post">' +
        '<div class="expanding-area expanding-p-area">' +
            '<pre><span></span><br></pre>' +
            '<textarea id="te-' + label + '" placeholder="['+ mode + ']" name="content"></textarea>' +
        '</div>' +
        '<button class="btn btn-xs btn-warning" value="Preview" ' +
            'onclick="showPreview(\'' + label + '\'); return false;">Preview</button>' +
        '<button class="btn btn-xs btn-success" value="' + mode + '" ' +
            'onclick="submit' + mode + '(\'' + label + '\'); return false;">' + mode + '</button>' +
        '&nbsp;<button class="btn btn-xs btn-danger" value="Cancel" ' +
            'onclick="close' + mode + '(' + label + '\'); return false;">Cancel</button>' +
        '&nbsp;<div id="rnd-' + label + '" class="btn-group" data-toggle="buttons">' +
            '<label id="rnd-' + label + '-bbcode" class="btn btn-xs btn-default btn-info ' + _d.bb_active + '">' +
                '<input type="radio" name="renderer" value="bbcode"/> BBCode' +
            '</label>' +
            '<label id="rnd-' + label + '-textile" class="btn btn-xs btn-default btn-info ' + _d.tx_active + '">' +
                '<input type="radio" name="renderer" value="textile" /> Textile' +
            '</label>' +
            '<label id="rnd-' + label + '-htmlsan" class="btn btn-xs btn-default btn-info ' + _d.hs_active + '">' +
                '<input type="radio" name="renderer" value="htmlsan" /> HTML' +
            '</label>' +
        '</div>' +
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


function close(data, label) {
    var d = _d.windows[label];
    $('#' + label).remove();
    $(d.id).data(data, false);
    $(d.btn_id).css('color', $(d.id).data('old-color'));
}


function reply(btn, id, pid) {
    var btn_id = '#' + $(btn).attr('id');
    var label = 'r' + pid;

    if($(id).data('reply-open')) {
        closeReply(label);

    } else {
        openExpandingArea(id, label, 'Reply', btn_id);
        _d.windows[label] = {
            btn_id: btn_id,
            id: id,
            pid: pid,
        }

        $(id).data('reply-open', true).
            data('old-color', $(btn).css('color'));
        $(btn).css('color', colFromId(_g.ColourId));
    }
}


function closeReply(label) {
    close('reply-open', label);
}


function submitReply(label) {

    var txt = $('#' + label + ' textarea').val();
    var sel = $('#rnd-' + label + ' label.active input').val();
    $.ajax({
        type: 'POST',
        dataType: 'json',
        global: false,
        url: '/createpost',
        data: 'r=' + sel + '&t=' + encodeURIComponent(txt) + '&th=' + _g.ThreadId,
        success: function(data) {
            location.reload(); //urgh...
        }
    });
}


function edit(btn, id, pid) {
    var btn_id = '#' + $(btn).attr('id');
    var label = 'e' + pid;

    if($(id).data('edit-open')) {
        closeEdit(label);

    } else {
        openExpandingArea(id, label, 'Edit', btn_id);
        populateEditData(pid);
        _d.windows[label] = {
            btn_id: btn_id,
            id: id,
            pid: pid,
        }

        $(id).data('edit-open', true).
            data('old-color', $(btn).css('color'));
        $(btn).css('color', colFromId(_g.ColourId));
    }
}


function closeEdit(label) {
    close('edit-open', label);
}


function populateEditData(pid) {
    var label = 'e' + pid;
    $.ajax({
        type: 'POST',
        dataType: 'json',
        global: false,
        url: '/get-post',
        data: 'p=' + pid,
        success: function(data) {
            $('#te-' + label).html(data.i);
            $('#prv-' + label).html(data.o);
            $('#te-' + label).trigger('input');
            $('#rnd-' + label + ' label').removeClass('active');
            $('#rnd-' + label + '-' + data.t).addClass('active');
        }
    });
}


function submitEdit(label) {
    var txt = $('#' + label + ' textarea').val();
    var sel = $('#rnd-' + label + ' label.active input').val();
    var pid = _d.windows[label].pid;
    $.ajax({
        type: 'POST',
        dataType: 'json',
        global: false,
        url: '/update-post',
        data: 'p=' + pid + '&r=' + sel + '&t=' + encodeURIComponent(txt) + '&th',
        success: function(data) {
            var d = _d.windows[label];

            closeEdit(label);
            $('#c-' + pid).html(data.o);
        }
    });
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


function initThreadPage(thid, transform, from, to) {
    _g.ThreadId = thid;
    _g.Transform = transform;
    _g.From = from;
    _g.To = to;

    switch(transform) {
        case 'bbcode': {
            _d.bb_active = 'active';
            break;
        }
        case 'textile': {
            _d.tx_active = 'active';
            break;
        }
        default: {
            _d.hs_active = 'active';
            break;
        }
    }
}


