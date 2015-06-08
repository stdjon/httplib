var prf = {
    motto: '',
    _loc: '',
    id: '',
};


function setPrefs(i, m, l) {
    prf.id = i;
    prf.motto = m;
    prf._loc = l;
}


function onKeypress() {
    prf.motto = $('#motto').val();
    prf._loc = $('#_loc').val();
    var ok1 = (prf.motto !== _g.Motto);
    var ok2 = (prf._loc !== _g.Location);
    var canupdate = ok1 || ok2;
    $('#update').attr('disabled', canupdate ? null : 'disabled');
    $('#notify').html('');
}


function update() {
    $.ajax({
        type: 'POST',
        dataType: 'text',
        global: false,
        url: '/prefs',
        data: 'i=' + prf.id +
            '&m=' + encodeURIComponent(prf.motto) + '&l=' + encodeURIComponent(prf._loc),
        success: function() {
            $('#update').attr('disabled', 'disabled');
            $('#notify').html('Preferences updated!');
        },
        error: function() {
            $('#notify').html('Unable to update the prefences!');
        }
    });
}


