'use strict';

(function() {

  var now = new Date(),
      parsed = parameters.match(/([^\s]*)\s(.*)/),
      name = parsed[1],
      app = db.apps.findOne({name: name}),
      rev = parsed[2],
      activity = db.activities.findOne({_id: uuid});

  activity.rev = rev;
  activity.updated_at = now;
  db.activities.save(activity);

})();
