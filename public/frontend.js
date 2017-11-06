var socket = io.connect();

socket.on('connect', function(data){
  console.log("we connected to the server as" + socket.id)
})

socket.on('audioFilePath',function(fileinfo){ //when we see the audioFile Path message do something, and lookat any data attached to it coming from the server.
  console.log(fileinfo);
  $('.playback').attr('src','audio/'+fileinfo.currentFile) //load up the audio file into the HTML
  $('.playback').get(0).currentTime = fileinfo.serverTimeCount //change the current playhead to the time that is stored on the server
  $('.playback').get(0).play(); // play
  //.get(0) is to bypass the jQuery object and get to the direct HTML element whihc you need to to do to work directly with media tags, its super annoyign.
})




// var = audio
//
//
// $(audio).attribute(attr,value)





//_______________________class demo_____________________________
// var socket = io.connect();
//
// socket.on('connect', function(data){
//   console.log("we connected to the server as" + socket.id)
// })
//
//
// $('body').click(function(event) {
//
//   console.log(event.clientX, event.clientY)
//
//
//
//   var dataToSend = {
//     'top': event.clientY,
//     'left': event.clientX
//   }
//
//   socket.emit('addEmoji', dataToSend); // send the data up to the server
//
// });
//
// socket.on('massSendEmoji', function(data){
//
//   $('<div>😘</div>').css({
//     'position': 'absolute',
//     'top': data.top,
//     'left': data.left
//   }).appendTo('body')
//
// })
//
// socket.on('startingEmoji', function(data){
//   console.log(data)
//
//   data.forEach(function(dataPoint){
//     $('<div>👻</div>').css({
//       'position': 'absolute',
//       'top': dataPoint.top,
//       'left': dataPoint.left
//     }).appendTo('body')
//
//   })
//
//
//
// })
//
