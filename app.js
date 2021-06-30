require('dotenv').config()
const Express = require('express')
const app = Express();
const dbConnection = require('./db');

app.use(Express.json());
const controllers = require('./controllers');

app.use('/test', (req, res) => {
    res.send('test message')
});

app.use(require('./middleware/headers'));
app.use('/user', controllers.usercontroller);

// app.use(require('./middleware/validatesession'));
// app.use('/items', controllers.itemcontroller);
// app.use('/locations', controllers.locationcontroller);
// app.use('/user/info', controllers.usercontroller);
// app.use('/user/update', controllers.usercontroller);
// app.use('/user/delete', controllers.usercontroller);


dbConnection.authenticate()
    //.then(() => dbConnection.sync({alter: true}))
    // run the above line one time, if updating models
    .then(() => dbConnection.sync())
    .then(() =>{
        app.listen(process.env.PORT, ()=>{
            console.log(`[Server]: App is listening on ${process.env.PORT}.`);
        });
    })
    .catch((err) => {
        console.log(`[Server]: Server crashed. Error = ${err}`);
    });