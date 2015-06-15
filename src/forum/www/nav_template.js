
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
            }
            case 'ehlo': {
                mainWindow = msg.source;
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
                });
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


