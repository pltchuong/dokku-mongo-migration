'use strict';

(function() {
  // printjson('logger ' + parameters);

  var url = 'apps.solutionsresource.com';
  var now = new Date(),
      parsed = parameters.match(/([^\s]*)\s?(.*)?/),
      uuid = parsed[1],
      log = parsed[2] || '',
      activity = db.activities.findOne({_id: uuid});

  activity.updated_at = now;
  if(log === '*****start*****') {
    activity.status = 'started';
  } else if(log === '*****end*****') {
    activity.status = activity.output.indexOf('pre-receive hook declined') >= 0 ? 'failed' : 'finished';
  } else {
    activity.status = 'running';
    if(activity.output.substring(activity.output.lastIndexOf('\n') + 1) !== log) {
      activity.output = activity.output.trim() +'\n' + log;
    }
  }
  db.activities.save(activity);
})();
