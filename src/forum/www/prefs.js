var prf = {
    motto: '',
    _loc: '',
    id: '',
    col_id: '',
    trans: '',
};


function setPrefs(i, m, l, c, t) {
    prf.id = i;
    _g.Motto = prf.motto = m;
    _g.Location = prf._loc = l;
    _g.ColourId = prf.col_id = c;
    _g.Transform = prf.trans = t;
    $('span#' + c).addClass('selected');
}


function onKeypress() {
    prf.motto = $('#motto').val();
    prf._loc = $('#_loc').val();
    prf.trans = $('#transform label.active input').val();
    var ok1 = (prf.motto !== _g.Motto);
    var ok2 = (prf._loc !== _g.Location);
    var ok3 = (prf.col_id !== _g.ColourId);
    var ok4 = (prf.trans !== _g.Transform);
    var canupdate = ok1 || ok2 || ok3 || ok4;
    $('#update').attr('disabled', canupdate ? null : 'disabled');
    $('#notify').html('');
}


function onRadio() {
    // this is a bit of a cheat, but it'll do for now...
    setTimeout(onKeypress, 250);
}


function update() {
    $.ajax({
        type: 'POST',
        dataType: 'text',
        global: false,
        url: '/prefs',
        data: 'i=' + prf.id +
            '&m=' + encodeURIComponent(prf.motto) +
            '&l=' + encodeURIComponent(prf._loc) + 
            '&c=' + prf.col_id +
            '&r=' + prf.trans,
        success: function() {
            $('#update').attr('disabled', 'disabled');
            $('#notify').html('Preferences updated!');
        },
        error: function() {
            $('#notify').html('Unable to update the prefences!');
        }
    });
}


function selectSwatch(id, col, light) {
    $('span.swatch').removeClass('selected');
    $('span#' + id).addClass('selected');
    setHdrCols(id);
    prf.col_id = id;
    onKeypress();
}

