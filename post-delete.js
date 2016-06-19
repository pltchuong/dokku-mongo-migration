'use strict';

(function() {

  var now = new Date(),
      parsed = parameters.match(/([^\s]*)\s?([^\s]*)?/),
      name = parsed[1],
      app = db.apps.findOne({name: name});

  if(app) {
    db.apps.remove(app);
  }

})();
