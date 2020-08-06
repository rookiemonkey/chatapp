const app = require('./app');

app.listen(process.env.PORT || 3030, () => {
    if (process.env.PORT) { console.log(`Server started at PORT:${process.env.PORT}`) }
    console.log('Server started at http://localhost:3030')
})