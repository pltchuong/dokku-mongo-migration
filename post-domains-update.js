(function() {
  printjson('post-domains-update ' + parameters);

  var url = 'apps.solutionsresource.com';
  var now = new Date(),
      parsed = parameters.match(/([^\s]*)\s([^\s]*)\s(.*)/),
      name = parsed[1],
      app = db.apps.findOne({name: name}),
      action = parsed[2],
      hostname = parsed[3],
      cname = app.name + '.' + url,
      domain = {
        app: app._id,
        hostname: hostname,
        cname: cname,
        kind: 'custom'
      };

  switch(action) {
    case 'add':
      domain.created_at = now;
      domain.updated_at = now;
      db.domains.save(domain);
      domain = db.domains.findOne(domain);

      app.domains.push(domain._id);
      app.updated_at = now;
      db.apps.save(app);
      break;

    case 'remove':
      domain = db.domains.findOne(domain);
      db.domains.remove(domain);

      app.domains = app.domains.filter(function(tmp) {
        return tmp.valueOf() != domain._id.valueOf();
      });
      app.updated_at = now;
      db.apps.save(app);
      break;

    case 'clear':
      db.domains.remove({_id: {$in: app.domains}, cname: {$ne: null}});

      app.domains = app.domains.filter(function(tmp) {
        return tmp.valueOf() != cname;
      });
      app.updated_at = now;
      db.apps.save(app);
      break;

    default:
      break;
  }
  
})();
