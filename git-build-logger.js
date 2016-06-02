'use strict';

(function() {
  // printjson('logger ' + parameters);

  var url = 'apps.solutionsresource.com';
  var now = new Date(),
      parsed = parameters.match(/([^\s]*)\s([^\s]*)\s([^\s]*)\s?(.*)?/),
      name = parsed[1],
      app = db.apps.findOne({name: name}),
      uuid = parsed[2],
      type = parsed[3],
      log = parsed[4] || '',
      activity = db.activities.findOne({_id: uuid});

  activity.updated_at = now;
  if(log === '*****start*****') {
    activity.status = 'started';
  } else if(log === '*****end*****') {
    activity.status = activity.error ? 'failed' : 'finished';
  } else {

    printjson(log);

    activity.status = 'running';
    if(type === 'out') {
      activity.output += log + '\n';
    }
    if(type === 'err') {
      activity.error += log + '\n';
    }
  }
  db.activities.save(activity);
})();
