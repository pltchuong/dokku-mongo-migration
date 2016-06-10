'use strict';

(function() {
  // printjson('logger ' + parameters);

  var url = 'apps.solutionsresource.com';
  var now = new Date(),
      parsed = parameters.match(/([^\s]*)\s?(.*)?/),
      uuid = parsed[1],
      log = parsed[2] || '',
      activity = db.activities.findOne({_id: uuid});

  log = log.replace(/[ ]*\^\[\[1G/g, '');
  log = log.replace(/00[0-9a-z]{2,}\^[A-Z]/g, '');

  activity.status = 'started';
  activity.updated_at = now;
  if(activity.output.indexOf(log.trim()) < 0) {
    activity.output += log + '\n';
  } else {
    activity.output.replace(log.trim(), log);
  }
  if(activity.output.indexOf('pre-receive hook declined') >= 0) {
    activity.status = 'failed';
  } else if(activity.output.indexOf('Application deployed') >= 0) {
    activity.status = 'finished';
  } else {
    activity.status = 'running';
  }
  db.activities.save(activity);
})();