
function openExpandingArea(id, label, caption) {
    $('<div id="'+ label +'" class="reply post">' +
        '<div class="expanding-area expanding-p-area">' +
            '<pre><span></span><br></pre>' +
            '<textarea placeholder="'+ caption + '" name="content"></textarea>' +
    '</div></div>').insertAfter(id);

    initalizeExpandingAreas();
}


function reply(btn, id, pid) {
    if($(id).data('reply-open')) {
        $('#r'+pid).remove();
        $(id).data('reply-open', false);
        $(btn).css('color', $(id).data('old-color'));
    } else {
        openExpandingArea(id, 'r' + pid, '[Reply]');

        $(id).data('reply-open', true).
            data('old-color', $(btn).css('color'));
        $(btn).css('color', colFromId(_g.ColourId));
    }
}


function edit(btn, id, pid) {
    if($(id).data('edit-open')) {
        $('#e'+pid).remove();
        $(id).data('edit-open', false);
        $(btn).css('color', $(id).data('old-color'));
    } else {
        openExpandingArea(id, 'e' + pid, '[Edit]');

        $(id).data('edit-open', true).
            data('old-color', $(btn).css('color'));
        $(btn).css('color', colFromId(_g.ColourId));
    }
}


function quote(btn, id, pid) {
    if($(id).data('quote-open')) {
        $(id).data('quote-open', false);
        $(btn).css('color', $(id).data('old-color'));
    } else {
        $(id).data('quote-open', true).
            data('old-color', $(btn).css('color'));
        $(btn).css('color', colFromId(_g.ColourId));
    }
}


function thumbsup(btn, id, pid) {
    if($(id).data('thumbed')) {
        $(id).data('thumbed', false);
        $(btn).css('color', $(id).data('old-color')).
            attr('class', 'fa fa-fw fa-thumbs-o-up');
    } else {
        $(id).data('thumbed', true).
            data('old-color', $(btn).css('color'));
        $(btn).css('color', colFromId(_g.ColourId)).
            attr('class', 'fa fa-fw fa-thumbs-up');
    }
}


function star(btn, id, pid) {
    if($(id).data('starred')) {
        $(id).data('starred', false);
        $(btn).css('color', $(id).data('old-color')).
            attr('class', 'fa fa-fw fa-star-o');
    } else {
        $(id).data('starred', true).
            data('old-color', $(btn).css('color'));
        $(btn).css('color', colFromId(_g.ColourId)).
            attr('class', 'fa fa-fw fa-star');
    }
}


