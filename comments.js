//Create web server
var http = require('http');
var url = require('url');
var fs = require('fs');
var mysql = require('mysql');

//Create connection to MySQL
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "comments"
});

//Connect to MySQL
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to MySQL!");
});

//Create server
http.createServer(function (req, res) {
  //Parse the URL
  var q = url.parse(req.url, true);
  //Get the filename
  var filename = "." + q.pathname;
  //Read the file
  fs.readFile(filename, function(err, data) {
    //If there is an error
    if (err) {
      //Return an error code
      res.writeHead(404, {'Content-Type': 'text/html'});
      return res.end("404 Not Found");
    }
    //Return the content of the file
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
  });
  //If the request is a POST request
  if (req.method == 'POST') {
    //Parse the body of the request
    var body = '';
    req.on('data', function(data) {
        body += data;
    });
    //When the request has finished
    req.on('end', function() {
      //Parse the body of the request
      var post = JSON.parse(body);
      //If the request is to add a comment
      if (post.type == 'add') {
        //Create a new comment
        var comment = {name: post.name, comment: post.comment};
        //Insert the comment into the database
        con.query("INSERT INTO comments SET ?", comment, function (err, result) {
          if (err) throw err;
          console.log("Comment added");
        });
      }
      //If the request is to update a comment
      else if (post.type == 'update') {
        //Update the comment in the database
        con.query("UPDATE comments SET comment='" + post.comment + "' WHERE name='" + post.name + "'", function (err, result) {
          if (err) throw err;
          console.log("Comment updated");
        });
      }
    });
  }
}).listen(8080
