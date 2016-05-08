(function() {
  // printjson('nginx-hostname ' + parameters);

  var url = 'apps.solutionsresource.com';
  var parsed = parameters.match(/([^\s]*)\s([^\s]*)\s(.*)/),
      app = db.apps.findOne({"name": parsed[1]}),
      subdomain = parsed[2],
      vhost = parsed[3],
      domain = {
        hostname: vhost,
        cname: subdomain,
        kind: app,
        created_at: new Date(),
        updated_at: new Date(),
      };

  app.domains = app.domains || [];
  app.domains.push(domain);

  db.apps.save(app);

})();
