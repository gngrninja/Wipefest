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
    reportOnly: true,
    directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'unsafe-inline'", "use.fontawesome.com", "wow.zaming.com", "google-analytics.com"],
        styleSrc: ["'unsafe-inline'", "use.fontawesome.com", "maxcdn.bootstrapcdn.com", "wow.zaming.com", "fonts.googleapis.com"],
        fontSrc: ["use.fontawesome.com", "fonts.gstatic.com"],
        connectSrc: ["raw.githubusercontent.com", "warcraftlogs.com"],
        imageSrc: ["wowanalyzer.com", "google-analytics.com", "*.imgur.com", "warcraftlogs.com"]
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