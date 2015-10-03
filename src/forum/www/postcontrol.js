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
            runSyntaxHighlighter();
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


function close(data, wnd_id, cancel) {
    var d = _d.windows[wnd_id];
    if(cancel) {
        eraseWindowText(wnd_id);
    }
    $('#' + wnd_id).remove();
    $(d.num).data(data, false);
    $(d.btn_id).css('color', $(d.num).data('old-color'));
    delete _d.windows[wnd_id];
}


function replyHoverOver() {
    checkSelection();
    _stopCheckSelection = true;
}


function replyHoverOut() {
    _stopCheckSelection = false;
}


function startSpinner(wnd_id) {
    $('#' + wnd_id + '-submit-spin').html(' <span class="fa fa-pulse fa-spinner"></span>');
}


function stopSpinner(wnd_id) {
    $('#' + wnd_id + '-submit-spin').html('');
}


function reply(btn, num, pid) {
    var btn_id = '#' + $(btn).attr('id');
    var wnd_id = 'r' + pid;

    if($(num).data('edit-open')) {
        closeEdit('e' + pid, false);
    }

    if($(num).data('reply-open')) {
        closeReply(wnd_id, false);

    } else {
        openWindow(num, wnd_id, 'reply', function() {
            $('#rnd-' + wnd_id + ' label').removeClass('active');
            $('#rnd-' + wnd_id + '-' + _g.Transform).addClass('active');
            _d.windows[wnd_id] = {
                btn_id: btn_id,
                num: num,
                pid: pid,
            }
            if(populateReplyData(pid)) {
                showPreview(wnd_id);
            }
            delaySetFocus(wnd_id);
        });
        $(num).data('reply-open', true).
            data('old-color', $(btn).css('color'));
        $(btn).css('color', colFromId(_g.ColourId));
    }
}


function closeReply(wnd_id, cancel) {
    close('reply-open', wnd_id, cancel);
}


function populateReplyData(pid) {
    var wnd_id = 'r' + pid;
    var result = false;

    if(restoreWindowText(wnd_id)) {
        result = true;
    } else {
        var buf = getSelectionAsQuote();

        if(buf) {
            $('#te-' + wnd_id).text(buf);
            $('#te-' + wnd_id).trigger('input');
        }
    }
    return result;
}


function submitReply(wnd_id) {

    var $wnd = $('#' + wnd_id)

    if($wnd.data('replying')) {
        return;
    }

    var sel = $('#rnd-' + wnd_id + ' label.active input').val();
    var txt = encodeURIComponent($('#' + wnd_id + ' textarea').val());
    var tags = encodeTagString($('#tags-' + wnd_id).val());
    var pid = _d.windows[wnd_id].pid;

    function doSubmit() {
        $wnd.data('replying', true);
        startSpinner(wnd_id);
        $.ajax({
            type: 'POST',
            dataType: 'json',
            global: false,
            url: '/createpost',
            data: 'r=' + sel + '&t=' + txt + '&tg=' + tags +
                '&p=' + pid + '&th=' + _g.ThreadId,

            success: function(data) {
                $wnd.data('replying', false);
                closeReply(wnd_id, true);
                reloadPageContent(); //FIXME remove me when live updates work properly :(
                runSyntaxHighlighter();
            },
            error: function() {
                $wnd.data('replying', false);
                stopSpinner(wnd_id);
                Dialog.alert({
                    size: BootstrapDialog.SIZE_LARGE,
                    type: BootstrapDialog.TYPE_DANGER,
                    title: 'Warning',
                    message: 'Could not post (server error).',
                });
            }
        });
    }

    if(txt) {
        doSubmit();
    } else {
        Dialog.confirm({
            size: BootstrapDialog.SIZE_LARGE,
            type: BootstrapDialog.TYPE_WARNING,
            title: 'Warning',
            message: 'Are you sure you want to make a completely empty post?',
            callback:  function(x) {
                if(x) {
                    doSubmit();
                }
            }
        });
    }
}


function edit(btn, num, pid) {
    var btn_id = '#' + $(btn).attr('id');
    var wnd_id = 'e' + pid;

    if($(num).data('reply-open')) {
        closeReply('r' + pid, false);
    }

    if($(num).data('edit-open')) {
        closeEdit(wnd_id, false);

    } else {
        openWindow(num, wnd_id, 'edit', function() {
            if(populateEditData(pid)) {
                showPreview(wnd_id);
            }
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


function closeEdit(wnd_id, cancel) {
    close('edit-open', wnd_id, cancel);
}


function populateEditData(pid) {
    var wnd_id = 'e' + pid;
    var result = false;

    if(restoreWindowText(wnd_id)) {
        result = true;
    } else {
        $.ajax({
            type: 'POST',
            dataType: 'json',
            global: false,
            url: '/get-post',
            data: 'p=' + pid + '&f=true',

            success: function(data) {
                $('#te-' + wnd_id).text(data.i);
                $('#prv-' + wnd_id).html(data.o);
                selectTags($('select#tags-' + wnd_id), decodeTagString(data.tg));
                $('#te-' + wnd_id).trigger('input');
                $('#rnd-' + wnd_id + ' label').removeClass('active');
                var t = data.t || _g.Transform;
                $('#rnd-' + wnd_id + '-' + t).addClass('active');
            }
        });
    }
    return result;
}


function submitEdit(wnd_id) {

    var sel = $('#rnd-' + wnd_id + ' label.active input').val();
    var txt = encodeURIComponent($('#' + wnd_id + ' textarea').val());
    var tags = encodeTagString($('#tags-' + wnd_id).val());
    var pid = _d.windows[wnd_id].pid;

    function doSubmit() {
        startSpinner(wnd_id);
        $.ajax({
            type: 'POST',
            dataType: 'json',
            global: false,
            url: '/update-post',
            data: 'p=' + pid + '&r=' + sel + '&t=' + txt + '&tg=' + tags,

            success: function(data) {
                var d = _d.windows[wnd_id];

                closeEdit(wnd_id, true);
                $('#c-' + pid).html(data.o);
                $('#tg-' + pid).html(tagsHtml(decodeTagString(data.tg)));
                runSyntaxHighlighter();
            },
            error: function() {
                stopSpinner(wnd_id);
                Dialog.alert({
                    size: BootstrapDialog.SIZE_LARGE,
                    type: BootstrapDialog.TYPE_DANGER,
                    title: 'Warning',
                    message: 'Could not edit (server error).',
                });
            }
        });
    }

    if(txt) {
        doSubmit();
    } else {
        Dialog.confirm({
            size: BootstrapDialog.SIZE_LARGE,
            type: BootstrapDialog.TYPE_WARNING,
            title: 'Warning',
            message: 'Are you sure you want to make a completely empty post?',
            callback:  function(x) {
                if(x) {
                    doSubmit();
                }
            }
        });
    }
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


function quoteOpenWindows(on) {
    for(w in _d.windows) {
        if(_d.windows.hasOwnProperty(w)) {
           quote(_d.windows[w].pid, on);
        }
    }
}


var _stopCheckSelection = false;
function checkSelection() {

    if(_stopCheckSelection) { return; }

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
                    if(windowsAreOpen()) {
                        quoteOpenWindows(true);
                    } else {
                        quote(_copy.id, true);
                    }
                }
                _copy.range = rng;
            }
        } else {
            if(_copy.id) {
                quote(_copy.id, false);
            }
            quoteOpenWindows(false);
            _copy.range = undefined;
            _copy.buffer = undefined;
            _copy.id = undefined;
            _copy.user = undefined;
        }
    }
}


function quotePress(pid) {
    var buf = getSelectionAsQuote();

    if(buf) {
        $('#te-e' + pid).val($('#te-e' + pid).val() + buf);
        $('#te-e' + pid).trigger('input');
        $('#te-r' + pid).val($('#te-r' + pid).val() + buf);
        $('#te-r' + pid).trigger('input');

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


function windowsAreOpen() {
    return !$.isEmptyObject(_d.windows);
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
                if($('#te-' + wnd_id).val()) {
                    Dialog.confirm({
                        size: BootstrapDialog.SIZE_LARGE,
                        type: BootstrapDialog.TYPE_DANGER,
                        title: 'Warning',
                        message: 'Do you want to abandon your draft?',
                        callback:  function(x) {
                            if(x) {
                                $('#btn-' + wnd_id + '-cancel').click();
                            }
                        }
                    });
                } else {
                    $('#btn-' + wnd_id + '-cancel').click();
                }
                e.preventDefault();
            }
        }
    }
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



function getSelectionAsQuote() {
    var buf = '';

    if(_copy.user && _copy.buffer) {
        buf = '<q><cite>' + _copy.user + '</cite>' + _copy.buffer + '</q>';
    }

    return buf;
}


function initPostControls() {
    // install handler for (hacked) keypress events from select2 elements
    $('body').on("s2_keypress", function(_, e) {
        var wnd_id = e.id.replace("select2-tags-", "");
        keyHandler(wnd_id, e.open)(e);
    });

    setInterval(checkSelection, 350);

    document.addEventListener('copy', function(e) {
        checkSelection();

        var buf = getSelectionAsQuote();
        if(buf) {
            e.clipboardData.clearData('text/plain');
            e.clipboardData.setData('text/plain', buf);
            e.preventDefault();
        }
        return true;
    });

    $('span[data-thumbed="true"], span[data-starred="true"]').each(function () {
        $(this).css('color', colFromId(_g.ColourId));
    });
}


function initTransform(transform) {
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


function postcontrolKeypress(id) {
    $('#te-' + id).css('background-color', '#eee');
}


function storeOpenWindowsText() {
    for(w in _d.windows) {
        if(_d.windows.hasOwnProperty(w)) {
            try {
                var txt = $('#te-' + w).val();
                var rnd = $('#rnd-' + w + ' label.active input').val();
                var tag = encodeTagString($('#tags-' + w).val());
                var data = txt + '\0' + rnd + '\0' + tag;

                setLocalData(w, data);
                $('#te-' + w).css('background-color', '#ffe');
            } catch(e) {}
        }
    }
}


function restoreWindowText(w) {
    var data = (getLocalData(w) || '\0\0').split('\0');
    var txt = data[0];
    var rnd = data[1];
    var tag = decodeTagString(data[2]);
    var pid = w.replace(/^[er]/, '');
    if(txt) {
        $('#te-' + w).text(txt);
        $('#rnd-' + w + ' label').removeClass('active');
        $('#rnd-' + w + '-' + rnd).addClass('active');
        selectTags($('select#tags-' + w), tag);
        return true;
    }
    return false;
}


function eraseWindowText(w) {
    try {
        removeLocalData(w);
    } catch(e) {}
}


onbeforeunload = storeOpenWindowsText;

$(document).ready(function() {

    setInterval(storeOpenWindowsText, 15000);
});


//------------------------------------------------------------------------------
// localStorage management

var LOCAL_DATA_SIZE = 50;
var LOCAL_DATA_PREFIX = 'wnd';


function getLocalData(k) {
    return localStorage[LOCAL_DATA_PREFIX + '.val.' + k];
}


function setLocalData(k, v) {
    try {
        localStorage[LOCAL_DATA_PREFIX + '.val.' + k] = v;
        var idx = getLocalIndex();
        var index = idx.indexOf(k);
        if(index <= -1) {
            idx.push(k);
        }
        setLocalIndex(idx);
        if(idx.length > LOCAL_DATA_SIZE) {
            removeLocalData(idx.shift());
        }
    } catch(e) {}
}


function removeLocalData(k) {
    var idx = getLocalIndex();
    var index = idx.indexOf(k);
    if(index > -1) {
        idx.splice(index, 1);
        setLocalIndex(idx);
    }
    localStorage.removeItem(LOCAL_DATA_PREFIX + '.val.' + k);
}


function getLocalIndex() {
    var idx = localStorage[LOCAL_DATA_PREFIX + '.idx'];
    if(idx) {
        return JSON.parse(idx);
    }
    return [];
}


function setLocalIndex(idx) {
    try {
        localStorage[LOCAL_DATA_PREFIX + '.idx'] = JSON.stringify(idx);
    } catch(e) {}
}



function runSyntaxHighlighter() {
    if(window['SyntaxHighlighter']) {
        SyntaxHighlighter.highlight();
        setTimeout(function() {
            SyntaxHighlighter.highlight(); }, 1500); // FIXME: so gross...
    }
}
