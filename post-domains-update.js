(function() {
  printjson('post-domains-update ' + parameters);
  printjson(process.env.DOKKU_MONGO_CONNECTION_HOST);

  var url = 'apps.solutionsresource.com';
  var parsed = parameters.match(/([^\s]*)\s([^\s]*)\s(.*)/),
      name = parsed[1],
      app = db.apps.findOne({name: name});
      action = parsed[2],
      hostname = parsed[3],
      domain = {
        app: app._id,
        hostname: hostname,
        cname: app.name + '.' + url,
        kind: 'custom',
        created_at: new Date(),
        updated_at: new Date(),
      };

  switch(action) {
    case 'add':
      db.domains.save(domain);
      domain = db.domains.findOne(domain);

      app.domains.push(domain._id);
      db.apps.save(app);
      break;

    case 'remove':
      domain = db.domains.findOne(domain);
      db.domains.remove(domain);

      app.domains = app.domains.filter(function(domain) {
        return domain.hostname != hostname;
      });
      db.apps.save(app);
      break;

    case 'clear':
      db.domains.remove({_id: {$in: app.domains}});

      delete app.domains;
      db.apps.save(app);
      break;

    default:
      break;
  }
  
})();
