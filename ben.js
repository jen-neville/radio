var express = require('express'); //make express available
var app = express(); //invoke express
var server = require('http').Server( app ) // start the express server instance
var io = require('socket.io')(server) // use socket.io for real time connections aka. wesockets
const fs = require('fs');
var mm = require('musicmetadata');



//serve out any static files in our public HTML folder
app.use(express.static('public'))

var currentFile;
var currentDuration;
var serverTimeCount = 0;


//use an interval loop to count down the duration then do the block below! and emit!

$(function(){
$('div').on('mousedown',function(){
  $(this).css('background-color','blue')
}).on('mouseup', function(){
  $(this).css('background-color','grey')
})


function getNewAudio(){
  fs.readdir('public/audio',function(err,files){ //look into the audio dir
      currentFile = files[ Math.floor(Math.random()* files.length) ] // get a random file from the directory
      var readableStream = fs.createReadStream('public/audio/'+currentFile); //open up the file so we can check the duration
      var parser = mm(readableStream, { duration: true }, function (err, metadata) { //check the duration
        if (err) throw err;
        console.log(metadata);
        currentDuration = metadata.duration //assgn duration to a variable for later
        console.log(currentFile);
        console.log(currentDuration);
        readableStream.close(); //close the opened file to prevent memory leaks.

        var data = { //pack up some data to send to all of the clients
          "currentFile": currentFile,
          "currentDuration": currentDuration,
          "serverTimeCount": serverTimeCount
        }

        io.emit('audioFilePath', data ) //send the data to all connected clinets with the 'audioFilePath' message

      // }

      });
  })
}

getNewAudio(); //invoke the function once when we boot the server to get things started.

setInterval(function(){ //make a timer which counts up every second
  serverTimeCount  = serverTimeCount + 1 //add a second to our time storage
  console.log("serverTimeCount: ",serverTimeCount);
  console.log("currentDuration: ",currentDuration);

  if(serverTimeCount >= currentDuration){ //if out time storage is = or greater than the current files dureation, we are at the end!
    serverTimeCount = 0; //reset the time counter
    getNewAudio(); //get a new audio file and store its duration and things
  }
},1000)


//do something when someone connects to our page.
io.on('connection', function(socket){
  console.log(socket.id); // log out the unique ID of each person who connects


    var data = { //pack up some data to send
      "currentFile": currentFile,
      "serverTimeCount": serverTimeCount //this is important here since it is always changing on the server, meaning it will start a newly connected person in the same place as all the others
    }

    io.emit('audioFilePath', data ) //send the data (when someone first connects)



})

//makes the app listen for requests on port 3000
server.listen(3000, function(){
  console.log("app listening on port 3000!")
})
