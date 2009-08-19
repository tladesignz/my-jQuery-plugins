/**
 * Construct a jQuery.postForm() function.
 * @class jQuery.postForm() uses jQuery.post() to post all elements of a form, like
 *      a browser would if the form was submitted.
 *
 * Some code inspired by the Dojo Toolkit http://www.dojotoolkit.org/
 *
 * Usage:
 *
 * jQuery.postForm(
 *     'test.pl',
 *     form,
 *     function( data ) { console.debug( data ) },  * optional
 *     'json'               * optional
 * );
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
 * @version 0.2
 * @author berhart@tladesignz.com
 *
 * @requires jQuery jQuery 1.2.3
 * @extends jQuery
 * @addon
 * @constructor
 */
(function() {
    /**
     * @param {String} The URL of the page to load.
     * @param {Object} The form object (or jQuery object holding the form) whose elements values should be sent.
     * @param {Function} A function to be executed whenever the data is loaded successfully.
     * @param {String} Type of data to be returned to callback function (JSON, XML, etc.)
     */
    jQuery.postForm = function( url, form, callback, type ) {
        var data = {};
        var i;
        var j;
        var field;
        var fType;

        // remove jQuery wrapping of form object
        if (form.jquery) {
            form = form.get( 0 );
        }

        if (!form || !form.tagName || !form.tagName.toLowerCase() == "form") {
            throw( "Attempted to post a non-form element." );
        }

        for (i = 0; i < form.elements.length; ++i) {
            field = form.elements[ i ];

            if (!field || field.tagName.toLowerCase() == "fieldset") {
                continue;
            }

            fType = field.type.toLowerCase();

            if (fType == "select-multiple") {
                for (j = 0; j < field.options.length; ++j) {
                    if (field.options[ j ].selected) {
                        add( data, field.name, field.options[ j ].value );
                    }
                }
            }
            else if (jQuery.inArray( fType, ["radio", "checkbox"] ) > -1) {
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
     * @param {Object} a normal object
     * @param {String} object's key
     * @param {Any} value to add to object's key
     */
    function add( object, name, value ) {
        if (object[ name ]) {
            if (typeof object[ name ] == 'object') {
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
