'use strict';

(function() {

  var now = new Date(),
      parsed = parameters.match(/([^\s]*)\s([^\s]*)\s([^\s]*)\s([^\s]*)/),
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