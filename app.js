'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const { createDatabse, activateWordPress, connectToServer } = require('./create');
/* 
const createDatabse = require('./create').createDatabase;
const activateWordPress = require('./create').activateWor dPress;
*/

const app = express()
const port = 3000

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.post('/create-wordpress-database', (req, res) => {
    const { cPanelUser, databaseName, databaseUser, databasePassword } = req.body
    return createDatabse(cPanelUser, databaseName, databaseUser, databasePassword)
        .then(results => {
            console.log(results);
            res.send({
                success: true,
                message: `Successfully created db`,
            })
        })
        .catch(e => res.send({
            success: false,
            message: 'No go on the db creation',
            e,
        }))
})

app.post('/activate-wordpress', (req, res) => {
    const { cPanelUser, databaseName, databaseUser, databasePassword, title, admin_user, admin_password, admin_email } = req.body

    return activateWordPress(cPanelUser, databaseName, databaseUser, databasePassword, title, admin_user, admin_password, admin_email)
        .then(results => {
            console.log(results);
            res.send({
                success: true,
                message: `Successfully created db`,
            })
        })
        .catch(e => res.send({
            success: false,
            message: 'No go on the db creation',
            e,
        }))
})

app.get('/connect-to-server', (req, res) => {
    return connectToServer(req.body)
    .then(() => {
        res.send({
            success: true,
        })
    })
    .catch(e => res.send({
        success: false,
    }))
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});