
function notify(type) {
    $.notify({
        // options
        //icon: 'glyphicon glyphicon-warning-sign',
        //title: '<h4><span class="glyphicon glyphicon-warning-sign"></span> Bootstrap notify</h4>',
        message: 'Turning standard Bootstrap alerts into "notify" like notifications',
        //url: 'https://github.com/mouse0270/bootstrap-notify',
//        target: '_blank'
    },{
        type: type,
        newest_on_top: true,
        z_index: 10000,
        delay: 15000,
        timer: 1000,
        animate: {
            enter: 'animated fadeInDown',
            exit: 'animated fadeOutRightBig'
        },
    });
}
