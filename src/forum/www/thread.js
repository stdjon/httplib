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


var _copy = {
    range: undefined,
    buffer: undefined,
    id: undefined,
    user: undefined,
};

var _source;


function initEventSource() {

    if(!_source) {
        _source = new EventSource('/updates');
        _source.addEventListener('update', function(e) {

            var d = JSON.parse(e.data);

            if(d.type === 'post') {
                if( (d.action === 'create') &&
                    (d.thread_id === _g.ThreadId) ) {

                    reloadPageContent();

                } else if( (d.action === 'update') &&
                    (_g.Posts.indexOf(d.post_id) >= 0) ) {

                    $.ajax({
                        type: 'POST',
                        dataType: 'json',
                        global: false,
                        url: '/get-post',
                        data: 'p=' + d.post_id,
                        success: function(data) {
                            $('#c-' + d.post_id).html(data.o);
                        }
                    });
                }
            }
        });
    }
}


function openWindow(num, wnd_id, text, next) {
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


function close(data, wnd_id) {
    var d = _d.windows[wnd_id];
    $('#' + wnd_id).remove();
    $(d.num).data(data, false);
    $(d.btn_id).css('color', $(d.num).data('old-color'));
}


function reply(btn, num, pid) {
    var btn_id = '#' + $(btn).attr('id');
    var wnd_id = 'r' + pid;

    if($(num).data('edit-open')) {
        closeEdit('e' + pid);
    }

    if($(num).data('reply-open')) {
        closeReply(wnd_id);

    } else {
        openWindow(num, wnd_id, 'reply', function() {
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

    var $wnd = $('#' + wnd_id)

    if($wnd.data('replying')) {
        return;
    }
    $wnd.data('replying', true);

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
        },
        error: function() {
            $wnd.data('replying', false);
            Dialog.alert({
                size: BootstrapDialog.SIZE_LARGE,
                type: BootstrapDialog.TYPE_DANGER,
                title: 'Warning',
                message: 'Could not post (server error).',
            });
        }
    });
}


function edit(btn, num, pid) {
    var btn_id = '#' + $(btn).attr('id');
    var wnd_id = 'e' + pid;

    if($(num).data('reply-open')) {
        closeReply('r' + pid);
    }

    if($(num).data('edit-open')) {
        closeEdit(wnd_id);

    } else {
        openWindow(num, wnd_id, 'edit', function() {
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
        data: 'p=' + pid + '&f=true',

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
        },
        error: function() {
            Dialog.alert({
                size: BootstrapDialog.SIZE_LARGE,
                type: BootstrapDialog.TYPE_DANGER,
                title: 'Warning',
                message: 'Could not edit (server error).',
            });
        }
    });
}


function quote(pid, on) {
    var num = '#q-' + pid;
    if(on) {
        if(!$(num).data('quote-open')) {
            $(num).data('quote-open', true).
                data('old-color', $(num).css('color'));
            $(num).css('color', colFromId(_g.ColourId));
        }
    } else {
        if($(num).data('quote-open')) {
            $(num).data('quote-open', false);
            $(num).css('color', $(num).data('old-color'));
        }
    }
}


function checkSelection() {

    var sel = document.getSelection();
    if(sel && sel.rangeCount > 0) {

        var rng = sel.getRangeAt(0);
        if( rng && !rng.collapsed) {
            if( (!_copy.range ||
                    (rng.compareBoundaryPoints(Range.START_TO_START, _copy.range) != 0) ||
                    (rng.compareBoundaryPoints(Range.END_TO_END, _copy.range) != 0)) ) {

                var node = rng.commonAncestorContainer;
                var ele = node;
                if(Node.ELEMENT_NODE !== node.nodeType) {
                    ele = node.parentElement;
                }
                while(node && !node.id) {
                    node = node.parentElement;
                }
                if(node && node.id.match(/c-[0-9]+/)) {
                    var got;
                    var el = document.createElement(ele.tagName);
                    el.appendChild(rng.cloneContents());

                    for(var i = 0; i < el.children.length; i++) {
                        var e = el.children[i];
                        for(var j = 0; j < e.attributes.length; j++) {
                            e.removeAttribute(e.attributes[j].name);
                        }
                    }
                    switch(ele.tagName) {
                        case 'DIV': case 'P': case 'SPAN':
                        case 'div': case 'p': case 'span': {
                            got = el.innerHTML;
                            break;
                        }
                        default: {
                            got = el.outerHTML;
                            break;
                        }
                    }
                    _copy.buffer = got;
                    _copy.id = node.id.replace('c-', '');
                    _copy.user = node.getAttribute('data-author');
                    quote(_copy.id, true);
                }
                _copy.range = rng;
            }
        } else {
            if(_copy.id) {
                quote(_copy.id, false);
            }
            _copy.range = undefined;
            _copy.buffer = undefined;
            _copy.id = undefined;
            _copy.user = undefined;
        }
    }
}


function thumbsup(btn, pid) {
    var cnt = '#tc-' + pid;
    if($(btn).data('thumbed')) {
        $.ajax({
            type: 'POST',
            dataType: 'text',
            global: false,
            url: '/thumb',
            data: 'p=' + pid,

            success: function(data) {
                $(btn).data('thumbed', false).
                    css('color', $(btn).data('old-color')).
                    attr('class', 'fa fa-fw fa-thumbs-o-up');
                var c = $(cnt).text();
                if(c > 0) { c--; }
                $(cnt).text(c);
            }
        });
    } else {
        $.ajax({
            type: 'POST',
            dataType: 'text',
            global: false,
            url: '/thumb',
            data: 'p=' + pid + '&on=true',

            success: function(data) {
                $(btn).data('thumbed', true).
                    data('old-color', $(btn).css('color')).
                    css('color', colFromId(_g.ColourId)).
                    attr('class', 'fa fa-fw fa-thumbs-up');
                var c = $(cnt).text();
                c++;
                $(cnt).text(c);
            }
        });
    }
}


function star(btn, pid) {
    var cnt = '#bc-' + pid;
    if($(btn).data('starred')) {
        $.ajax({
            type: 'POST',
            dataType: 'text',
            global: false,
            url: '/star',
            data: 'p=' + pid,

            success: function(data) {
                $(btn).data('starred', false).
                    css('color', $(btn).data('old-color')).
                    attr('class', 'fa fa-fw fa-star-o');
                var c = $(cnt).text();
                if(c > 0) { c--; }
                $(cnt).text(c);
            }
        });
    } else {
        $.ajax({
            type: 'POST',
            dataType: 'text',
            global: false,
            url: '/star',
            data: 'p=' + pid + '&on=true',

            success: function(data) {
                $(btn).data('starred', true).
                    data('old-color', $(btn).css('color')).
                    css('color', colFromId(_g.ColourId)).
                    attr('class', 'fa fa-fw fa-star');
                var c = $(cnt).text();
                c++;
                $(cnt).text(c);
            }
        });
    }
}


function initThreadPage(thid, transform, from, to, posts) {
    _g.ThreadId = thid;
    _g.Transform = transform;
    _g.From = from;
    _g.To = to;
    _g.Posts = posts;

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

    $('span[data-thumbed="true"], span[data-starred="true"]').each(function () {
        $(this).css('color', colFromId(_g.ColourId));
    });

    initEventSource();
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


function replyFirst() {
    openWindow('#0', 'r0', 'reply', function() {
        $('#0').remove();
        $('#rnd-r0 label').removeClass('active');
        $('#rnd-r0-' + _g.Transform).addClass('active');
        _d.windows['r0'] = {
            btn_id: '',
            num: '#0',
            pid: 'X',
        }
        delaySetFocus('r0');
    });
}


// install handler for (hacked) keypress events from select2 elements
$(document).ready(function() {
    $('body').on("s2_keypress", function(_, e) {
        var wnd_id = e.id.replace("select2-tags-", "");
        keyHandler(wnd_id, e.open)(e);
    });

    setInterval(checkSelection, 350);

    document.addEventListener('copy', function(e) {
        checkSelection();

        if(_copy.user && _copy.buffer) {
            var buf = '<q><cite>' + _copy.user + '</cite>' + _copy.buffer + '</q>';
            e.clipboardData.clearData('text/plain');
            e.clipboardData.setData('text/plain', buf);
            e.preventDefault();
        }
        return true;
    });
})
