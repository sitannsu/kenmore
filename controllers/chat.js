const { result } = require('lodash');
const ChatMessage = require('../models/chat')
//var io = require('../app')


exports.message = async (req, res) => {
    console.log("body", req.body)
    var chatMessage = await new ChatMessage(req.body);
    
    chatMessage.save().then(()=>{
        res.status(200).json({message:"chat added successfully"})
    },
        (err) =>{
            if(err){
                console.log("err", err)
                res.status(500).json({error:err})
            }
        }, 
  );
}
// module.exports.respond = function(socket_io){
//     // this function expects a socket_io connection as argument

//     // now we can do whatever we want:
//     socket_io.on('news',function(newsreel){

//         // as is proper, protocol logic like
//         // this belongs in a controller:

//         socket.broadcast.emit(newsreel);
//     });
// }
exports.allMessage = async (req, res) => {
  await  ChatMessage.find({},(err, messages)=> {
        res.send(messages);
      })
}; 

