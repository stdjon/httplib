BootstrapDialog.myalert = function(options) {

    function oneShotCallback(close) {
        return function(dialog) {
            typeof dialog.getData('callback') === 'function' &&
                dialog.getData('callback')();
            dialog.setData('callback', undefined);
            close && dialog.close();
        }
    }

    options = options || {};
    options.type = options.type || BootstrapDialog.TYPE_PRIMARY;
    options.closable = true;
    options.closeByBackdrop = true;
    options.closeByKeyboard = true;
    options.buttons = [ {
            label: options.btnOKLabel ||
                BootstrapDialog.DEFAULT_TEXTS.OK,
            cssClass: options.btnOKClass ||
                ['btn', options.type.split('-')[1]].join('-'),
            action: oneShotCallback(true),
        } ];
    options.onhide = oneShotCallback(false),
    options.data = {
            callback: options.callback
    };

    var dialog = new BootstrapDialog(options);
    var result = dialog.open();
    dialog.getModal().on('keyup', {dialog: dialog}, function(event) {
        (event.which === 13 || event.which === 32) &&
            event.data.dialog.isClosable() &&
            event.data.dialog.canCloseByKeyboard() &&
            oneShotCallback(true)(event.data.dialog);
    });
    return result;
}


BootstrapDialog.myconfirm = function(options) {

    function oneShotCallback(result, close) {
        return function(dialog) {
            typeof dialog.getData('callback') === 'function' &&
                dialog.getData('callback')(result);
            dialog.setData('callback', undefined);
            close && dialog.close();
        }
    }

    options = options || {};
    options.type = options.type || BootstrapDialog.TYPE_PRIMARY;
    options.closable = true;
    options.closeByBackdrop = true;
    options.closeByKeyboard = true;
    options.buttons = [ {
            label: options.btnCancelLabel ||
                BootstrapDialog.DEFAULT_TEXTS.CANCEL,
            action: oneShotCallback(false, true),
        }, {
            label: options.btnOKLabel ||
                BootstrapDialog.DEFAULT_TEXTS.OK,
            cssClass: options.btnOKClass ||
                ['btn', options.type.split('-')[1]].join('-'),
            action: oneShotCallback(true, true),
        } ];
    options.onhide = oneShotCallback(false, false),
    options.data = {
            callback: options.callback
    };

    var dialog = new BootstrapDialog(options);
    var result = dialog.open();
    dialog.getModal().on('keyup', {dialog: dialog}, function(event) {
        (event.which === 13 || event.which === 32) &&
            event.data.dialog.isClosable() &&
            event.data.dialog.canCloseByKeyboard() &&
            oneShotCallback(true, true)(event.data.dialog);
    });
    return result;
}


function dialog1() {
    BootstrapDialog.myalert({
        title: 'Hi There!',
        message: 'You can also close this by clicking outside or pressing ' +
            'the <kbd>Enter</kbd>, <kbd>Space</kbd> or <kbd>Esc</kbd> keys.',
        callback: function() {
            BootstrapDialog.myalert({
                type: BootstrapDialog.TYPE_SUCCESS,
                message: 'Closed!'
            });
        }
    });
}


function dialog2() {
    var x = BootstrapDialog.myconfirm({
        message: 'Are you sure?',
        type: BootstrapDialog.TYPE_DANGER,
        callback:  function(x) {
            BootstrapDialog.myalert({
                type: x ? BootstrapDialog.TYPE_WARNING: BootstrapDialog.TYPE_SUCCESS,
                message: 'You chose \'' + (x ? 'OK' : 'Cancel') + '\'',
            });
        }
    });
}


function dialog3() {
    BootstrapDialog.myalert({
        title: 'Hi There!',
        type: BootstrapDialog.TYPE_WARNING,
        message: 'You can also close this by clicking outside or pressing ' +
            'the <kbd>Enter</kbd>, <kbd>Space</kbd> or <kbd>Esc</kbd> keys.',
        callback: function() {
            BootstrapDialog.myalert({
                type: BootstrapDialog.TYPE_SUCCESS,
                message: 'Closed!'
            });
        }
    });
}


function dialog4() {
    BootstrapDialog.myalert({
        title: 'Hi There!',
        type: BootstrapDialog.TYPE_SUCCESS,
        message: 'You can also close this by clicking outside or pressing ' +
            'the <kbd>Enter</kbd>, <kbd>Space</kbd> or <kbd>Esc</kbd> keys.',
        callback: function() {
            BootstrapDialog.myalert({
                message: 'Closed!'
            });
        }
    });
}

