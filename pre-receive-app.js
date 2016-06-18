'use strict';

(function() {
  // printjson('pre-receive-app ' + parameters);

  var url = 'apps.solutionsresource.com';
  var now = new Date(),
      parsed = parameters.match(/([^\s]*)\s([^\s]*)\s([^\s]*)\s([^\s]*)/),
      name = parsed[1],
      app = db.apps.findOne({name: name}),
      type = parsed[2],
      tmpdir = parsed[3],
      rev = parsed[4],
      activity = db.activities.findOne({_id: uuid});

  activity.type = type;
  activity.rev = rev;
  activity.tmpdir = tmpdir;
  activity.updated_at = now;
  db.activities.save(activity);

})();
