'use strict';

(function() {

  var now = new Date(),
      parsed = parameters.match(/([^\s]*)\s([^\s]*)\s(.*)/),
      name = parsed[1],
      app = db.apps.findOne({name: name}),
      command = parsed[2],
      raw = parsed[3],
      parseUnsetConfigs = function (raw) {
        return raw.split(' ');
      },
      parseSetConfigs = function (raw) {
        var configs = [];
        var tmp = false;
        raw = raw.split(' ');
        raw.forEach(function(config, i) {
          if(config.indexOf('=') > 0) {
            if(tmp) {
              configs.push(tmp);
            }
            tmp = config;
          } else {
            tmp += ' ' + config;
          }
          if(i === raw.length - 1) {
            configs.push(tmp);
          }
        });
        return configs;
      };

  if(app) {
    app.configs = app.configs || [];
    var configs = false;
    switch(command) {
      case 'set':
        configs = parseSetConfigs(raw);
        configs.forEach(function(tmp) {
          var pair = tmp.split('=');
          var found = app.configs.filter(function(config) {
            return Object.keys(config)[0] === pair[0];
          });
          if(found.length > 0) {
            app.configs[app.configs.indexOf(found[0])][pair[0]] = pair[1];
          } else {
            var config = {};
            config[pair[0]] = pair[1];
            app.configs.push(config);
          }
        });
        break;
      case 'unset':
        configs = parseUnsetConfigs(raw);
        app.configs = app.configs.filter(function(config) {
          for(var key in config) {
            return configs.indexOf(key) < 0;
          }
        });
        break;
    }

    app.updated_at = now;
    db.apps.save(app);

  }
})();
