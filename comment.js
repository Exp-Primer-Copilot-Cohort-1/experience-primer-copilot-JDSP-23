//create web server
var http = require('http');
var url = require('url');
var fs = require('fs');
var mysql = require('mysql');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'comment'
});
connection.connect();

app.get('/comment', function(req, res){
    fs.readFile('comment.html', 'utf8', function(error, data){
        connection.query('SELECT * FROM comment', function(error, results, fields){
            if(error) throw error;
            res.send(data);
        });
    });
});

app.post('/comment', function(req, res){
    var comment = req.body.comment;
    var name = req.body.name;
    var password = req.body.password;
    connection.query('INSERT INTO comment (name, password, comment) VALUES(?, ?, ?)', [name, password, comment], function(error, results, fields){
        if(error) throw error;
        res.redirect('/comment');
    });
});

app.get('/comment/delete/:id', function(req, res){
    connection.query('SELECT * FROM comment WHERE id=?', [req.params.id], function(error, results, fields){
        if(error) throw error;
        res.render('delete', {id: req.params.id, comment: results[0]});
    });
});

app.post('/comment/delete/:id', function(req, res){
    connection.query('SELECT * FROM comment WHERE id=?', [req.params.id], function(error, results, fields){
        if(req.body.password === results[0].password){
            connection.query('DELETE FROM comment WHERE id=?', [req.params.id], function(error, results, fields){
                if(error) throw error;
                res.redirect('/comment');
            });
        } else {
            res.send('password is incorrect');
        }
    });
});

app.get('/comment/modify/:id', function(req, res){
    connection.query('SELECT * FROM comment WHERE id=?', [req.params.id], function(error, results, fields){
        if(error) throw error;
        res.render('modify', {id: req.params.id, comment: results[0]});
    });
});

app.post('/comment/modify/:id', function(req, res){
    connection.query('
