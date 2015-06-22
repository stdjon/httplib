//scroll updates URL
$(document).bind('scroll',function(e) {
    $('.anchor').each(function() {
        $(this).removeClass('trg');
        if ( $(this).offset().top < pageYOffset + 25 &&
            $(this).offset().top + $(this).height() > pageYOffset + 25 ) {
                $(this).addClass('trg');
                var id_ = $(this).attr('id') || '';
                var id = '#' + id_;
                var oldId = location.hash;
                if(oldId !== id) {
                    if(history.replaceState) {
                        history.replaceState({}, document.title + ' ' + id, id);
                    } else {
                        $(this).attr('id', undefined);
                        location.hash = id;
                        $(this).attr('id', id_);
                    }
                }
            }
        });
});


// iframe communication
function postIframeMessage() {
    var msg = Array.prototype.join.call(arguments, '/');
    var f = document.getElementById('navbar-frame');
    var w = f.contentWindow;
    w.postMessage(msg, _g.DefaultSecurePrefix);
}


addEventListener("message", function(msg) {

    if(_g.DefaultSecurePrefix === msg.origin) {
        var cmd = msg.data.split('/');

        switch(cmd[0]) {
            case 'nav': {
                if('show' == cmd[1]) {
                    $('#navbar-frame').height(cmd[2]);
                } else {
                    $('#navbar-frame').height('50px');
                }
                break;
            }

            case 'tokUp': {
                $.ajax({
                    type: 'POST',
                    dataType: 'text',
                    global: false,
                    url: '/tok-check',
                    data: 't=' + cmd[1],
                    success: function(data) {
                        reloadPageContent();
                    }
                });
            }
        }
    }
});


function pageInit() {
    postIframeMessage('ehlo');
    initHdrCols();
    initFonts();
    resetScrollspyAffix();

    $('*').hyphenate($('html').attr('lang'));

    initDropCaps();

    $(window).resize(function(){
        resetScrollspyAffix();
    });
}


function reloadPageContent() {
    $.ajax({
        type: 'GET',
        dataType: 'text',
        url: _g.CurrentUrlUnescaped + '?_$content=1',
        success: function(data) {
            $('#mainspace').html(data);
            pageInit();
        }

    });
}


function resetScrollspyAffix() {
    $('[data-spy="scroll"]').each(function() {
        $(this).scrollspy('activate').scrollspy('process');
    });
    $('[data-spy="affix"]').each(function () {
        var affix_data = $(this).data('bs.affix')
        var top = $('#banner').outerHeight(true) * .75;

        if(affix_data) {
            // This is the only way I can find to update the initial affix
            // offsets, and at this point, I'm past caring any more...
            affix_data.options.offset.top = top;
            $(this).affix('checkPosition');
        } else {
            $(this).affix({
                offset: {
                    top: top
                }
            }).affix('checkPosition');
        }
    });
}


function initDropCaps() {

    // hypher breaks drop-caps - reapply it as inserted CSS
    $('head').append('<style>' +
        'div[id=\'1\'] div.post::first-letter {' +
            'font-size: 2.8em;' +
            'line-height: 1em;' +
            'margin-right: 2px;' +
            'display: block;' +
            'float: left;' +
        '}</style>');
}
