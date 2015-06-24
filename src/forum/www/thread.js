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

            initalizeExpandingAreas();

            $('#te-' + wnd_id).keydown(keyHandler(wnd_id, false));

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
            delaySetFocus(wnd_id);
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

    var sel = $('#rnd-' + wnd_id + ' label.active input').val();
    var txt = encodeURIComponent($('#' + wnd_id + ' textarea').val());
    var tags = encodeTagString($('#tags-' + wnd_id).val());
    var pid = _d.windows[wnd_id].pid;
    $.ajax({
        type: 'POST',
        dataType: 'json',
        global: false,
        url: '/createpost',
        data: 'r=' + sel + '&t=' + txt + '&tg=' + tags +
            '&p=' + pid + '&th=' + _g.ThreadId,
        success: function(data) {
            reloadPageContent();
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
            $('#te-' + wnd_id).focus();
            _d.windows[wnd_id] = {
                btn_id: btn_id,
                num: num,
                pid: pid,
            }
            delaySetFocus(wnd_id);
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
            selectTags($('select#tags-' + wnd_id), decodeTagString(data.tg));
            $('#te-' + wnd_id).trigger('input');
            $('#rnd-' + wnd_id + ' label').removeClass('active');
            var t = data.t || _g.Transform;
            $('#rnd-' + wnd_id + '-' + t).addClass('active');
        }
    });
}


function submitEdit(wnd_id) {

    var sel = $('#rnd-' + wnd_id + ' label.active input').val();
    var txt = encodeURIComponent($('#' + wnd_id + ' textarea').val());
    var tags = encodeTagString($('#tags-' + wnd_id).val());
    var pid = _d.windows[wnd_id].pid;

    $.ajax({
        type: 'POST',
        dataType: 'json',
        global: false,
        url: '/update-post',
        data: 'p=' + pid + '&r=' + sel + '&t=' + txt + '&tg=' + tags,
        success: function(data) {
            var d = _d.windows[wnd_id];

            closeEdit(wnd_id);
            $('#c-' + pid).html(data.o);
            $('#tg-' + pid).html(tagsHtml(decodeTagString(data.tg)));
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


// encode tag string (the individual tags do get double-URIencoded...)
function encodeTagString(tags) {
    tags = tags || [];
    for(var i = 0; i < tags.length; i++) {
        tags[i] = encodeURIComponent(tags[i]);
    }
    tags = tags.join('\0');
    return encodeURIComponent(tags);
}

function decodeTagString(tags) {
    tags = tags || "";
    tags = decodeURIComponent(tags);
    tags = tags.split('\0');
    var result = [];
    var j = 0;
    for(var i = 0; i < tags.length; i++) {
        var d = decodeURIComponent(tags[i]);
        if(d.length > 0) {
            result[j++] = d;
        }
    }
    return result;
}


// insert tag array into the select2 object as selected options, so the tags
// field is populated properly...
function selectTags(select, tags) {
    for(var i = 0; i < tags.length; i++) {
        var opt = $('<option></option>').
            attr('selected', true).text(tags[i]).val(tags[i]);
        opt.appendTo(select);
    }
    select.trigger('change');
}


function tagsHtml(tags) {
    var result = '';
    if(tags.length > 0) {
        result = 'Filed under: ';
        for(var i = 0; i < tags.length; i++) {
            result += '[<a href="' + _g.DefaultPrefix + '/tg/' +
                encodeURIComponent(tags[i]) + '">' + tags[i] + '</a>] '
        }
    }
    return result;
}


// FIXME?
function delaySetFocus(wnd_id) {
    setTimeout(function() {
        $('#te-' + wnd_id).focus();
    }, 100);
}


function keyHandler(wnd_id, suppress_open_close) {
    return function(e) {
        if(e.ctrlKey) {
            switch(e.keyCode) {
                case 13: { //'Enter'
                    if(!suppress_open_close) {
                        $('#btn-' + wnd_id + '-submit').click();
                        e.preventDefault();
                    }
                    break;
                }
                case 80: { //'P'
                    $('#btn-' + wnd_id + '-preview').click();
                    e.preventDefault();
                    break;
                }
                case 85: { //'U'
                    $('#btn-' + wnd_id + '-bb').click();
                    e.preventDefault();
                    break;
                }
                case 73: { //'I'
                    $('#btn-' + wnd_id + '-tx').click();
                    e.preventDefault();
                    break;
                }
                case 79: { //'O'
                    $('#btn-' + wnd_id + '-hs').click();
                    e.preventDefault();
                    break;
                }
            }
        }
        if(e.keyCode === 27) {
            if(!suppress_open_close) {
                $('#btn-' + wnd_id + '-cancel').click();
                e.preventDefault();
            }
        }
    }
}


// install handler for (hacked) keypress events from select2 elements
$(document).ready(function() {
    $('body').on("s2_keypress", function(_, e) {
        var wnd_id = e.id.replace("select2-tags-", "");
        keyHandler(wnd_id, e.open)(e);
    });
})
