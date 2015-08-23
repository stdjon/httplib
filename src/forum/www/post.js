var _source;

function initEventSource() {

    if(!_source) {
        _source = new EventSource('/updates');
        _source.addEventListener('update', function(e) {

            var d = JSON.parse(e.data);

            if( (d.type === 'post') &&
                (d.post_id === _g.PostId) ) {

                switch(d.action) {

                    case 'create':
                    case 'update': {

                        $.ajax({
                            type: 'POST',
                            dataType: 'json',
                            global: false,
                            url: '/get-post',
                            data: 'p=' + _g.PostId,
                            success: function(data) {
                                $('#c-' + _g.PostId).html(data.o);
                                $('#tg-' + _g.PostId).html(tagsHtml(decodeTagString(data.tg)));
                            }
                        });
                        break;
                    }
                    case 'thumb': {
                        $('#tc-' + d.post_id).text(d.count);
                        break;
                    }
                    case 'star': {
                        $('#bc-' + d.post_id).text(d.count);
                        break;
                    }
                }
            }
        });
    }
}


function initPostPage(post_id, thread_id, transform) {
    _g.PostId = post_id;
    _g.ThreadId = thread_id;
    _g.Transform = transform;
    initEventSource();
    initTransform(transform);
}


$(document).ready(function() {
    initPostControls();
});
