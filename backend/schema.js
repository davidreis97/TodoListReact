var mongoose = require('mongoose');

function create(){
    let todoItemSchema = new mongoose.Schema({
        _id: mongoose.Schema.Types.ObjectId,
        list: { type: mongoose.Schema.Types.ObjectId, ref: 'TodoList', required: true },
        title: { type: String, required: true },
        creationDate: { type: Number, required: true },
        finishDate: { type: Number, required: true },
        done: { type: Boolean, required: true }
    });
    
    let todoListSchema = new mongoose.Schema({
        _id: mongoose.Schema.Types.ObjectId,
        owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        title: { type: String, required: true },
    });

    let userSchema = new mongoose.Schema({
        _id: mongoose.Schema.Types.ObjectId,
        username: {type: String, unique: true, required: true},
        hashedPassword: { type: String, required: true },
        lastToken: String,
        lastTokenDate: Number,
    });

    const TodoItem = mongoose.model('TodoItem', todoItemSchema);
    const TodoList = mongoose.model('TodoList', todoListSchema);
    const User = mongoose.model('User', userSchema);

    return [TodoItem,TodoList,User];
}

module.exports = {
    create
}