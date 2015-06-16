
// Initialize expanding-areas
function initalizeExpandingAreas() {
    $(function() {
        $('div.expanding-area').each(function() {
            var area = $('textarea', $(this));
            var span = $('span', $(this));
            area.bind('input', function() {
                span.text(area.val());
            });
            span.text(area.val());
            $(this).addClass('active');
        });
    });
}


