(function() {
  printjson(parameters);

  var url = 'apps.solutionsresource.com';
  var now = new Date(),
      parsed = parameters.match(/([^\s]*)\s([^\s]*)\s(.*)/),
      name = parsed[1],
      app = db.apps.findOne({name: name}),
      uuid = parsed[2],
      log = parsed[3],
      build = {
        _id: uuid,
        app: app._id
      },
      trimBuffer = function(buffer) {
        for (var i = 0; i < buffer.length; i++) {
          if (buffer[i] === 0x1B) {
            return trimBuffer(buffer.slice(i + 4));
          }
        }
        return buffer;
      };

  if(log === '*****start*****') {
    build.created_date = now;
    build.updated_date = now;
    build.status = 'started';
    build.output = '';
    db.builds.save(build);
  } else if(log === '*****end*****') {
    build = db.builds.findOne(build);
    build.updated_date = now;
    build.status = 'finished';
    build.output = 
    db.builds.save(build);
  } else {
    build = db.builds.findOne(build);
    build.updated_date = now;
    build.status = 'running';
    build.output += trimBuffer(log);
    db.builds.save(build);
  }
})();
