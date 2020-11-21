
const Rectangle = require('../models/rectangle')
const path = require('path')
require('dotenv').config({path: path.resolve(__dirname, '../.env')})
const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.SERVER_PORT

app.use(cors({origin: `http://${process.env.SERVER_IP}:${port}`}));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../views')))


app.post('/create', async (req, res) => {
    new Rectangle(req.body).save(null, {method: 'insert'}).then(function (saved) {
        console.log('New rectangle added')
        res.json(req.body)
    }, function (error) {
        if (error.errno === 1062){
            console.log("Duplicate Rectangle Found")
            res.status(409).json(req.body)
        } else {
            console.log("Bad payload passed")
            res.status(400).send("An unexpected error has occurred")
        }
    })
})


app.get('/read', async (req, res) => {
    await new Rectangle().getAllRectangles().then(function (rec) {
        res.json(rec)
    }, function (error) {
        res.json({})
    })
})


app.post('/find', async (req, res) => {
    await new Rectangle().getRectangleByID(req.body.identifier).then(function (r) {
        res.json(r)
    }, function (error) {
        res.status(409).send("Rectangle not found")
    })
})


app.put('/update', async (req, res) => {
    console.log(req.body)
    await new Rectangle().where({identifier: req.body.identifier}).save(req.body, {patch:true}).then(function (r) {
        res.json(r)
    }, function (error) {
        res.status(409).send("Rectangle not found")
    })
})

app.delete('/delete', async (req, res) => {
    console.log(req.body)
    await new Rectangle().where({identifier: req.body.identifier}).destroy().then(function (r){
        console.log("Deleted rect")
        res.send("Deleted")
    }, function (error) {
        res.status(409).send("Rectangle not found")
    })
})


app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})
