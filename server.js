const express = require('express');
const app = express();
const boundingBox = require('./models/boundingBox.js');
const request = require('request');
// const boundingBoxSchema = require('./models/boundingBoxSchema.js');
const tasks = require('./models/tasks.js');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bhttp = require('bhttp');
mongoose.connect('mongodb://localhost:27017/test');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}));
// parse application/json
app.use(bodyParser.json())

var new_data = false; // true = new data; false = no new data.

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.post('/oh/shit', (req, res) => {
    console.log(JSON.stringify(req.body));
    res.sendStatus(200);
})

app.post('/complete/task', (req, res) => {
    const boundingBox = (req.body.bounding_box);
    const task = (req.body.obj);

    // label task as complete
    tasks.findById(task._id).then((document) => {
            document.completed = true;
            document.save();
        })
        // POST to callback_url with boundingBox
    post_request('https://60ed3e1c.ngrok.io/oh/shit', boundingBox);

    res.sendStatus(200);
})

app.post('/fetch/tasks', (req, res) => {
    tasks.find().then((documents) => {
        return documents.filter(filterBySuccess)
    }).then((documents) => {
        res.send(documents);
    })
})

function filterBySuccess(document) {
    if (document.completed === false) {
        return true;
    }
    return false;
}

app.post('/v1/task/annotation', (req, res) => {
    res.sendStatus(200);
    const task = new boundingBox(req.body.api_key,
        req.body.instruction,
        req.body.attachment,
        req.body.attachment_type,
        req.body.objects_to_annotate,
        req.body.with_labels,
        req.body.callback_url);

    var task_object = task.ret_req();
    if (task_object.error_list.length > 0) {
        // At least one error was found.
        // send back error(s) to the callback.
        console.log('task object: ' + JSON.stringify(task_object));
        console.log('attempt: ' + task_object.callback_url)
        console.log('errors: ' + JSON.stringify(task_object.error_list));
        // Send POST request to given callback.
        post_request(task_object.callback_url, task_object.error_list);
        // End execution
        return;
    }

    var requested_task = new tasks(task_object);

    // Save...
    requested_task.save();

    // We got new data!
    new_data = true;

    // complete execution, nice work.
    return;
});
// For posting JSON data
function post_request(url, obj) {
    bhttp.post(url, {
        body: obj
    }).then((res) => {
        // console.log('response from host: ' + res);
    })
}

app.listen(3000);