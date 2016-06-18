'use strict';

function count(string, m) {
  return string.split(m).length - 1;
}

function indexOf(string, m, i) {
  if(i > count(string, m)) {
    return undefined;
  }
  return string.split(m, i === 0 ? 1 : i).join(m).length;
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

function utf8BytesToString(bytes) {
  /* jshint ignore:start */
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
  /* jshint ignore:end */
}

function wierdStringToBytes(string) {
  var pattern = /(M-[^\s]*)/g;
  var weirds;
  var tmp = string;
  while((weirds = pattern.exec(string)) !== null) {
    for(var i = 3; i <= count(weirds[0], '-'); i = i + 3) {
      var first = indexOf(weirds[0], '-', i - 2) - 1;
      var last = indexOf(weirds[0], '-', i) + 1;
      var next = indexOf(weirds[0], '-', i + 1);
      next = next ? (next - 1) : undefined;

      var subweirds = weirds[0].substring(first, next);
      var subpattern = /(M-\^?.?)(M-\^?.?)(M-\^?.?)/g;
      var subweird;
      while((subweird = subpattern.exec(subweirds)) !== null) {
        var bytes = [wierdStringToByte(subweird[1]), wierdStringToByte(subweird[2]), wierdStringToByte(subweird[3])];
        tmp = tmp.replace(subweird[1] + subweird[2] + subweird[3], utf8BytesToString(bytes));
      }
    }
  }

  return tmp;
}

(function() {
  // printjson('logger ' + parameters);

  var url = 'apps.solutionsresource.com';
  var now = new Date(),
      parsed = parameters.match(/([^\s]*)\s([^\s]*)\s?(.*)?/),
      type = parsed[1],
      pid = parsed[2],
      log = parsed[3] || '',
      activity = db.activities.findOne({_id: uuid});

  if(activity.pid) {
    if(pid == activity.pid) {
      // do nothing, continue as usual
    } else {
      return;
    }
  } else {
    activity.pid = pid;
  }

  log = log.replace(/00[0-9a-z]{2}\^[A-Z]/g, '');
  log = log.replace(/\^\[\[\d{1,}\w/g, '');
  log = log.replace(/^0000/g, '');
  log = log.replace(/[ \t]+----->/g, '----->');
  log = wierdStringToBytes(log);

  if(type === 'out') {
    activity.stdout += log + '\n';
  }
  if(type === 'err') {
    activity.stderr += log + '\n';
  }

  if(log.includes('*****end*****')) {
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