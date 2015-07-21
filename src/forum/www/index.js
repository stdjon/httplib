var usernameValid = false;

function recoveryKeypress() {
    var v = $('#rc-user').val();

    $.ajax({
        url: _g.DefaultPrefix + '/is-user?u=' + v,
        statusCode: {
            200: function() {
                usernameValid = true;
                checkSubmit();
            },
            404: function() {
                usernameValid = false;
                checkSubmit();
            }
        },
        complete: function() {
            checkSubmit();
        }
    });

}

function checkSubmit() {
    $('#rc-submit').attr('disabled', usernameValid ? null : 'disabled');
}


function submitRecovery() {
    var user = $('#rc-user').val();
    var secret = $('#rc-secret').val();
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: _g.DefaultSecurePrefix + '/recover',
        data: 'user=' + user + '&secret=' + secret,
        global: false,
        xhrFields: {
            withCredentials: true
        },
        success: function(data) {
            $('#rc-result').html(data.msg);
        },
    });
}
