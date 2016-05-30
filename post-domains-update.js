'use strict';

(function() {
  printjson('post-domains-update ' + parameters);

  var url = 'apps.solutionsresource.com';
  var now = new Date(),
      parsed = parameters.match(/([^\s]*)\s?([^\s]*)?\s?(.*)?/),
      name = parsed[1],
      app = db.apps.findOne({name: name}),
      action = parsed[2],
      hostname = parsed[3],
      cname = app.name + '.' + url,
      domain = {
        app: app._id,
        hostname: hostname ? hostname : cname,
        cname: hostname ? cname : null,
        kind: hostname ? 'custom' : 'dokku'
      };

  switch(action) {
    case 'add':
      domain.created_at = now;
      domain.updated_at = now;

      app.domains = app.domains || [];
      app.domains.push(domain);
      app.updated_at = now;
      db.apps.save(app);
      break;

    case 'remove':
      app.domains = app.domains.filter(function(tmp) {
        return tmp.hostname !== domain.hostname;
      });
      app.updated_at = now;
      db.apps.save(app);
      break;

    case 'clear':
      app.domains = app.domains.filter(function(tmp) {
        return tmp.cname === null;
      });
      app.updated_at = now;
      db.apps.save(app);
      break;

    default:
      // plugins/certs/subcommands/remove
      // plugn trigger post-domains-update "$APP"
      break;
  }
  
})();
