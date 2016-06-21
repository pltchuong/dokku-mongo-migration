'use strict';

(function() {

  var parsed = parameters.match(/([^\s]*)\s?([^\s]*)?/),
      name = parsed[1],
      app = db.apps.findOne({name: name});

  if(app) {
    db.activities.remove({app: app._id});
    db.apps.remove(app);
  }

})();
