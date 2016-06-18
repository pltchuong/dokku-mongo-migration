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
      params = parsed[6] || '',
      activity = db.activities.findOne({_id: uuid}),
      exit = 0;

  // check permission
  if(username !== 'default') {
    if(user) {

      // denied if user don't have app's permission
      if(app && app.collaborators && app.collaborators.indexOf(user._id) < 0) {
        exit = 1;
      }
    }

    // denied if no user found in DB
    // e.g user is created directly by sshcommand acl-user
    else {
      exit = 1;
    }
  }

  // record ALL activities
  activity = activity || {
    _id: uuid,
    commands: [],
    stdout: '',
    stderr: '',
    app: app ? app._id : null,
    user: user ? user._id : (username || 'Dokku'),
    created_at: now
  };

  activity.commands.push(command + ' ' + params);
  activity.updated_at = now;
  db.activities.save(activity);

  // return exit
  printjson(exit);
})();
