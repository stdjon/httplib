var prf = {
    motto: '',
    _loc: '',
    col_id: '',
    trans: '',
    font: '',
};


function setPrefs(m, l, c, t, f) {
    _g.Motto = prf.motto = m;
    _g.Location = prf._loc = l;
    _g.ColourId = prf.col_id = c;
    _g.Transform = prf.trans = t;
    _g.Font = prf.font = f;
    $('span#' + c).addClass('selected');
}


function onKeypress() {
    prf.motto = $('#motto').val();
    prf._loc = $('#_loc').val();
    prf.trans = $('#transform label.active input').val();
    prf.font = $('#font label.active input').val();
    var ok1 = (prf.motto !== _g.Motto);
    var ok2 = (prf._loc !== _g.Location);
    var ok3 = (prf.col_id !== _g.ColourId);
    var ok4 = (prf.trans !== _g.Transform);
    var ok5 = (prf.font !== _g.Font);
    var canupdate = ok1 || ok2 || ok3 || ok4 || ok5;
    $('#update').attr('disabled', canupdate ? null : 'disabled');
    $('#notify').html('');
}


function onRadio(font) {
    // setTimeout() is a bit of a cheat, but it'll do for now...
    setTimeout(function() {
        onKeypress();
        if(font) {
            setFonts(prf.font);
        }
    }, 250);
}


function update() {
    $.ajax({
        type: 'POST',
        dataType: 'text',
        global: false,
        url: '/prefs',
        data: 'm=' + encodeURIComponent(prf.motto) +
            '&l=' + encodeURIComponent(prf._loc) +
            '&c=' + prf.col_id +
            '&r=' + prf.trans +
            '&f=' + prf.font,
        success: function() {
            $('#update').attr('disabled', 'disabled');
            $('#notify').html('Preferences updated!');
            setPrefs(prf.motto, prf._loc, prf.col_id, prf.trans, prf.font);
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


