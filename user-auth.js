(function() {
  // printjson('user-auth ' + parameters);

  var url = 'apps.solutionsresource.com';
  var now = new Date(),
      parsed = parameters.match(/([^\s]*)\s([^\s]*)\s(.*)/),
      username = parsed[2],
      command = parsed[3],
      user = db.users.findOne({username: username}),
      activity = {
        command: command,
        created_at: now,
        updated_at: now
      },
      exit = 0;

  if(user) {
    activity.user = user._id;
    db.activities.save(activity);
  }

  // denied if no user found in DB
  // e.g user is created directly by sshcommand acl-user
  else {
    exit = 1;
  }

  printjson(exit);
})();
