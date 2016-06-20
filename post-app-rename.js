'use strict';

(function() {

  var now = new Date(),
      parsed = parameters.match(/([^\s]*)\s(.*)/),
      name = parsed[1],
      app = db.apps.findOne({name: name}),
      newname = parsed[2];

  app.name = newname;
  app.updated_at = now;
  db.apps.save(app);

})();
