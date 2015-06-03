var passwordValue = '';
var confirmValue = '';
var userOk = false;
var passwordOk = false;
var emailOk = false;


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
        url: "{{DefaultSecurePrefix}}/is-user?u=" + v,
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

    var r = zxcvbn(v);
    var pwOkUpper = passwordValue.match(/[A-Z]/);
    var pwOkLower = passwordValue.match(/[a-z]/);
    var pwOkNumber = passwordValue.match(/[0-9]/);
    var pwOkSymbol = passwordValue.match(/[ !"#$%&'()*+,-./:;<=>?@\[\\\]^_`{|}~]/); //"
    var pwOkLength = passwordValue.length > 7;
    var pwOkLength2 = passwordValue.length <= 60;
    var passwordOk = pwOkUpper && pwOkLower && pwOkNumber && pwOkSymbol && pwOkLength && pwOkLength2;
    var p = [];

    if(!pwOkUpper) { p.push('an uppercase letter'); }
    if(!pwOkLower) { p.push('a lowercase letter'); }
    if(!pwOkNumber) { p.push('a number'); }
    if(!pwOkSymbol) { p.push('a symbol'); }

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
    if(r.score < 3) {
        msg += ' Consider a stronger password.';
    }

    msg += ' (Crack time estimated as ' +
        '<a href="https://blogs.dropbox.com/tech/2012/04/' +
        'zxcvbn-realistic-password-strength-estimation/">' +
        r.crack_time_display + '</a>.)';

    $('#passwordfeedback').html('<em>' + msg + '</em>');
    updatePasswordBar(r.score);
    checkSubmit();
}


function confirmKeypress() {
    var v = $('#confirm_id').val();

    confirmValue = v;
    checkPasswords();
    checkSubmit();
}


function emailKeypress() {
    var v = $('#email_id').val();
    var ok = (v.length > 2) && v.match(/.@.../);
    var msg = ok ? '' : '<em>(Is this a valid email address?)</em>';

    $('#emailfeedback').html(msg);
    emailOk = ok;

    $.ajax({
        url: "{{DefaultSecurePrefix}}/is-user?e=" + v,
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


function checkPasswords() {
    var ok = passwordValue === confirmValue;

    $('#confirmfeedback').html(ok ? '' : "<em>Passwords don't match</em>");
    passwordOk = ok;
}


var pwCols = ['danger', 'danger', 'warning', 'info', 'success'];
var pwWidth = ['1%', '25%', '50%', '75%', '100%'];
var pwScore = 0;


function updatePasswordBar(score) {
    $('#password_strength').css("width", pwWidth[score]);
    $('#password_strength').removeClass("progress-bar-" + pwCols[pwScore]);
    $('#password_strength').addClass("progress-bar-" + pwCols[score]);
    pwScore = score;
}


function checkSubmit() {
    var cansubmit = userOk && passwordOk && emailOk;
    $('#submit').attr('disabled', cansubmit ? null : 'disabled');
}


