var Dialog = {
    alert: function(options) {

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
    },

    confirm: function(options) {

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
    },
};

