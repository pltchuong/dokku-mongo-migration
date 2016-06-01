'use strict';

(function() {
  // printjson('user-auth ' + parameters);

  var url = 'apps.solutionsresource.com';
  var now = new Date(),
      parsed = parameters.match(/([^\s]*)\s?([^\s]*)?(\s?([^\s]*)?\s?([^\s]*)?\s?(.*)?)/),
      username = parsed[2],
      user = db.users.findOne({username: username}),
      command = parsed[4],
      name = parsed[5] || null,
      app = db.apps.findOne({name: name}),
      params = parsed[6] || null,
      activity = db.activities.findOne({_id: uuid}),
      exit = 0;

  if(username !== 'default') {
    if(user) {

      if(!activity) {
        activity.status = 'started';
        activity.output = '';
        activity.user = user._id;
        activity.created_at = now;
      }

      activity.output += command + ' ' + params + '\n';
      activity.updated_at = now;
      
      if(app) {
        if(app.collaborators && app.collaborators.indexOf(user._id) >= 0) {
          activity.app = app._id;
          db.activities.save(activity);
        } else {
          exit = 1;
        }
      } else {
        db.activities.save(activity);
      }
    }

    // denied if no user found in DB
    // e.g user is created directly by sshcommand acl-user
    else {
      exit = 1;
    }
  }

  printjson(exit);
})();
