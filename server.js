const express = require('express');
const app = express();

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