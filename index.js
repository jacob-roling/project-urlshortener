require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dns = require("node:dns");

const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(
  (req, _, next) => {
    console.log(`${req.method} ${req.path} - ${req.ip}`);
    next();
  },
  cors(),
  bodyParser.urlencoded({ extended: false })
);

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

const urls = [];

app.post("/api/shorturl", function (req, res) {
  try {
    const url = new URL(req.body.url);
    if (!(url.protocol == "http:" || url.protocol == "https:")) {
      return res.json({
        error: "invalid url",
      });
    }
    urls.push(url);
    return res.json({ original_url: url.href, short_url: urls.length - 1 });
  } catch (err) {
    return res.json({
      error: "invalid url",
    });
  }
  // dns.lookup(url.host, (err, address, family) => {
  //   if (err)
  //     return res.json({
  //       error: "invalid url",
  //     });
  // });
});

app.get("/api/shorturl/:url", function (req, res) {
  // console.log(req.params.url);
  if (urls[req.params.url]) {
    return res.redirect(urls[req.params.url]);
  } else {
    return res.json({
      error: "invalid url",
    });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
