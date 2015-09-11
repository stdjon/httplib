var passwordValue = '';
var confirmValue = '';
var passwordOk = false;
var passwordMatch = false;
var passwordScore = 0;


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
    var pwOkStrength = (passwordScore >= 2);
    var pwOkLength = passwordValue.length > 7;
    var pwOkLength2 = passwordValue.length <= 60;
    passwordOk =  pwOkStrength && pwOkLength && pwOkLength2;

    var msg = '';
    if(!pwOkLength) {
        msg += ' Please use at least 8 characters.';
    }
    if(!pwOkLength2) {
        msg += ' Please use 60 characters or less.';
    }
    if(pwOkStrength < 3) {
        msg += ' Consider a stronger password.';
    }

    msg += ' (Crack time estimated as ' +
        '<a href="https://blogs.dropbox.com/tech/2012/04/' +
        'zxcvbn-realistic-password-strength-estimation/">' +
        r.crack_time_display + '</a>.)';

    $('#passwordfeedback').html('<em>' + msg + '</em>');
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
        data: 'pw=' + pw + '&cf=' + cf + '&t=' + tok + '&s=' + passwordScore,
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
