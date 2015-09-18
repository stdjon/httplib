
// Initialize expanding-areas
function initalizeExpandingAreas() {
    $(function() {
        function pad(s, n) {
            var l = s.split('\n').length - 1;
            var p = n - l;
            if(p > 0) {
                s += (new Array(p).join('\n'));
            }
            return s;
        }

        $('div.expanding-area').each(function() {
            var size = $(this).data('size') || 1;
            var area = $('textarea', $(this));
            var span = $('span', $(this));
            area.bind('input', function() {
                span.text(pad(area.val(), size));
            });
            span.text(pad(area.val(), size));
            $(this).addClass('active');
        });
    });
}


