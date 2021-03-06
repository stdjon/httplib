var _source;


function initEventSource() {

    if(!_source) {
        _source = new EventSource('/updates');
        _source.addEventListener('update', function(e) {

            var d = JSON.parse(e.data);

            if(d.type === 'post') {
                if( (d.action === 'create') &&
                    (d.thread_id === _g.ThreadId) ) {

                    if( (d.post_num >= _g.From) &&
                        (d.post_num <= _g.To) ) {

                        // Give time for closeReply()
                        setTimeout(function() {
                            fetchNewPost(d);
                        }, 100);
                    } else {
                        // TODO...
                    }

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

                } else if( (d.action === 'thumb') &&
                    (_g.Posts.indexOf(d.post_id) >= 0) ) {

                    $('#tc-' + d.post_id).text(d.count);

                } else if( (d.action === 'star') &&
                    (_g.Posts.indexOf(d.post_id) >= 0) ) {

                    $('#bc-' + d.post_id).text(d.count);
                }
            }
        });
    }
}


function fetchNewPost(d) {

    function checkOpenWindows(el) {
        var next = el.next();
        var id = next ? next.attr('id') : undefined;
        if(id && id.match(/[er][0-9]+/)) {
            el = next;
        }
        return el;
    }

    $.ajax({
        type: 'POST',
        dataType: 'text',
        global: false,
        url: '/newpost',
        data: 'pid=' + d.post_id + '&pn=' + d.post_num,

        success: function(data) {
            var current = $('div#' + d.post_num);
            current = checkOpenWindows(current);
            if(current) {
                current.html(data);
            } else {
                var previous = $('div#' + (d.post_num - 1));
                previous = checkOpenWindows(previous);
                if(previous) {
                    $(data).insertAfter(previous);
                    _g.Posts.push(d.post_id);
                }
            }
        }
    });
}


function initThreadPage(thid, transform, from, to, posts) {
    _g.ThreadId = thid;
    _g.Transform = transform;
    _g.From = from;
    _g.To = to;
    _g.Posts = posts;

    initTransform(transform);

    initEventSource();
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


var _isEdit = false;
var _isEditCancel = false;
function editTitle() {

    function resetState() {
        if(!_isEditCancel) {
            var title = $('#title-text').val();
            $('#title').text(title);
            document.title = title;
        }
        $('#title').css('display', 'inline');
        $('#title-edit').css('display', 'none');
        $('#edit').removeClass('fa-check').addClass('fa-edit');
        $('#edit').attr('title', 'Update thread title');
        $('#title-text').keydown(undefined);
    }

    if(_isEdit) {
        var title = $('#title-text').val();
        //alert('New title: "' + title + '"');
        if(_isEditCancel) {
            resetState();
            _isEditCancel = false;
            _isEdit = false;
        } else {
            $.ajax({
                type: 'POST',
                dataType: 'text',
                global: false,
                url: '/update-title',
                data: 'th=' + _g.ThreadId + '&t=' + encodeURIComponent(title),
                success: resetState,
                error: function() {
                    alert('error updating title :(');
                },
                complete: function() {
                    _isEdit = false;
                }
            });
        }
    } else {
        var title = $('#title').text();
        $('#title').css('display', 'none');
        $('#title-edit').css('display', 'block');
        $('#title-text').text(title).focus();
        $('#edit').removeClass('fa-edit').addClass('fa-check');
        $('#edit').attr('title', 'Update thread title');
        initalizeExpandingAreas();
        $('#title-text').keydown(titleKeyHandler);

        _isEdit = true;
    }
}


function titleKeyHandler(e) {
    if(e.ctrlKey) {
        switch(e.keyCode) {
            case 13: { //'Enter'
                editTitle();
                e.preventDefault();
                break;
            }
        }
    }
    if(e.keyCode === 27) {
        _isEditCancel = true;
        editTitle();
        e.preventDefault();
    }
}


function onAnchorScroll(id) {
    markPostRead(id);
}


function markPostRead(id) {
    if(parseInt(id) > 0) {
        $.ajax({
            type: 'POST',
            dataType: 'text',
            url: '/read-post',
            data: 'th=' + _g.ThreadId + '&n=' + id,
        });
    }
}

$(document).ready(function() {
    initPostControls();
    var hash = document.location.hash;
    if(hash) {
        markPostRead(hash.replace(/^#/, ''));
    }
});
