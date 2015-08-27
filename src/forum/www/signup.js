var passwordValue = '';
var confirmValue = '';
var userOk = false;
var passwordOk = false;
var passwordMatch = false;
var passwordScore = 0;
var emailOk = false;
var storeIds = ['user_id', 'password_id', 'email_id', 'secret_id'];


function storeFields() {
    for(var i = 0; i < storeIds.length; i++) {
        var id = storeIds[i];
        try {
            localStorage[id] = $('#' + id).val();
        } catch(e) {
            // don't really care if it fails...
        }
    }
}


function recoverFields() {
    for(var i = 0; i < storeIds.length; i++) {
        var id = storeIds[i];
        var v = $('#' + id).val();
        if(!v) {
            $('#' + id).val(localStorage[id]);
        }
    }
    syncPage();
}


// keypresses
function userKeypress() {
    var ok = true;
    var v = $('#user_id').val();
    var msg = '';

    if(!v.match(/^[A-Za-z_]/)) {
        msg += 'Please start your username with a letter.';
        ok = false;
    }
    if(v.length < 3) {
        msg += ' Please use at least 3 characters.';
        ok = false;
    }
    if(v.length > 25) {
        msg += ' Please use 25 characters or less.';
        ok = false;
    }
    if(v.match(/[ !"#$%&()*+,./:;<=>?@\[\\\]^`{|}~]/)) {
        msg += " Please use only letters, numbers or the symbols <tt>'-_</tt>."
        ok = false;
    }

    $('#userfeedback').html('<em>' + msg + '</em>');
    userOk = ok;

    $.ajax({
        url: _g.DefaultSecurePrefix + '/is-user?u=' + v,
        statusCode: {
            200: function() {
                $('#userexists').html('<em>Username already taken!</em>');
                userOk = false;
            },
            404: function() {
                $('#userexists').html('');
            }
        },
        complete: function() {
            checkSubmit();
        }
    });
}


function passwordKeypress() {
    var v = $('#password_id').val();
    passwordValue = v;
    checkPasswords();

    if(!window['zxcvbn']) {
        setTimeout(passwordKeypress, 250);
        return;
    }

    var r = zxcvbn(v);
    passwordScore = r.score;
    $('#strength').val(passwordScore);

    var pwOkUpper = passwordValue.match(/[A-Z]/);
    var pwOkLower = passwordValue.match(/[a-z]/);
    var pwOkNumber = passwordValue.match(/[0-9]/);
    var pwOkStrength = (passwordScore >= 3);
    var pwOkLength = passwordValue.length > 7;
    var pwOkLength2 = passwordValue.length <= 60;
    passwordOk = pwOkUpper && pwOkLower && pwOkNumber && pwOkStrength && pwOkLength && pwOkLength2;
    var p = [];

    if(!pwOkUpper) { p.push('an uppercase letter'); }
    if(!pwOkLower) { p.push('a lowercase letter'); }
    if(!pwOkNumber) { p.push('a number'); }

    var msg = '';
    if(p.length > 0) {
        var adds;
        if(p.length > 1) {
            var last = p.pop();
            adds = p.join(', ') + ' and ' + last;
        } else {
            adds = p[0];
        }
            msg += 'Please add ' + adds + '.';
    }
    if(!pwOkLength) {
        msg += ' Please use at least 8 characters.';
    }
    if(!pwOkLength2) {
        msg += ' Please use 60 characters or less.';
    }
    if(!pwOkStrength) {
        msg += ' Consider a stronger password.';
    }

    $('#passwordfeedback').html('<em>' + msg + '</em>');

    msg = ' <em>(Crack time estimated as ' +
        '<a href="https://blogs.dropbox.com/tech/2012/04/' +
        'zxcvbn-realistic-password-strength-estimation/">' +
        r.crack_time_display + '</a>.)</em>';
    $('#passwordtime').html('<em>' + msg + '</em>');
    if(pwOkStrength) {
        $('#passwordtime').removeClass('feedback');
    } else {
        $('#passwordtime').addClass('feedback');
    }

    updatePasswordBar(passwordScore);
    checkSubmit();
}


function confirmKeypress() {
    var v = $('#confirm_id').val();

    confirmValue = v;
    checkPasswords();
    updatePasswordBar(passwordScore);
    checkSubmit();
}


function emailKeypress() {
    var v = $('#email_id').val();
    var ok = (v.length > 2) && v.match(/.@.../);
    var msg = ok ? '' : '<em>(Is this a valid email address?)</em>';

    $('#emailfeedback').html(msg);
    emailOk = ok;

    $.ajax({
        url: _g.DefaultSecurePrefix + '/is-user?e=' + v,
        statusCode: {
            200: function() {
                $('#emailexists').html('<em>Email address already in use!</em>');
                emailOk = false;
            },
            404: function() {
                $('#emailexists').html('');
            }
        },
        complete: function() {
            checkSubmit();
        }
    });
}


function secretKeypress() {
    $('#secretfeedback').html(
        '<em>Can be left blank, but a value entered here can be used ' +
        ' during account recovery to prove ownership of your account.</em>');
}


function checkPasswords() {
    var ok = passwordValue === confirmValue;

    $('#confirmfeedback').html(ok ? '' : "<em>Passwords don't match</em>");
    passwordMatch = ok;
}


var pwCols = ['danger', 'danger', 'warning', 'info', 'success'];
var pwWidth = ['1%', '25%', '50%', '75%', '100%'];
var pwScore = 0;


function updatePasswordBar(score) {

    $('#password_strength').css("width", pwWidth[score]);
    if(!passwordOk || !passwordMatch) { score = 0; }
    $('#password_strength').removeClass("progress-bar-" + pwCols[pwScore]);
    $('#password_strength').addClass("progress-bar-" + pwCols[score]);
    pwScore = score;
}


function checkSubmit() {
    $('#strength').val(passwordScore);
    var cansubmit = userOk && passwordOk && passwordMatch && emailOk;
    var msg = '';
    if(!cansubmit) {
        var fld = [];
        if(!userOk) { fld.push('Username'); }
        if(!passwordOk) { fld.push('Password'); }
        if(!emailOk) { fld.push('Email'); }
        msg = '<em>Please ';
        if(fld.length > 0) {
            msg += 'check the ';
            if(fld.length > 1) {
                var last = fld.pop();
                msg += fld.join(', ') + ' and ' + last + ' fields';
            } else {
                msg += fld[0] + ' field';
            }
            msg += ' before submitting';
            if(!passwordMatch) { msg += ', and ';}
        }
        if(!passwordMatch) {
            msg += 'make sure the password confirmation matches the password'
        }
        msg += '.</em>';
    }
    $('#submitfeedback').html(msg)
    $('#submit').attr('disabled', cansubmit ? null : 'disabled');
}


function syncPage() {
    userKeypress();
    passwordKeypress();
    confirmKeypress();
    emailKeypress();
    secretKeypress();
}


onbeforeunload = function(event) {
    storeFields();
};


$(document).ready(function() {
    recoverFields();
});


