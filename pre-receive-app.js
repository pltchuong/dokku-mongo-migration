(function() {
  printjson('pre-receive-app ' + parameters);

  var url = 'apps.solutionsresource.com';
  var now = new Date(),
      parsed = parameters.match(/([^\s]*)\s([^\s]*)\s([^\s]*)\s(.*)/),
      name = parsed[1],
      app = db.apps.findOne({name: name}),
      type = parsed[2],
      tempdir = parsed[3],
      commit = parsed[4],
      build = {
        app: app._id,
        type: type,
        commit: commit,
        status: 'running'
      };

  build.created_at = now;
  build.updated_at = now;

  db.builds.save(build);

})();
