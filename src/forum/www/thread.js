var _d = {
    bb_active: '',
    tx_active: '',
    hs_active: '',
    windows: {},
};


var _w = {
    edit: { text: 'Edit', submit: 'submitEdit', cancel: 'closeEdit' },
    reply: { text: 'Reply', submit: 'submitReply', cancel: 'closeReply' },
};


function openWindow(num, wnd_id, text, btn_id, next) {
    var w = _w[text];

    $.ajax({
        type: 'POST',
        dataType: 'text',
        global: false,
        url: '/window',
        data: 'id=' + wnd_id + 
            '&submit=' + w.submit + '&cancel=' + w.cancel + '&text=' + w.text,
        success: function(data) {
            $(data).insertAfter(num);
            $('#te-' + wnd_id).focus();

            initalizeExpandingAreas();

            $('#te-' + wnd_id).keydown(function (e) {

                if(e.ctrlKey && e.keyCode === 13) {
                    $('#btn-' + wnd_id + '-submit').click();
                }
                if(e.keyCode === 27) {
                    $('#btn-' + wnd_id + '-cancel').click();
                }
            });

            next();
        }
    });
}


function showPreview(wnd_id) {
    var txt = $('#' + wnd_id + ' textarea').val();
    var sel = $('#rnd-' + wnd_id + ' label.active input').val();
    $.ajax({
        type: 'POST',
        dataType: 'text',
        global: false,
        url: '/preview-post',
        data: 'r=' + sel + '&t=' + encodeURIComponent(txt),
        success: function(data) {
            $('#prv-' + wnd_id).html(data);
        }
    });
}


function close(data, wnd_id) {
    var d = _d.windows[wnd_id];
    $('#' + wnd_id).remove();
    $(d.num).data(data, false);
    $(d.btn_id).css('color', $(d.num).data('old-color'));
}


function reply(btn, num, pid) {
    var btn_id = '#' + $(btn).attr('id');
    var wnd_id = 'r' + pid;

    if($(num).data('reply-open')) {
        closeReply(wnd_id);

    } else {
        openWindow(num, wnd_id, 'reply', btn_id, function() {
            $('#rnd-' + wnd_id + ' label').removeClass('active');
            $('#rnd-' + wnd_id + '-' + _g.Transform).addClass('active');
            _d.windows[wnd_id] = {
                btn_id: btn_id,
                num: num,
                pid: pid,
            }
        });
        $(num).data('reply-open', true).
            data('old-color', $(btn).css('color'));
        $(btn).css('color', colFromId(_g.ColourId));
    }
}


function closeReply(wnd_id) {
    close('reply-open', wnd_id);
}


function submitReply(wnd_id) {

    var txt = $('#' + wnd_id + ' textarea').val();
    var sel = $('#rnd-' + wnd_id + ' label.active input').val();
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


function edit(btn, num, pid) {
    var btn_id = '#' + $(btn).attr('id');
    var wnd_id = 'e' + pid;

    if($(num).data('edit-open')) {
        closeEdit(wnd_id);

    } else {
        openWindow(num, wnd_id, 'edit', btn_id, function() {
            populateEditData(pid);
            _d.windows[wnd_id] = {
                btn_id: btn_id,
                num: num,
                pid: pid,
            }
        });

        $(num).data('edit-open', true).
            data('old-color', $(btn).css('color'));
        $(btn).css('color', colFromId(_g.ColourId));
    }
}


function closeEdit(wnd_id) {
    close('edit-open', wnd_id);
}


function populateEditData(pid) {
    var wnd_id = 'e' + pid;
    $.ajax({
        type: 'POST',
        dataType: 'json',
        global: false,
        url: '/get-post',
        data: 'p=' + pid,
        success: function(data) {
            $('#te-' + wnd_id).html(data.i);
            $('#prv-' + wnd_id).html(data.o);
            $('#te-' + wnd_id).trigger('input');
            $('#rnd-' + wnd_id + ' label').removeClass('active');
            var t = data.t || _g.Transform;
            $('#rnd-' + wnd_id + '-' + t).addClass('active');
        }
    });
}


function submitEdit(wnd_id) {
    var txt = $('#' + wnd_id + ' textarea').val();
    var sel = $('#rnd-' + wnd_id + ' label.active input').val();
    var pid = _d.windows[wnd_id].pid;
    $.ajax({
        type: 'POST',
        dataType: 'json',
        global: false,
        url: '/update-post',
        data: 'p=' + pid + '&r=' + sel + '&t=' + encodeURIComponent(txt) + '&th',
        success: function(data) {
            var d = _d.windows[wnd_id];

            closeEdit(wnd_id);
            $('#c-' + pid).html(data.o);
        }
    });
}


function quote(btn, num, pid) {
    if($(num).data('quote-open')) {
        $(num).data('quote-open', false);
        $(btn).css('color', $(num).data('old-color'));
    } else {
        $(num).data('quote-open', true).
            data('old-color', $(btn).css('color'));
        $(btn).css('color', colFromId(_g.ColourId));
    }
}


function thumbsup(btn, num, pid) {
    if($(num).data('thumbed')) {
        $(num).data('thumbed', false);
        $(btn).css('color', $(num).data('old-color')).
            attr('class', 'fa fa-fw fa-thumbs-o-up');
    } else {
        $(num).data('thumbed', true).
            data('old-color', $(btn).css('color'));
        $(btn).css('color', colFromId(_g.ColourId)).
            attr('class', 'fa fa-fw fa-thumbs-up');
    }
}


function star(btn, num, pid) {
    if($(num).data('starred')) {
        $(num).data('starred', false);
        $(btn).css('color', $(num).data('old-color')).
            attr('class', 'fa fa-fw fa-star-o');
    } else {
        $(num).data('starred', true).
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


