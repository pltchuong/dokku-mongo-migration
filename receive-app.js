(function() {
  printjson('receive-app ' + parameters);

  var url = 'apps.solutionsresource.com';
  var now = new Date(),
      parsed = parameters.match(/(.*)/),
      name = parsed[1],
      app = db.apps.findOne({name: name}),
      build = db.apps.findOne({
        app: app._id,
        status: 'running'
      });

  build.status = 'succeeded';
  build.updated_at = now;

  db.builds.save(build);

})();
