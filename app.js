var mongojs = require("mongojs");
var express = require("express");
var app = express();

var bodyParser = require('body-parser');

app.use(bodyParser.json()); // app is the express application 
app.use(bodyParser.urlencoded({ extended: true }));

var db = mongojs("localhost:27017/testDB", ['confession']);

app.post("/confession", function (req,res){
    
    var name = req.body.name;
    // var dateObject = req.body.date; --> this is not as good: if let people type in the date but person types date wrongly, mongodb cannot store this date properly (can't be queried)
    var confession = req.body.confession;
    
    var dateObject = new Date (); // users don't have to type date themselves, auto-generated
    
    db.confession.save({name: name, text: confession, createdAt: dateObject}, function (err,docs){
        // Is "confession" defined?
        res.send({status: 200, data: {name: name, text: confession, createdAt: dateObject}});
    });
});

app.get("/confession/all", function (req, res){
    db.confession.find(function (err, docs){
        if (err){
            res.send("Agh what's going on?? Come back later!")
        } else {
            res.send({
                status: 200,
                data: docs
            })
        }
    })
    
})


app.delete("/deleteall", function (req, res){
    db.confession.remove(function(err,docs){
        res.send(docs)
    })
})

// Are you using POST request?
app.delete("/delete/:id", function(req,res){

    var id = mongojs.ObjectId(req.params.id)
    
    db.confession.remove({_id: id}, true, function (err,docs){
        res.send(docs)
    })
})

app.listen(8080)