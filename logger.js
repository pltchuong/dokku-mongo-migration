'use strict';

(function() {
  // printjson('logger ' + parameters);

  var url = 'apps.solutionsresource.com';
  var now = new Date(),
      log = parameters,
      activity = db.activities.findOne({_id: uuid});

  log = log.replace(/[ ]*\^\[\[1G/g, '');
  log = log.replace(/00[0-9a-z]{2,}\^[A-Z]/g, '');
  activity.output += log + '\n';
  activity.updated_at = now;

  if(activity.output.includes('*****end*****')) {
    activity.status = 'ended';
  } else {
    activity.status = 'running';
  }
  db.activities.save(activity);
})();