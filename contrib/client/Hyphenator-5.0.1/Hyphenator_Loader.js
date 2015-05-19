/** @license Hyphenator_Loader 5.0.1 - client side hyphenation for webbrowsers
 *  Copyright (C) 2015  Mathias Nater, Zürich (mathiasnater at gmail dot com)
 *  https://github.com/mnater/Hyphenator
 * 
 *  Released under the MIT license
 *  http://mnater.github.io/Hyphenator/LICENSE.txt
 */

/**
 * @constructor
 * @description Checks if there's CSS-hyphenation available for the given languages and
 * loads and runs Hyphenator if there's no CSS-hyphenation
 * @author Mathias Nater, <a href = "mailto:mathias@mnn.ch">mathias@mnn.ch</a>
 * @version 5.0.1
 * @namespace Holds all methods and properties
 */

/* The following comment is for JSLint: */
/*jslint browser: true */
/*global Hyphenator: false */

var Hyphenator_Loader = (function (window) {
    'use strict';
    var languages,
        config,
        path,

        /**
         * @name Hyphenator-createElem
         * @description
         * A function alias to document.createElementNS or document.createElement
         * @param {string} tagname the Element to create
         * @type {function({string})}
         * @private
         */
        createElem = function (tagname) {
            var r;
            if (window.document.createElementNS) {
                r = window.document.createElementNS('http://www.w3.org/1999/xhtml', tagname);
            } else if (window.document.createElement) {
                r = window.document.createElement(tagname);
            }
            return r;
        },

        /**
         * @name Hyphenator-checkLangSupport
         * @description
         * Checks if hyphenation for all languages are supported
         * @type {function()}
         * @return {bool}
         * @private
         */
        checkLangSupport = function () {
            var shadowContainer,
                shadow,
                shadows = [],
                lang,
                i,
                r = true,
                bdy = window.document.getElementsByTagName('body')[0];

            shadowContainer = createElem('div');
            shadowContainer.style.MozHyphens = 'auto';
            shadowContainer.style['-webkit-hyphens'] = 'auto';
            shadowContainer.style['-ms-hyphens'] = 'auto';
            shadowContainer.style.hyphens = 'auto';
            shadowContainer.style.fontSize = '12px';
            shadowContainer.style.lineHeight = '12px';
            shadowContainer.style.wordWrap = 'normal';
            shadowContainer.style.visibility = 'hidden';

            for (lang in languages) {
                if (languages.hasOwnProperty(lang)) {
                    shadow = createElem('div');
                    shadow.style.width = '5em';
                    shadow.lang = lang;
                    shadow.style['-webkit-locale'] = "'" + lang + "'";
                    shadow.appendChild(window.document.createTextNode(languages[lang]));
                    shadowContainer.appendChild(shadow);
                    shadows.push(shadow);
                }
            }

            bdy.appendChild(shadowContainer);
            for (i = 0; i < shadows.length; i += 1) {
                r = (shadows[i].offsetHeight > 12) && r;
            }
            bdy.removeChild(shadowContainer);
            return r;
        },

        /**
         * @name Hyphenator-loadNrunHyphenator
         * @description Loads Hyphenator.js and runs it with the given configuration
         * @type {function({object})}
         * @param {object} config the configuration object for Hyphenator.js
         * @private
         */
        loadNrunHyphenator = function (config) {
            var head, script,
                hyphenatorLoaded = function () {
                    if (window.Hyphenator !== undefined) {
                        Hyphenator.config(config);
                        Hyphenator.run();
                    } else {
                        window.setTimeout(function () {
                            hyphenatorLoaded();
                        }, 10);
                    }
                };

            head = window.document.getElementsByTagName('head').item(0);
            script = createElem('script');
            script.src = path;
            script.type = 'text/javascript';
            head.appendChild(script);

            hyphenatorLoaded();
        },

        runner = function () {
            var allLangsSupported = checkLangSupport();
            if (!allLangsSupported) {
                loadNrunHyphenator(config);
            }
        },

        /*
         * runOnContentLoaded is based od jQuery.bindReady()
         * see
         * jQuery JavaScript Library v1.3.2
         * http://jquery.com/
         *
         * Copyright (c) 2009 John Resig
         * Dual licensed under the MIT and GPL licenses.
         * http://docs.jquery.com/License
         *
         * Date: 2009-02-19 17:34:21 -0500 (Thu, 19 Feb 2009)
         * Revision: 6246
         */
        /**
         * @name Hyphenator-runOnContentLoaded
         * @description
         * A crossbrowser solution for the DOMContentLoaded-Event based on jQuery
         * <a href = "http://jquery.com/</a>
         * I added some functionality: e.g. support for frames and iframes…
         * @param {Object} w the window-object
         * @param {function()} f the function to call onDOMContentLoaded
         * @param {Object} a1 argument1 for f: an object containing the languages
         * @param {Object} a2 argument2 for f: the configuration object for Hyphenator.js
         * @private
         */
        runOnContentLoaded = function (window, f) {
            var toplevel, hyphRunForThis = {}, doFrames = false, contextWindow, documentLoaded,
                add = window.document.addEventListener ? 'addEventListener' : 'attachEvent',
                rem = window.document.addEventListener ? 'removeEventListener' : 'detachEvent',
                pre = window.document.addEventListener ? '' : 'on',

                init = function (context) {
                    contextWindow = context || window;
                    if (!hyphRunForThis[contextWindow.location.href] && (!documentLoaded || !!contextWindow.frameElement)) {
                        documentLoaded = true;
                        f();
                        hyphRunForThis[contextWindow.location.href] = true;
                    }
                },

                doScrollCheck = function () {
                    try {
                        // If IE is used, use the trick by Diego Perini
                        // http://javascript.nwbox.com/IEContentLoaded/
                        window.document.documentElement.doScroll("left");
                    } catch (error) {
                        window.setTimeout(doScrollCheck, 1);
                        return;
                    }

                    // and execute any waiting functions
                    init(window);
                },

                doOnLoad = function () {
                    var i, haveAccess, fl = window.frames.length;
                    if (doFrames && fl > 0) {
                        for (i = 0; i < fl; i += 1) {
                            haveAccess = undefined;
                            //try catch isn't enough for webkit
                            try {
                                //opera throws only on document.toString-access
                                haveAccess = window.frames[i].document.toString();
                            } catch (e) {
                                haveAccess = undefined;
                            }
                            if (!!haveAccess) {
                                if (window.frames[i].location.href !== 'about:blank') {
                                    init(window.frames[i]);
                                }
                            }
                        }
                        contextWindow = window;
                        f();
                        hyphRunForThis[window.location.href] = true;
                    } else {
                        init(window);
                    }
                },

                // Cleanup functions for the document ready method
                DOMContentLoaded = function (e) {
                    if (e.type === 'readystatechange' && window.document.readyState !== 'complete') {
                        return;
                    }
                    window.document[rem](pre + e.type, DOMContentLoaded, false);
                    if (!doFrames && window.frames.length === 0) {
                        init(window);
                    } /* else {
                        //we are in a frameset, so do nothing but wait for onload to fire
                        
                    }*/
                };

            if (window.document.readyState === "complete" || window.document.readyState === "interactive") {
                //Running Hyphenator.js if it has been loaded later
                //Thanks to davenewtron http://code.google.com/p/hyphenator/issues/detail?id=158#c10
                window.setTimeout(doOnLoad, 1);
            } else {
                //registering events
                window.document[add](pre + "DOMContentLoaded", DOMContentLoaded, false);
                window.document[add](pre + 'readystatechange', DOMContentLoaded, false);
                window[add](pre + 'load', doOnLoad, false);
                toplevel = false;
                try {
                    toplevel = !window.frameElement;
                } catch (ignore) {}
                if (window.document.documentElement.doScroll && toplevel) {
                    doScrollCheck();
                }
            }
        };

    return {
        /**
         * @name Hyphenator_Loader.init
         * @description Bootstrap function that inits the loader
         * @param {Object} languages an object with the language as key and a long word as value
         * @param {Object} config the Hyphenator.js configuration object
         * @public
         */
        init: function (langs, p, configs) {
            languages = langs;
            path = p;
            config = configs || {};
            runOnContentLoaded(window, runner);
        }
    };
}(window));