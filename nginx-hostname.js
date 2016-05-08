(function() {
  // printjson('nginx-hostname ' + parameters);

  var url = 'apps.solutionsresource.com';
  var parsed = parameters.match(/([^\s]*)\s([^\s]*)\s(.*)/),
      app = db.apps.findOne({name: parsed[1]}),
      subdomain = parsed[2],
      vhost = parsed[3],
      domain = {
        app: app._id,
        hostname: subdomain + '.' + vhost,
        cname: null,
        kind: 'dokku',
        created_at: new Date(),
        updated_at: new Date(),
      };

  db.domains.save(domain);
  domain = db.domains.findOne(domain);

  app.domains = [domain._id];
  db.apps.save(app);

})();
