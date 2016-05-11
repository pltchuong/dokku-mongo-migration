(function() {
  printjson('post-create ' + parameters);

  var url = 'apps.solutionsresource.com';
  var now = new Date(),
      parsed = parameters.match(/(.*)/),
      name = parsed[1],
      app = {
        _id: uuid,
        name: name,
        web_url: name + '.' + url,
        git_url: 'dokku@' + url + ':' + name,
        created_at: now,
        updated_at: now
      };

  db.apps.save(app);

})();
