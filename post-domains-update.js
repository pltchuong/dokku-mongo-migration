(function() {
  printjson('post-domains-update ' + parameters);

  var url = 'apps.solutionsresource.com';
  var parsed = parameters.match(/([^\s]*)\s([^\s]*)\s(.*)/),
      app = db.apps.findOne({name: parsed[1]}),
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
      break;
    case 'clear':
      break;
    default:
      break;
  }
  
})();
