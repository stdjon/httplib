var passwordValue = '';
var confirmValue = '';
var passwordOk = false;
var passwordMatch = false;


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
    passwordOk = pwOkUpper && pwOkLower && pwOkNumber && pwOkSymbol && pwOkLength && pwOkLength2;
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
    $('#password_strength').removeClass("progress-bar-" + pwCols[pwScore]);
    $('#password_strength').addClass("progress-bar-" + pwCols[score]);
    pwScore = score;
}


function checkSubmit() {
    var cansubmit = passwordOk && passwordMatch;
    $('#submit').attr('disabled', cansubmit ? null : 'disabled');
}


function submitRecoveryConfirm() {
    var pw = $('#password_id').val();
    var cf = $('#confirm_id').val();
    var tok = $('#token').val();
    $.ajax({
        type: 'POST',
        url: _g.DefaultSecurePrefix + '/recover-submit',
        data: 'pw=' + pw + '&cf=' + cf + '&t=' + tok,
        statusCode: {
            200: function() {
                $('#result').html('<em>Password reset, signing you in!</em>');
                top.location = _g.DefaultPrefix;
            },
            500: function() {
                $('#result').html('<em>Password reset didn\'t work!</em>');
            },
        },
    });
}
