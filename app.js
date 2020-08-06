// ======================================
// DEPENDENCIES
// ======================================
const express = require('express')
const app = express();

app.use(express.static("public"));

// ======================================
// ROUTES
// ======================================
app.get('/', (req, res) => {
    res.render('index.html')
})

module.exports = app