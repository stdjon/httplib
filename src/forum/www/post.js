var _source;

function initEventSource() {

    if(!_source) {
        _source = new EventSource('/updates');
        _source.addEventListener('update', function(e) {

            var d = JSON.parse(e.data);

            if( (d.type === 'post') &&
                (d.post_id === _g.PostId) ) {

                $.ajax({
                    type: 'POST',
                    dataType: 'json',
                    global: false,
                    url: '/get-post',
                    data: 'p=' + _g.PostId,
                    success: function(data) {
                        $('#post-content').html(data.o);
                        $('#post-tags').html(tagsHtml(decodeTagString(data.tg)));
                    }
                });
            }
        });
    }
}

function initPostPage(post_id) {
    _g.PostId = post_id;
    initEventSource();
}
