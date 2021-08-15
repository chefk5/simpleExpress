'use strict'

require('dotenv').config()
require("./config/db");

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 3000;
const http = require('http')
const server = http.createServer(app);
const {ObjectId} = require('mongodb'); // or ObjectID 

const { Server } = require("socket.io");
const io = new Server(server);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const todoList = require('./api/controllers/todoController');
const Todo = require("./api/models/todoModel");

var routes = require('./api/routes/todoRoutes');
routes(app);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    Todo.find({}, (err, todo) => {
        if (err) {
            socket.emit('error', 'Error in fetching notes')
        }
        else if (todo.length == 0) {
            socket.emit('error', 'No notes found')
        }
        else {
            socket.emit('list', todo)
        }
    });


    socket.on('add', (todo) => {
        let newTodo = new Todo(todo);
        newTodo.save((err, todo) => {
            if (err) {
                socket.emit('error', 'Error in creating note')
            }
            broadcastNotes()
        });

    });

    socket.on('list all',() =>{
        emitNotes()
    })

    socket.on('update',(note) =>{
        console.log("🚀 ~ file: server.js ~ line 59 ~ socket.on ~ req", note.note)
        Todo.findOneAndUpdate({ _id:ObjectId(note.id) }, note.note, {new: true}, (err, todo) => {
            if (err) {
                //socket.emit('error', err)
            }
            broadcastNotes()
            });
    })

    socket.on('delete', async (id) =>{
        await  Todo.deleteOne({ _id:id }, (err) => {
            if (err) {
                socket.emit('error', err)
            }
            broadcastNotes()
            });
        });
});


const broadcastNotes = () => {
    Todo.find({}, (err, todo) => {
        if (err) {
            socket.emit('error', 'Error in fetching notes')
        }
        else if (todo.length == 0) {
            socket.emit('error', 'No notes found')
        }
        else {
            io.emit('list', todo)
           // console.log("🚀 ~ file: server.js ~ line 91 ~ Todo.find ~ todo", todo)
        }
    });
}

const emitNotes=()=>{
    Todo.find({}, (err, todo) => {
        if (err) {
            socket.emit('error', 'Error in fetching notes')
        }
        else if (todo.length == 0) {
            socket.emit('error', 'No notes found')
        }
        else {
            socket.emit('list', todo)
        }
    });
}

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});