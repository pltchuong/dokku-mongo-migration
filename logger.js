'use strict';

function wierdStringToByteArray(string) {
  var pattern = /^(M-\^?[a-zA-Z]?)(M-\^?[a-zA-Z]?)(M-\^?[a-zA-Z]?)$/;
  var weirds = pattern.exec(string);
  var bytes = [wierdStringToByte(weirds[1]), wierdStringToByte(weirds[2]), wierdStringToByte(weirds[3])];
  return utf8BytesToString(bytes);
}

function wierdStringToByte(weird) {
  // http://www.csgnetwork.com/asciiset.html
  // http://jjrscott.com/unicode-browser/ >>>>> utf8codes(codePointsFromString('✔'))
  var data = weird.split('-')[1];
  if(data.includes('^')) {
    return data.substring(1).charCodeAt() + 64;
  } else {
    return data.charCodeAt() + 128;
  }
}

/* jshint ignore:start */
function utf8BytesToString(bytes) {
  var out = [], pos = 0, c = 0;
  while (pos < bytes.length) {
    var c1 = bytes[pos++];
    if (c1 < 128) {
      out[c++] = String.fromCharCode(c1);
    } else if (c1 > 191 && c1 < 224) {
      var c2 = bytes[pos++];
      out[c++] = String.fromCharCode((c1 & 31) << 6 | c2 & 63);
    } else if (c1 > 239 && c1 < 365) {
      var c2 = bytes[pos++];
      var c3 = bytes[pos++];
      var c4 = bytes[pos++];
      var u = ((c1 & 7) << 18 | (c2 & 63) << 12 | (c3 & 63) << 6 | c4 & 63) - 0x10000;
      out[c++] = String.fromCharCode(0xD800 + (u >> 10));
      out[c++] = String.fromCharCode(0xDC00 + (u & 1023));
    } else {
      var c2 = bytes[pos++];
      var c3 = bytes[pos++];
      out[c++] = String.fromCharCode((c1 & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
    }
  }
  return out.join('');
}
/* jshint ignore:end */

(function() {
  // printjson('logger ' + parameters);

  var url = 'apps.solutionsresource.com';
  var now = new Date(),
      parsed = parameters.match(/([^\s]*)\s?(.*)?/),
      type = parsed[1],
      log = parsed[2] || '',
      activity = db.activities.findOne({_id: uuid});

  log = log.replace(/\^\[\[\d{1,}\w/g, '');
  log = log.replace(/00[0-9a-z]{2,}\^[A-Z]/g, '');
  log = wierdStringToByteArray(log);

  if(type === 'out') {
    activity.stdout += log + '\n';
  }
  if(type === 'err') {
    activity.stderr += log + '\n';
  }

  if(activity.stdout.includes('*****end*****')) {
    if(activity.stderr) {
      activity.status = 'failed';
    } else {
      activity.status = 'succeeded';
    }
  } else {
    activity.status = 'running';
  }

  activity.updated_at = now;
  db.activities.save(activity);
})();