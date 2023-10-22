require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');

// Basic Configuration
const port = process.env.PORT || 3000;

//URL mapping
const storedUrlLong = {};
const storedUrlShort = {};
let nextShortUrl = 0;

app.use(cors());
app.use(express.urlencoded({ extended: true }))
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.post('/api/shorturl', function(req, res) {
  const longUrl = req.body.url;
  const urlPattern = /^(http|https):\/\/[^\s/$.?#].[^\s]*$/;
  if (!urlPattern.test(longUrl)) {
    return res.json({ error: 'invalid url' });
  }
  if(storedUrlLong[longUrl]) {
    res.json({
      original_url: longUrl,
      short_url:storedUrlLong[longUrl],
    })
  } else {
    nextShortUrl++;
    storedUrlLong[longUrl] = nextShortUrl;
    storedUrlShort[nextShortUrl] = longUrl

    res.json({
      original_url: storedUrlShort[nextShortUrl],
      short_url: storedUrlLong[longUrl],
    })
  }
});

app.get('/api/shorturl/:shortUrl', function (req, res) {
  const shortUrl = req.params.shortUrl;
  const longUrl = storedUrlShort[shortUrl];

  if (longUrl) {
    res.redirect(301, longUrl);
  } else {
    res.status(404).json({ error: 'invalid url' });
  }
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
