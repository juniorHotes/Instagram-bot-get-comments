const express = require('express')
const bodyParse = require('body-parser')
const app = express()
const port = 3333

app.set('view engine', 'ejs')
app.use(express.static(__dirname + "/public"))

app.use(bodyParse.urlencoded({ extended: false }))
app.use(bodyParse.json())

const ProfileController = require('./controllers/ProfileController')
const DrawController = require('./controllers/DrawController')
// const MostMarkedController = require('./controllers/MostMarkedController')

app.use('/', ProfileController)
app.use('/', DrawController)
// app.use('/', MostMarkedController)

app.get('/:userNotFound?/:isPrivate?', (req, res) => {
    const userNotFound = req.query['userNotFound']
    const isPrivate = req.query['isPrivate']

    res.render('index', { userNotFound, isPrivate })
})

app.listen(port)