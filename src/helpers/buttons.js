module.exports = function(options) {

   let labels = options.hash.labels || '';
   let urls = options.hash.urls || '';
   let classes = options.hash.classes || '';
   let buttonClasses = options.hash.buttonClasses || '';

   labels = labels.split(',');
   urls = urls.split(',');
   buttonClasses = buttonClasses.split(',');
   classes = ' ' + classes;

   let template = '<div class="component buttons' + classes +'">';

   for(let i = 0; i< labels.length; i++ ) {
    template = template + '<a class="button' + ' ' + buttonClasses[i] + '" href="' + urls[i].trim() + '">' + labels[i].trim() + '</a>';
   }

   template = template + '</div>';

    return template;
}