/*globals jQuery */
/**
 * This plugin determines the browser capabilities
 * regarding CSS3 background-size support.
 *
 * It adds a property 'backgroundSize' to the
 * jQuery.support object which is either an empty string
 * (which evaluates to false) or a string containing the
 * actual style property which can be used for it.
 *
 * @author Benjamin Erhart <berhart@tladesignz.com>
 * @license MIT http://www.opensource.org/licenses/mit-license.php
 * @version 0.1
 *
 * @example
 * if ($.support.backgroundSize) {
 *     // .. do something
 * }
 * $( '#some_element' ).css( $.support.backgroundSize, 'auto 100%' );
 *
 * @requires jQuery 1.3
 * @extends jQuery.support
 * @constructor
 */
(function( $ ) {

    $.support.backgroundSize = '';

    $( function() {
        var s = document.body.style,
            types = [
                'OBackgroundSize',
                'KhtmlBackgroundSize',
                'WebkitBackgroundSize',
                'MozBackgroundSize',
                'backgroundSize'
            ],
            i = types.length - 1;

        do {
            if (typeof s[ types[ i ] ] === 'string') {
                return ($.support.backgroundSize = types[ i ]);
            }
        } while (i--);
    } );

}( jQuery ));
