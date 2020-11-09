const path = require('path');
const express = require('express');
const fejk = require('fejk');

const port = process.env.PORT || 9090;
const app = express();

// Feel free to mount the fejk express app under any route
const apiPath = '/Api';
app.use(apiPath, fejk({ path: path.join(__dirname, 'scenarios') }));

app.listen(port, () => {
    console.log(`Listening on port localhost:${port} under ${apiPath}`);
});
