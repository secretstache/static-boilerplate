window.jQuery = $;
import whatInput from 'what-input';

import '../../../node_modules/slick-carousel/slick/slick.js';

import Foundation from 'foundation-sites';
// If you want to pick and choose which modules to include, comment out the above and uncomment
// the line below
//import './lib/foundation-explicit-pieces';

$(document).foundation();

$('[data-slick]').slick();