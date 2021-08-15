// import Todo Model
const  Todo = require("../models/todoModel");

// DEFINE CONTROLLER FUNCTIONS

// listAllTodos function - To list all todos
exports.listAllTodos = (res) => {
Todo.find({}, (err, todo) => {
if (err) {
res.status(500).send(err);
}
else if (todo.length == 0){
    res.status(200).json({ message:"List is empty"});
}
else{
    res.status(200).json(todo);
    console.log("🚀 ~ file: todoController.js ~ line 17 ~ Todo.find ~ todo", todo)
}
});
};

// createNewTodo function - To create new todo
exports.createNewTodo = (req, res) => {
let  newTodo = new Todo (req.body);
newTodo.save((err, todo) => {
if (err) {
res.status(500).send(err);
}
res.status(201).json(todo);
});
};

// updateTodo function - To update todo status by id
exports.updateTodo = (req, res) => {
Todo.findOneAndUpdate({ _id:req.params.id }, req.body, { new:true }, (err, todo) => {
if (err) {
res.status(500).send(err);
}
res.status(200).json(todo);
});
};

// deleteTodo function - To delete todo by id
exports.deleteTodo = async ( req, res) => {
await  Todo.deleteOne({ _id:req.params.id }, (err) => {
if (err) {
return res.status(404).send(err);
}
res.status(200).json({ message:"Todo successfully deleted"});
});
};

exports.getTodoWithPagination = async (req, res) => {
    const count = +req.query.count;
    const page = +req.query.page;
    try {
        const response = await Todo.find().skip(count * (page - 1)).limit(count)
        res.status(200).json({response })
    } catch (err) {
        console.log(err)
    }
  }



    
    
//     try{
//       const response = await Games.find().skip(count * (page - 1)).limit(count)
//       res.status(200).json({games: response})
//     }catch(err){
//       console.log(err)
//     }
//   }