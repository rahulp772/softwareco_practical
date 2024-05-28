const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./app/routes');
require('dotenv').config();

require('./app/helpers/db');

const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api', routes);


let PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
