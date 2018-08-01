import 'babel-polyfill'

// promises
if (typeof Promise === 'undefined') {
  // Rejection tracking prevents a common issue where React gets into an
  // inconsistent state due to an error, but it gets swallowed by a Promise,
  // and the user has no idea what causes React's erratic future behavior.
  require('promise/lib/rejection-tracking').enable();
  window.Promise = require('promise/lib/es6-extensions.js');
}

// fetch api
require('whatwg-fetch');

// Object.assign(), que é muito usado em React (e pode ser útil em outros casos, também)
Object.assign = require('object-assign');

// `localStorage` e `sessionStorage` no Safari
try {
  // Test webstorage existence.
  if (!window.localStorage || !window.sessionStorage) throw "exception";
  // Test webstorage accessibility - Needed for Safari private browsing.
  localStorage.setItem('storage_test', 1);
  localStorage.removeItem('storage_test');
} catch(e) {
  (function () {
    var Storage = function (type) {
      function createCookie(name, value, days) {
        var date, expires;

        if (days) {
          date = new Date();
          date.setTime(date.getTime()+(days*24*60*60*1000));
          expires = "; expires="+date.toGMTString();
        } else {
          expires = "";
        }
        document.cookie = name+"="+value+expires+"; path=/";
      }

      function readCookie(name) {
        var nameEQ = name + "=",
          ca = document.cookie.split(';'),
          i = 0,
          len = ca.length,
          c;

        for (; i < len; i++) {
          c = ca[i];
          while (c.charAt(0)==' ') {
            c = c.substring(1,c.length); 2480
          }

          if (c.indexOf(nameEQ) == 0) {
            return c.substring(nameEQ.length,c.length);
          }
        }
        return null;
      }

      function setData(data) {
        // Convert data into JSON and encode to accommodate for special characters.
        data = encodeURIComponent(JSON.stringify(data));
        // Create cookie.
        if (type == 'session') {
          createCookie(getSessionName(), data, 365);
        } else {
          createCookie('localStorage', data, 365);
        }
      }

      function clearData() {
        if (type == 'session') {
          createCookie(getSessionName(), '', 365);
        } else {
          createCookie('localStorage', '', 365);
        }
      }

      function getData() {
        // Get cookie data.
        var data = type == 'session' ? readCookie(getSessionName()) : readCookie('localStorage');
        // If we have some data decode, parse and return it.
        return data ? JSON.parse(decodeURIComponent(data)) : {};
      }

      function getSessionName() {
        // If there is no name for this window, set one.
        // To ensure it's unquie use the current timestamp.
        if (!window.name) {
          window.name = new Date().getTime();
        }
        return 'sessionStorage' + window.name;
      }

      // Initialise if there's already data.
      var data = getData();

      return {
        length: 0,
        clear: function () {
          data = {};
          this.length = 0;
          clearData();
        },
        getItem: function (key) {
          return data[key] === undefined ? null : data[key];
        },
        key: function (i) {
          // not perfect, but works
          var ctr = 0;
          for (var k in data) {
            if (ctr == i) return k;
            else ctr++;
          }
          return null;
        },
        removeItem: function (key) {
          delete data[key];
          this.length--;
          setData(data);
        },
        setItem: function (key, value) {
          data[key] = value+''; // forces the value to a string
          this.length++;
          setData(data);
        }
      };
    };

    // Replace window.localStorage and window.sessionStorage with out custom
    // implementation.
    var localStorage = new Storage('local');
    var sessionStorage = new Storage('session');
    window.localStorage = localStorage;
    window.sessionStorage = sessionStorage;
    // For Safari private browsing need to also set the proto value.
    window.localStorage.__proto__ = localStorage;
    window.sessionStorage.__proto__ = sessionStorage;
  })();
}

// converte valores `float` em moeda
Number.prototype.formatMoney = function(c = 2, d = ',', t = '.') {
  var n = this;
  c = isNaN(c = Math.abs(c)) ? 2 : c;
  var s = n < 0 ? "-" : "";
  var i = parseInt( n = Math.abs(+n || 0).toFixed(c) ) + "";
  var j = ( j = i.length ) > 3 ? j % 3 : 0;
  return s + ( j ? i.substr(0, j) + t : "" ) + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
}
