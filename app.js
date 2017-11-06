//_______________________below: from Ben Moren__________________

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









//_______________________trash________________________
// var express = require('express'); //make express available
// var app = express(); //invoke express
// var server = require('http').Server( app ) // start the express server instance
// var io = require('socket.io')(server) // use socket.io for real time connections aka. wesockets
// app.use(express.static('public'))
//
// server.listen(3000, function(){
//   console.log("app listening on port 3000!")
// })
//_______________________new new______________________
// var audio;
// var playlist;
// var tracks;
// var current;
//
// init();
// function init(){
//     current = 0;
//     audio = $('audio');
//     playlist = $('#playlist');
//     tracks = playlist.find('li a');
//     len = tracks.length - 1;
//
//     playlist.find('a').click(function(e){
//         e.preventDefault();
//         link = $(this);
//         current = link.parent().index();
//         run(link, audio[0]);
//     });
//     audio[0].addEventListener('ended',function(e){
//
//     if(current == len){
//         current = 0;
//         link = playlist.find('a')[0];
//     }else{
//         link = playlist.find('a')[current];
//         current++; // <-- Increment after the check
//     }
//     run($(link),audio[0]);
//   });
// }
// function run(link, player){
//         player.src = link.attr('src');
//         par = link.parent();
//         par.addClass('active').siblings().removeClass('active');
//         audio[0].load();
//         audio[0].play();
// }






//_______________________attempt at streaming lol______________________
// server.on('request', function(req,res) {
//   var audioFile = fs.readFileSync('hiJen/20170930 162736-1.m4a')
//
//   var audioPlay = new PlayThis(audioFile);
//   res.writeHead(200,{'Content-Type':'text/audioPlay'}); //not sure about this line......write head? and text type???? need audio file type???
//   res.end(audioPlay);
// });


//_______________________random array playback_________________________
// function playbackStuff(){
//   var soundFiles = ["20170930 162736-1.m4a", "20170930 162743-1.m4a", "20170930 162802-1.m4a", "20170930 162845-1.m4a"];
//   var selectFile = Math.floor(Math.random() * soundFiles.length);
//   soundFiles.src = soundFiles[selectFile];
//   document.getElementById("sound").innerHTML=("<audio soundFiles.src autoplay='autoplay'></audio>");
// }
//_______________________array increment attempt_____________________
// var audio = new Audio(),
//     i = 0;
// var playlist = new Array('hiJen/test_01.m4a', 'hiJen/test_02.m4a', 'hiJen/test_03.m4a');
//
// audio.addEventListener('ended', function () {
//     i = ++i < playlist.length ? i : 0;
//     console.log(i)
//     audio.src = playlist[i];
//     audio.play();
// }, true);
// audio.loop = false;
// audio.src = playlist[0];
// audio.play();
//_______________________array setInverval attempt_____________________
// var index=-1;
// function playNext() {
//     index++;
//     var music = listMusic[i];
//     if (music) {
//         playSound("'" + music + "'");
//         setInterval('playNext', musicDuration[index] * 1000);
//     }
// }




























// var express = require('express'); //make express available
// var app = express(); //invoke express
// var server = require('http').Server( app ) // start the express server instance
// var io = require('socket.io')(server) // use socket.io for real time connections aka. wesockets
//
// //serve out any static files in our public HTML folder
// app.use(express.static('public'))
//
//
// var emojiHistory = [] //store some data, this will go away when the server crashes or reboots.
//
// //do something when someone connects to our page.
// io.on('connection', function(socket){
//   console.log(socket.id); // log out the unique ID of each person who connects
//
// // this section is a bit of an information 'relay' it takes the incoming data, replicates it and sends it out to everyone who is connected.
// //look for an incoming addEmoji message from the client
//   socket.on('addEmoji', function(data){
//     emojiHistory.push(data) //add the data to our storage array.
//     io.emit('massSendEmoji', data) //send the massSendEmoji message out to all of the connected clients.
//   })
//
//   io.emit('startingEmoji', emojiHistory) // send the entire emoji History down to the clients when they connect!
//
// })
//
// //makes the app listen for requests on port 3000
// server.listen(3000, function(){
//   console.log("app listening on port 3000!")
// })
