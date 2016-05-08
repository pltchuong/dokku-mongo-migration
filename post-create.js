(function() {
  printjson('post-create ' + parameters);

  var name = parameters,
      url = 'apps.solutionsresource.com',
      app = {
        name: name,
        web_url: name + '.' + url,
        git_url: 'dokku@' + url + ':' + name,
        created_at: new Date(),
        updated_at: new Date(),
      },
      domain = {
        hostname: name + '.' + url,
        cname: null,
        kind: 'dokku',
        created_at: new Date(),
        updated_at: new Date(),
      };

  db.apps.insert(app);
  app = db.apps.findOne(app);

  domain.app = app._id;
  db.domains.save(domain);
  domain = db.domains.findOne(domain);

  app.domains = [domain._id];
  db.apps.save(app);
})();
