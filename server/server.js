const path = require('path');
const express = require('express');

const publicPath = path.join(__dirname, '../public');

var app = express();

app.use(express.static(publicPath));

app.listen(4000, () => {
    console.log('Express server is up on port 4000');
});
