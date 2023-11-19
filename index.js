const express = require('express');
const {} = require("express");
const uuid = require('uuid');
const app = express();
const port = 8080;

const users = ['defaultUser'];

const bodyParser = require('body-parser');
/*const cors = require("cors");
const corsOption = {
    origine: '*',
    methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE', 'UPDATE'],
    credentials: true
};
const uuidv4 = require('uuid/v4');*/




const tasks = {};

app.use(bodyParser.json());
//app.use(cors(corsOption));

/*app.use(function(error, req, res, next) {
    if (error instanceof SyntaxError) {
        res.status(400).send({
            errorCode: 'PARSE_ERROR',
            message: 'Arguments could not be parsed, ake sure request is valid.'
        });
    } else {
        res.status(500).send('Something broke server-side.', error);
    }
});*/

app.get('/', (req, res) => {
    res.send("Hi there");
});

app.post('/users', (req, res) => {
    const userId = uuid.v4();       // genere un userId
    users.push(userId);

    return res.status(201).send(JSON.stringify({'id': userId}));
});

app.get('/:userId/tasks', (req, res) => {
    const userId = req.params.userId;      
    const userTasks = tasks[userId]
    return res.status(200).send(JSON.stringify({tasks: userTasks}));
    /*ensureUserExist(userId, res, function() {
        const tasks = getUserTasks(userId);

        return res.status(200).send(JSON.stringify({'tasks': tasks}));
    });*/
});

app.post('/:userId/tasks', (req, res) => {
    const userId = req.params.userId;

    if (users.indexOf(userId) === -1) {
        return res.status(400).send('User with id \'' + userId + '\'doesn\'t exist');
    }

    if (!tasks[userId]) {
        tasks[userId] = []
    }

    const userTasks = tasks[userId] || [];

    const task = {id: uuid.v4(), name: req.body.name}; 
    userTasks.push(task)
    tasks[userId] = userTasks
    //userTasks[userId] = userTasks[userId].push(task);

    return res.status(200).send(JSON.stringify({task}));

    
});

app.put('/:userId/tasks/:taskId', (req, res) => {
    const userId = req.params.userId;
    const taskId = req.params.taskId;
    
    if (users.indexOf(userId) === -1) {
        return res.status(400).send('User with id \'' + userId + '\'doesn\'t exist');
    }

    const userTasks = tasks[userId];

    const indexOfTasks = userTasks.findIndex((task) => task.id === taskId);
    
    if (indexOfTasks === -1) {
        return res.status(404).send();
    }

    const task = userTasks[indexOfTasks];
    task.name = req.body.name;

    userTasks[indexOfTasks] = task;
    tasks[userId] = userTasks;

    return res.status(200).send(JSON.stringify ({task}));    
})

app.delete('/:userId/tasks/:taskId', (req, res) => {
    const userId = req.params.userId;
    const taskId = req.params.taskId;
    
    if (users.indexOf(userId) === -1) {
        return res.status(400).send('User with id \'' + userId + '\'doesn\'t exist');
    }

    const userTasks = tasks[userId];

    const indexOfTasks = userTasks.findIndex((task) => task.id === taskId);
    
    if (indexOfTasks === -1) {
        return res.status(404).send();
    }

    userTasks.splice(indexOfTasks)    

    return res.status(204).send();    
})

app.listen(port, () => {
    console.log('Server Listening on port 8080')
});

