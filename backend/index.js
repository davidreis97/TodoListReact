var schema = require('./schema');
var mongoose = require('mongoose');
var crypto = require('crypto');
const express = require('express')
var uuid = require('uuid');
const app = express()

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

mongoose.connect('mongodb://localhost:27017', {useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  startServer();
});

function startServer(){
    const port = 3000

    app.listen(port, () => console.log(`Server listening at http://localhost:${port}`))
    const [TodoItem,TodoList,User] = schema.create();
    
    app.use(function(_req, res, next) {
        res.header('Access-Control-Allow-Origin', 'http://localhost:3001');
        res.header('Access-Control-Allow-Methods', '*');
        res.header('Access-Control-Allow-Headers', '*');
        res.header('Access-Control-Expose-Headers', '*');
        next();
    });

    //------------------------
    //-LOGIN AND REGISTRATION-
    //------------------------
    app.post('/login', (req, res) => {
        User.findOne({username:req.body.username}).exec(function (err, user) {
            if (user) {
                const receivedHash = crypto.createHash('sha256').update(req.body.password).digest('base64');

                if(receivedHash != user.hashedPassword){
                    res.statusCode = 401;
                    res.send({
                        err: "Wrong Password"
                    });
                    return;
                }

                user.lastToken = uuid.v4();
                user.lastTokenDate = new Date().getTime();

                user.save((err,user) => {
                    if(err){
                        console.log(err);
                        res.statusCode = 500;
                        res.send({
                            err: "Internal Error"
                        });
                        return;
                    }
                    
                    res.statusCode = 200;
                    res.send({
                        username: user.username,
                        token: user.lastToken
                    });
                })                
            }else{
                res.statusCode = 404;
                res.send({
                    err: "User not found"
                })
            }
        });
    });

    app.post('/register', (req, res) => {
        var user = new User({
            _id: mongoose.Types.ObjectId(),
            username: req.body.username,
            hashedPassword: crypto.createHash('sha256').update(req.body.password).digest('base64'),
            lastToken: uuid.v4(),
            lastTokenDate: new Date().getTime(),
        });

        user.save((err,user) => {
            if(err){
                console.log(err);
                res.statusCode = 400;
                res.send({
                    err: "Username already exists"
                })
            }else{
                res.statusCode = 201;
                res.send({
                    username: user.username,
                    token: user.lastToken
                });
            }
        });
    });

    //--------------
    //-USER ACTIONS-
    //--------------
    app.use('/user/*',function(req, res, next) {
        if (req.method == "OPTIONS"){
            next();
            return;
        }

        let username = req.get('username');
        let token = req.get('authorization');
        User.findOne({username:username}).exec(function (err, user) {
            if(err || !user){
                res.status = 401;
                res.send({
                    err: "User not found"
                });
                return;
            }
            
            if(user.lastToken != token || user.lastTokenDate + 3600000 < new Date().getTime()){
                console.log("Token needs renewal: " + username);
                res.status = 401;
                res.send({
                    err: "Mismatched token"
                });
                return;
            }
            
            user.lastTokenDate = new Date().getTime();
            user.save();

            res.locals.user = user;
            next();
        });

    });

    app.get('/user/projects', (req, res) => {
        TodoList.find({owner:res.locals.user._id},async (err,lists) => {
            if(err){
                console.log(err);
                res.statusCode = 500;
                res.send({
                    err: "Internal Error"
                });
                return;
            }

            let returnObj = [];
            for(let list of lists){
                let todoItems = await TodoItem.find({list: list._id});

                let listObj = {
                    id: list._id,
                    title: list.title,
                    todoItems: []
                }
                
                for(let item of todoItems){
                    listObj.todoItems.push({
                        id: item._id,
                        title: item.title,
                        done: item.done
                    })
                }

                returnObj.push(listObj);
            }

            res.statusCode = 200;
            res.send(returnObj);
        });
    });

    app.post('/user/project', (req, res) => {
        let newTodoList = new TodoList({
            _id: mongoose.Types.ObjectId(),
            owner: res.locals.user._id,
            title: req.body.title,
        });
        newTodoList.save((err,list) => {
            if(err){
                console.log(err);
                res.statusCode = 500;
                res.send({
                    err: "Internal Error"
                });
                return;
            }

            res.statusCode = 201;
            res.send({id:list._id});
        });
    });

    app.post('/user/item', (req, res) => {
        TodoList.findById(req.body.listId, (err, list) => {
            if(err){
                console.log(err);
                res.statusCode = 500;
                res.send({
                    err: "Internal Error"
                });
                return;
            }

            if(String(res.locals.user._id) != String(list.owner)){
                console.log("Not the owner");
                res.statusCode = 401;
                res.send({
                    err: "Not the list owner"
                });
                return;
            }

            let newTodoItem = new TodoItem({
                _id: mongoose.Types.ObjectId(),
                list: req.body.listId,
                title: req.body.title,
                done: false
            });
            newTodoItem.save((err,item) => {
                if(err){
                    console.log(err);
                    res.statusCode = 500;
                    res.send({
                        err: "Internal Error"
                    });
                    return;
                }
    
                res.statusCode = 201;
                res.send({id:item._id});
            });
        });
    });

    app.patch('/user/item', (req, res) => {
        TodoItem.findById(req.body.id, (err,item) => {
            if(err){
                console.log(err);
                res.statusCode = 500;
                res.send({
                    err: "Internal Error"
                });
                return;
            }

            TodoList.findById(item.list, (err, list) => {
                if(err){
                    console.log(err);
                    res.statusCode = 500;
                    res.send({
                        err: "Internal Error"
                    });
                    return;
                }
    
                if(String(res.locals.user._id) != String(list.owner)){
                    console.log("Not the owner");
                    res.statusCode = 401;
                    res.send({
                        err: "Not the list owner"
                    });
                    return;
                }
            });

            item.title = req.body.title;
            item.done = req.body.done;
            item.save((err,_item) => {
                if(err){
                    console.log(err);
                    res.statusCode = 500;
                    res.send({
                        err: "Internal Error"
                    });
                    return;
                }
    
                res.statusCode = 200;
                res.send({});
            });
        });
    });

    app.delete('/user/project', (req, res) => {
        TodoList.deleteOne({ _id: req.body.id, owner: res.locals.user._id }, function (err) {
            if(err){
                console.log(err);
                res.statusCode = 500;
                res.send({
                    err: "Internal Error"
                });
                return;
            }
        });

        TodoItem.deleteMany({ list: req.body.id }, function (err) {
            if(err){
                console.log(err);
                res.statusCode = 500;
                res.send({
                    err: "Internal Error"
                });
                return;
            }
        });

        res.statusCode = 200;
        res.send({});
    });

    app.delete('/user/item', (req, res) => {
        TodoItem.findById(req.body.id, (err,item) => {
            if(err || !item){
                res.statusCode = 500;
                res.send({
                    err: "Internal Error"
                });
                return;
            }

            TodoList.findById(item.list, (err, list) => {
                if(err){
                    console.log(err);
                    res.statusCode = 500;
                    res.send({
                        err: "Internal Error"
                    });
                    return;
                }
    
                if(String(res.locals.user._id) != String(list.owner)){
                    console.log("Not the owner");
                    res.statusCode = 401;
                    res.send({
                        err: "Not the list owner"
                    });
                    return;
                }

                TodoItem.findByIdAndDelete(req.body.id, (err,item) => {
                    if(err){
                        console.log(err);
                        res.statusCode = 500;
                        res.send({
                            err: "Internal Error"
                        });
                        return;
                    }

                    res.statusCode = 200;
                    res.send({});
                });
            });
        });
    });
}