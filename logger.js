'use strict';

(function() {
  // printjson('logger ' + parameters);

  var url = 'apps.solutionsresource.com';
  var now = new Date(),
      parsed = parameters.match(/([^\s]*)\s?(.*)?/),
      type = parsed[0],
      log = parsed[1] || '',
      activity = db.activities.findOne({_id: uuid});

  log = log.replace(/[ ]*\^\[\[1G/g, '');
  log = log.replace(/00[0-9a-z]{2,}\^[A-Z]/g, '');

  if(type == 'out') {
    activity.stdout += log + '\n';
  }
  if(type == 'err') {
    activity.stderr += log + '\n';
  }

  if(activity.stdout.includes('*****end*****')) {
    if(activity.stderr) {
      activity.status = 'failed';
    } else {
      activity.status = 'succeeded';
    }
  } else {
    activity.status = 'running';
  }

  activity.updated_at = now;

  db.activities.save(activity);
})();