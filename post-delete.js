(function() {
  printjson(uuid);
  printjson('post-delete ' + parameters);

  var url = 'apps.solutionsresource.com';
  var now = new Date(),
      parsed = parameters.match(/([^\s]*)\s([^\s]*)?/),
      name = parsed[1],
      app = db.apps.findOne({name: name});

  db.domains.remove({_id: {$in: app.domains}});
  db.apps.remove(app);

})();
