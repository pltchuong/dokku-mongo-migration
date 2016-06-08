'use strict';

(function() {
  // printjson('post-delete ' + parameters);

  var url = 'apps.solutionsresource.com';
  var now = new Date(),
      parsed = parameters.match(/([^\s]*)\s?([^\s]*)?/),
      name = parsed[1],
      app = db.apps.findOne({name: name});

  if(app) {
    db.apps.remove(app);
  }

})();
