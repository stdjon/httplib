var mainWindow = null;

function postMainWindowMessage() {
    var msg = Array.prototype.join.call(arguments, '/');
    mainWindow.postMessage(msg, '*');
}


addEventListener("message", function(msg) {
    if( (_g.DefaultSecurePrefix === msg.origin) ||
        (_g.DefaultInsecurePrefix === msg.origin) ) {
        var cmd = msg.data.split('/');
        switch(cmd[0]) {
            case 'hdrCol': {
                var z = document.getElementById('navbar-outside');
                z.style.borderLeftColor = cmd[1];
                break;
            }
            case 'font': {
                setFonts(cmd[1], true);
                break;
            }
            case 'ehlo': {
                mainWindow = msg.source;
                break;
            }
            case 'fonts': {
                $('head').append(
                    '<link rel="stylesheet" type="text/css" href="/custom-fonts.css">');
                break;
            }
            case 'tokTmp': {
                $.ajax({
                    type: 'POST',
                    url: _g.DefaultSecurePrefix + '/tok-set',
                    data: 'id={{Id}}&t=' + cmd[1], //cmd[1] already encoded...
                    contentType: 'text/plain',
                    success: function(data) {
                        postMainWindowMessage('tokUp', encodeURIComponent(data));
                    },
                    error: function() {
                        postMainWindowMessage('tokDown');
                    },
                });
            }
            case 'signout': {
                if('yes' === cmd[1]) {
                    $('#signout-form').submit();
                }
                break;
            }
        }
    }
});


// tell main window about navbar collapses so it can resize the iframe...
$('#navbar').on('show.bs.collapse', function() {
    postMainWindowMessage('nav', 'show', navCollapseHeight);
});


$('#navbar').on('hidden.bs.collapse', function() {
    postMainWindowMessage('nav', 'hide');
});


// signin button handler
$('#do-signin').click(function(e) {
    e.preventDefault();
    var u = $('#in-user').val();
    var pw = $('#in-password').val();
    $.ajax({
        type: 'POST',
        url: _g.DefaultSecurePrefix + '/nav-signin',
        data: 'user=' + u + '&password=' + pw,
        statusCode: {
            200: function() {
                // reloadPage()?
                top.location = _g.CurrentUrl;
            },
            403: function() {
                postMainWindowMessage(
                    'warn', 'info', '', 'Invalid username or password.');
            }
        },
    });
    return false;
});


// signout button handler
$('#do-signout').click(function(e) {
    e.preventDefault();
    postMainWindowMessage(
        'warn', 'check', 'signout', 'Are you sure you want to sign out?');
});
