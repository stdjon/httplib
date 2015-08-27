var prf = {
    motto: '',
    secret: '',
    _loc: '',
    email: '',
    col_id: '',
    trans: '',
    font: '',
    monoFont: '',
};


function setPrefs(m, l, c, t, f, mf) {
    _g.Motto = prf.motto = m;
    _g.Location = prf._loc = l;
    _g.ColourId = prf.col_id = c;
    _g.Transform = prf.trans = t;
    _g.FontClass = prf.font = f;
    _g.MonoFontClass = prf.monoFont = mf;
    $('span#' + c).addClass('selected');

    _reinitHooks.push(enableAvatarDragDrop);

    if($('#email').length > 0) {
        $.ajax({
            type: 'POST',
            dataType: 'json',
            global: false,
            url: '/get-email',
            success: function(data) {
                _g.Email = prf.email = data.e;
                _g.Secret = prf.secret = data.s;
                $('#email').val(data.e);
                $('#secret').val(data.s);
            },
            error: function() {
            }
        });
    }
}


function onKeypress() {
    prf.motto = $('#motto').val();
    prf.secret = $('#secret').val();
    prf._loc = $('#_loc').val();
    prf.email = $('#email').val();
    prf.trans = $('#transform label.active input').val();
    prf.font = $('#font label.active input').val();
    prf.monoFont = $('#mono label.active input').val();
    var ok1 = (prf.motto !== _g.Motto);
    var ok2 = (prf.secret !== _g.Secret);
    var ok3 = (prf._loc !== _g.Location);
    var ok4 = (prf.email !== _g.Email);
    var ok5 = (prf.col_id !== _g.ColourId);
    var ok6 = (prf.trans !== _g.Transform);
    var ok7 = (prf.font !== _g.FontClass);
    var ok8 = (prf.monoFont !== _g.MonoFontClass);
    var canupdate = ok1 || ok2 || ok3 || ok4 || ok5 || ok6 || ok7 || ok8;
    $('#update').attr('disabled', canupdate ? null : 'disabled');
    $('#notify').html('');
}


function onRadio(font) {
    // setTimeout() is a bit of a cheat, but it'll do for now...
    setTimeout(function() {
        onKeypress();
        if(font) {
            setFonts(prf.font, prf.monoFont);
        }
    }, 250);
}


function update() {
    prf.secret = $('#secret').val(); //due to /get-email
    prf.email = $('#email').val(); //due to /get-email
    $.ajax({
        type: 'POST',
        dataType: 'text',
        global: false,
        url: '/prefs',
        data: 'm=' + encodeURIComponent(prf.motto) +
            '&s=' + encodeURIComponent(prf.secret) +
            '&l=' + encodeURIComponent(prf._loc) +
            '&e=' + encodeURIComponent(prf.email) +
            '&c=' + prf.col_id +
            '&r=' + prf.trans +
            '&f=' + prf.font +
            '&mf=' + prf.monoFont,
        success: function() {
            $('#update').attr('disabled', 'disabled');
            $('#notify').html('Preferences updated!');
            setPrefs(prf.motto, prf._loc, prf.col_id, prf.trans, prf.font, prf.monoFont);
        },
        error: function() {
            $('#notify').html('Unable to update the prefences!');
        }
    });
}


function selectSwatch(col_id) {
    $('span.swatch').removeClass('selected');
    $('span#' + col_id).addClass('selected');
    setHdrCols(col_id);
    prf.col_id = col_id;
    onKeypress();
}


function testEmail() {
    var email = $('#email').val();
    $.ajax({
        type: 'POST',
        dataType: 'text',
        global: false,
        url: '/test-email',
        data: 'e=' + encodeURIComponent(email),
        complete: function() {
            var msg = '<em>Sent an email to <tt>' + email + '</tt>. You may ' +
                'want to check your spam settings if the email doesn\'t arrive ' +
                'soon.';
            if(email != _g.Email) {
                msg += ' Don\'t forget to hit Update to save this new address!';
            }
            msg += '</em>';
            $('#email-fb').html(msg);
        }
    });
}



function enableAvatarDragDrop() {
    var dropzone = document.querySelector("#avatar-drop");
    var preview = document.querySelector("#avatar-show");

    if(!dropzone || !preview) {
        return;
    }

    dropzone.addEventListener("change", function(e) {
        acceptFile(e.target.files[0]);
    });

    preview.addEventListener("click", function (e) {
        if (dropzone) {
            dropzone.click();
        }
        e.preventDefault(); // prevent navigation to "#"
    }, false);

    function setDragDrop(element) {
        element.addEventListener("dragover", function(e) {
            if(e.preventDefault) { e.preventDefault(); }
            if(e.stopPropagation) { e.stopPropagation(); }
            e.dataTransfer.dropEffect = "copy";
        });
        element.addEventListener("dragenter", function(e) {
            this.className = "hover";
        });
        element.addEventListener("dragleave", function(e) {
            this.className = "";
        });
        element.addEventListener("drop", function(e) {
            if(e.preventDefault) { e.preventDefault(); }
            if(e.stopPropagation) { e.stopPropagation(); }
            this.className = "";
            var f = e.dataTransfer.files;
            alert(JSON.stringify({e:e.dataTransfer}));
            if (f.length > 0) {
                acceptFile(f[0]);
            } else {
                failed();
            }
        });
    }

    setDragDrop(dropzone);
    setDragDrop(preview);

    function acceptFile(f) {
        alert(JSON.stringify(f));

        document.querySelector('#avatar-work').innerHTML =
            'Working...<span class="fa fa-spinner fa-pulse"></span>';

        var reader = new FileReader();

        reader.onloadend = function(e) {
            if (e.target.readyState == FileReader.DONE) {
                var content = reader.result;
                preview.src = content;
                //document.querySelector('#dataurl').innerHTML = content;
                $.ajax({
                    type: 'POST',
                    dataType: 'text',
                    global: false,
                    url: '/upload-avatar',
                    data: 'f=' + encodeURIComponent(content),
                    success: uploaded,
                    error: failed
                });

            }
        }

        reader.readAsDataURL(f);
    }

    function uploaded(data) {
        document.querySelector('#avatar-work').innerHTML = 'Done!'
        var obj = JSON.parse(data);
        document.querySelector('#avatar-show').src = obj.image;
    }
    function failed() {
        document.querySelector('#avatar-work').innerHTML = "Sorry, that image didn't work :( ";
    }
}


window.onload = enableAvatarDragDrop();


