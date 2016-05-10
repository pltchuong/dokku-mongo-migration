(function() {
  printjson('post-create ' + parameters);

  var url = 'apps.solutionsresource.com';
  var now = new Date(),
      parsed = parameters.match(/(.*)/),
      name = parsed[1],
      app = {
        name: name,
        web_url: name + '.' + url,
        git_url: 'dokku@' + url + ':' + name
      },
      domain = {
        hostname: name + '.' + url,
        cname: null,
        kind: 'dokku'
      };

  app.created_at = now;
  app.updated_at = now;
  db.apps.save(app);
  app = db.apps.findOne(app);

  domain.app = app._id;
  domain.created_at = now;
  domain.updated_at = now;
  db.domains.save(domain);
  domain = db.domains.findOne(domain);

  app.domains = [domain._id];
  app.updated_at = now;
  db.apps.save(app);

})();
