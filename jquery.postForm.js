/*jslint white: false, plusplus: false, immed: false */
/**
 * Construct a jQuery.postForm() function.
 * @class jQuery.postForm() uses jQuery.post() to post all elements of a form, like
 *      a browser would if the form was submitted.
 *
 * Some code inspired by the Dojo Toolkit http://www.dojotoolkit.org/
 *
 * Usage:
 *
 * $( document.myform.mysubmitbutton ).click( function( evt ) {
 * 		jQuery.postForm(
 * 			'http://myserver/myformhandler',
 * 			document.myform,
 * 			function( data ) { console.debug( data ); },	// optional
 * 			'json',											// optional
 * 			evt.target										// optional
 * 		);
 *
 * 		return false;
 * }
 *
 * Copyright (c) 2009 Benjamin Erhart, http://www.tladesignz.com/
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 *
 * --------------------------------------------------------------------------------
 *
 * Changes:
 *
 *
 * Version 0.3.1:
 *
 * Fixed bug with undefined target
 *
 * Version 0.3:
 *
 * Doesn't submit &lt;button&gt; and &lt;input type="button|reset|image"&gt; values
 * any more, since a browser wouldn't do so on a normal form submit, as long as this
 * button isn't used for the submit.
 *
 * Added fifth parameter 'target'. This can be used to regain the behaviour of
 * submitting the buttons value used in submitting the form.
 *
 * Checked against JSLint http://www.jslint.com/
 *
 * --------------------------------------------------------------------------------
 *
 * Credits:
 *
 * Thanks to Steffen Chmil <sc@dbtech.de> for the hint regarding the submit button values.
 *
 * --------------------------------------------------------------------------------
 *
 * @version 0.3.1
 * @author berhart@tladesignz.com
 *
 * @requires jQuery jQuery 1.2.3
 * @extends jQuery
 * @addon
 * @constructor
 */
(function() {
    /**
     * @param {String} url The URL of the page to load.
     * @param {Object} form The form object (or jQuery object holding the form) whose elements values should be sent.
     * @param {Function} callback (optional) A function to be executed whenever the data is loaded successfully.
     * @param {String} type (optional) Type of data to be returned to callback function (JSON, XML, etc.)
     * @param {Object} target (optional) Event target element which triggered this postForm call. Used to emulate
     * behaviour of browsers standard form handling, which is: the form fields name and value triggering the form
     * action will be sent, too.
     */
    jQuery.postForm = function( url, form, callback, type, target ) {
        var data = {}, i, j, field, fTag, fType;

        // remove jQuery wrapping of form object
        if (form.jquery) {
            form = form.get( 0 );
        }

        if (!form || !form.tagName || !form.tagName.toLowerCase() === 'form') {
            throw( 'Attempted to post a non-form element.' );
        }

        // BUGFIX: added test if 'target' is defined before it gets used
        if (target && target.tagName.toLowerCase() !== 'button' && !target.type.match( /^submit|image$/i )) {
            target = null;
        }

        for (i = 0; i < form.elements.length; ++i) {
            field = form.elements[ i ];

            if (!field) {
                continue;
            }

            fTag = field.tagName.toLowerCase();
            fType = field.type.toLowerCase();

            // Never submit <fieldset>, <input type="reset"> and <button type="reset">.
            // Submit <button> or <input type="submit|image"> values if this element was used to trigger the form submit.
            if (fTag === 'fieldset' || fType === 'reset' || (fTag === 'button' || fType === 'submit' || fType === 'image') && field !== target) {
                continue;
            }

            if (fType === 'select-multiple') {
                for (j = 0; j < field.options.length; ++j) {
                    if (field.options[ j ].selected) {
                        add( data, field.name, field.options[ j ].value );
                    }
                }
            }
            else if (fType === 'radio' || fType === 'checkbox') {
                if (field.checked) {
                    add( data, field.name, field.value );
                }
            }
            else {
                add( data, field.name, field.value );
            }
        }

        jQuery.post( url, data, callback, type );
    };

    /**
     * extends the value of an object's key dynamically to an array if more than one is added
     * @private
     * @param {Object} object a normal object
     * @param {String} name object's key
     * @param {Any} value value to add to object's key
     */
    function add( object, name, value ) {
        if (object[ name ]) {
            if (typeof object[ name ] === 'object') {
                object[ name ].push( value );
            }
            else {
                object[ name ] = [ object[ name ], value ];
            }
        }
        else {
            object[ name ] = value;
        }
    }

})();
