var _reinitHooks = [];

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
                break;
            }
            case 'tokDown': {
                reloadPageContent();
                break;
            }

            case 'warn': {
                switch(cmd[1]) {
                    case 'info': {
                        Dialog.alert({
                            size: BootstrapDialog.SIZE_LARGE,
                            type: BootstrapDialog.TYPE_DANGER,
                            title: 'Warning',
                            message: cmd[3],
                            callback:  function() {
                                if(cmd[2]) {
                                    postIframeMessage(cmd[2]);
                                }
                            }
                        });
                        break;
                    }
                    case 'check': {
                        Dialog.confirm({
                            size: BootstrapDialog.SIZE_LARGE,
                            type: BootstrapDialog.TYPE_DANGER,
                            title: 'Warning',
                            message: cmd[3],
                            callback:  function(x) {
                                if(cmd[2]) {
                                    postIframeMessage(cmd[2], x ? 'yes' : 'no');
                                }
                            }
                        });
                        break;
                    }
                }
            }
        }
    }
});


function initPage() {
    resetProperties(_g);
    resetReloadableContent();
    normalizeLocation();
    postIframeMessage('ehlo');
    initHdrCols();
    initFonts();
    resetScrollspyAffix();

    $('a, b, blockquote, div, em, h1, h2, h3, h4, h5, h6, ' +
        'i, li, ol, p, q, span, strong, u, ul').hyphenate($('html').attr('lang'));

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
            initPage();
            $.each(_reinitHooks, function(_, f) {
                f();
            });
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
    if(_g.Browser === 'Chrome') {
        // hypher breaks drop-caps on Chrome - apply it as inserted CSS after
        // page load is complete.
        //
        $('head').append('<style>' +
            'div[id=\'1\'] div.post div.content::first-letter {' +
                'font-size: 2.8em;' +
                'line-height: 1em;' +
                'margin-right: 2px;' +
                'display: block;' +
                'float: left;' +
            '}</style>');
    }
}


// remove any _$x=x components from location.search
function normalizeLocation() {
    if(location.search.match(/.*_\$.*/)) {
        var queries = {};
        $.each(location.search.substr(1).split('&'), function(_, q) {
            var i = q.split('=');
            var k = i[0].toString();
            var v = i[1].toString();
            if(!k.match(/^_\$/)) {
                queries[k] = v;
            }
        });
        var str = '';
        var first = true;
        $.each(queries, function(k, v) {
            str += (first ? '?' : '&');
            str += (k + '=' + v);
            first = false;
        });
        if(str === '?') {
            str = '';
        }
        history.replaceState({}, document.title,
            location.origin + location.pathname + str);
    }
}


function reloadCustomStylesheet() {
    var qx = 'qx=' + new Date().getTime();
    var css = $('link#custom-styles');
    var href = css.attr('href');
    if(href.match(/qx=/)) {
        href = href.replace(/qx=[^&]*/, qx);
    } else {
        href = href + (href.match(/.+\?/) ? '&' : '?') + qx;
    }
    css.attr('href',  href);
}


_reinitHooks.push(reloadCustomStylesheet);
