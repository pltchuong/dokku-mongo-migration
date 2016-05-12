(function() {
  printjson('logger ' + parameters);

  var url = 'apps.solutionsresource.com';
  var now = new Date(),
      parsed = parameters.match(/([^\s]*)\s([^\s]*)\s([^\s]*)\s(.*)/),
      name = parsed[1],
      app = db.apps.findOne({name: name}),
      uuid = parsed[2],
      type = parsed[3],
      log = parsed[4],
      build = {
        _id: uuid,
        app: app._id
      };

  if(log === '*****start*****') {
    build.created_date = now;
    build.updated_date = now;
    build.status = 'started';
    build.output = '';
    build.error = '';
    db.builds.save(build);
  } else if(log === '*****end*****') {
    build = db.builds.findOne(build);
    build.updated_date = now;
    build.status = build.error ? 'failed' : 'finished';
    db.builds.save(build);
  } else {
    build = db.builds.findOne(build);
    build.status = 'running';
    if(type === 'out') {
      build.output += log + "\n";
    }
    if(type === 'err') {
      build.error += log + "\n";
    }
    build.updated_date = now;
    db.builds.save(build);
  }
})();
