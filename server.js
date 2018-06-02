const express = require('express');
const helmet = require('helmet');
const app = express();

// Redirect http to https
const forceSSL = function () {
    return function (req, res, next) {
        if (req.get('Host').indexOf('localhost') != -1) {
            return;
        }
        if (req.headers['x-forwarded-proto'] !== 'https') {
            return res.redirect(
                ['https://', req.get('Host'), req.url].join('')
            );
        }
        next();
    }
}
app.use(forceSSL());

app.use(helmet());
app.use(helmet.referrerPolicy());
app.use(helmet.contentSecurityPolicy({
    reportOnly = true,
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "use.fontawesome.com", "wow.zamimg.com", "www.google-analytics.com", "wipefest.net", "www.wipefest.net", "wipefest-dev.herokuapp.com", "www.wowhead.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "use.fontawesome.com", "maxcdn.bootstrapcdn.com", "wow.zamimg.com", "fonts.googleapis.com", "wipefest.net", "www.wipefest.net", "wipefest-dev.herokuapp.com", "www.wowhead.com"],
        fontSrc: ["'self'", "use.fontawesome.com", "fonts.gstatic.com"],
        connectSrc: ["'self'", "raw.githubusercontent.com", "www.warcraftlogs.com", "api.wipefest.net", "www.google-analytics.com", "www.wowhead.com"],
        imgSrc: ["'self'", "data:", "http:", "wowanalyzer.com", "www.google-analytics.com", "*.imgur.com", "warcraftlogs.com", "www.warcraftlogs.com", "wipefest.net", "www.wipefest.net", "wipefest-dev.herokuapp.com", "www.wowhead.com"]
    }
}));

// Gzip
const compression = require('compression');
app.use(compression());

// Serve static files
app.use(express.static(__dirname + '/dist'));

// Redirect all requests to index.html so path location can kick in
const path = require('path');
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/index.html'));
});

app.listen(process.env.PORT || 8080);