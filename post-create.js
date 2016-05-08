(function() {
  printjson('post-create ' + parameters);

  var url = 'apps.solutionsresource.com';
  var parsed = parameters.match(/(.*)/),
      name = parsed[1],
      app = {
        name: name,
        web_url: name + '.' + url,
        git_url: 'dokku@' + url + ':' + name,
        created_at: new Date(),
        updated_at: new Date(),
      };

  db.apps.save(app);

})();
