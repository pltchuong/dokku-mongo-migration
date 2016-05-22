(function() {
  // printjson('user-auth ' + parameters);

  var url = 'apps.solutionsresource.com';
  var now = new Date(),
      parsed = parameters.match(/([^\s]*)\s?([^\s]*)?(\s?([^\s]*)?\s?([^\s]*)?\s?(.*)?)/),
      username = parsed[2],
      user = db.users.findOne({username: username}),
      command = parsed[4],
      name = parsed[5],
      app = db.apps.findOne({name: name}),
      params = parsed[6],
      activity = {
        command: command,
        params: params || null,
        created_at: now,
        updated_at: now
      },
      exit = 0;

  if(user) {
    activity.user = user._id;

    if(app) {
      if(app.permissions.indexOf(app._id) >= 0) {
        activity.app = app._id;
        db.activities.save(activity);
      } else {
        exit = 1;
      }
    }
  }

  // denied if no user found in DB
  // e.g user is created directly by sshcommand acl-user
  else {
    exit = 1;
  }

  printjson(exit);
})();
