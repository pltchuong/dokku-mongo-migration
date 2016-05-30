'use strict';

(function() {
  printjson('post-create ' + parameters);

  var url = 'apps.solutionsresource.com';
  var now = new Date(),
      parsed = parameters.match(/(.*)/),
      name = parsed[1],
      app = {
        _id: uuid,
        name: name,
        web_url: name + '.' + url,
        git_url: 'dokku@' + url + ':' + name,
        collaborators: [],
        created_at: now,
        updated_at: now
      };

  var administrators = db.users.find({role: 'administrator'}, {'_id': 1});
  administrators.forEach(function(administrator) {
    app.collaborators.push(administrator._id);
  });
  db.apps.save(app);

})();
