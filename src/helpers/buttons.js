module.exports = function(options) {

   let labels = options.hash.labels || '';
   let urls = options.hash.urls || '';
   let classes = options.hash.classes || '';

   labels = labels.split(',');
   urls = urls.split(',');
   classes = ' ' + classes;

   let template = '<div class="component buttons' + classes +'">';

   for(let i = 0; i< labels.length; i++ ) {
    template = template + '<a class="button" href="' + urls[i].trim() + '">' + labels[i].trim() + '</a>';
   }

   template = template + '</div>';

    return template;
}