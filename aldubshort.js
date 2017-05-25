module.exports = function(a, db) {

  a.route('/:url')
    .get(aldubGrab);

  a.get('/luv/:url*', handlePost);

  function checkerU(url) {
    var regex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
    return regex.test(url);
  }
  function aldubGrab(req, res) {
    var url = process.env.APP_URL + req.params.url;
    if (url != process.env.APP_URL) {
      findURL(url, db, res);
    }
  }

  function handlePost(req, res) {
    var url = req.url.slice(5);
    var urlObj = {};
    if (checkerU(url)) {
      urlObj = {
        "original_url": url,
        "short_url": process.env.APP_URL + maGicHash()
      };
      res.send(urlObj);
      save(urlObj, db);
    } else {
      urlObj = {
        "error": "I\'m sure that this is not a real website."
      };
      res.send(urlObj);
    }
  }

  function maGicHash() {
      var seed = Math.floor(100000 + Math.random() * 900000).toString().substring(0,4);
      var hashSha = h(seed,{encoding: "base64", algorithm: "sha512"});
      var hashShaFive = hashSha.replace('/','-');
          hashShaFive = hashShaFive.replace('+','_');
      return hashShaFive.toString().substring(0,4);
          
    
  }

  function save(obj, db) {
    var sites = db.collection('sites');
    sites.save(obj, function(err, result) {
      if (err) throw err;
      console.log('Saved ' + result);
    });
  }

  function findURL(link, db, res) {
    var sites = db.collection('sites');
    sites.findOne({
      "short_url": link
    }, function(err, result) {
      if (err) throw err;
      if (result) {
        console.log('Found ' + result);
        console.log('Redirecting to: ' + result.original_url);
        res.redirect(result.original_url);
      } else {
        res.send({
        "error": "This is not present in my database."
      });
      }
    });
  }
};