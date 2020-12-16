const config = require('./constance/config.json')

let app;
if (config["dev-mode"]) {
    console.log('dev-mode activated')
    app = require('./playground')
} else {
    app = require('./production')
}

const PORT = process.env.PORT || 8080

// Comment out when deploy
app.listen(PORT, () => {
    console.log(`Server is running on port : ${PORT}`)
})
