

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const morgan = require('morgan');
const expressValidator = require('express-validator');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const elasticsearch = require("elasticsearch")
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs');
//var http = require('http').Server(app);
//var io = require('socket.io')(http);
dotenv.config();


//  Socket Connection

// const ClientManager = require('./chat/clientManager')
// const ChatroomManager = require('./chat/chatroomManager')
// const makeHandlers = require('./chat/handler')

// const clientManager = ClientManager()
// const chatroomManager = ChatroomManager()


// io.on('connection', () =>{
//     console.log('a user is connected')
//    })

// db
// mongodb://kaloraat:dhungel8@ds257054.mlab.com:57054/nodeapi
// MONGO_URI=mongodb://localhost/nodeapi
// mongodb+srv://kaloraat_admin:kkkkkk9@nodeapi-pbn7j.mongodb.net/nodeapi?retryWrites=truenodeAPI?retryWrites=true
// mongodb+srv://robertchou_admin:Aeiourc2491@nodeapi-p2o93.mongodb.net/nodeapi?retryWrites=true&w=majority
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true 
    })
    .then(() => console.log('DB Connected'));

mongoose.connection.on('error', err => {
    console.log(`DB connection error: ${err.message}`);
});

// bring in routes
const postRoutes = require('./routes/post');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const pushNotifi = require("./routes/pushNotification")
const friendRoutes = require('./routes/friend');
const chatRoutes = require('./routes/chat');
const videoRoutes = require('./routes/videoupload')
const Notification = require('./routes/notification')
const pageRoutes = require('./routes/page')
const profileVisitRoute = require('./routes/profilevisit')

//const notificationRoutes = require('./routes/pushNotification')
//const notifiRoutes = require('./routes/notification');
//const userAddClick = require('./routes/userAddClick');

// // apiDocs
app.get('/api', (req, res) => {
    fs.readFile('docs/apiDocs.json', (err, data) => {
        if (err) {
            res.status(400).json({
                error: err
            });
        }
        const docs = JSON.parse(data);
        res.json(docs);
    });
});

// middleware -
app.use(morgan('dev'));
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());
// midd
// app.use(function(request, response, next) {
//     response.header("Access-Control-Allow-Origin", "*");
//     response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
//   });

app.use('/api', postRoutes);
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', pushNotifi);
app.use('/api', friendRoutes);
app.use('/api', chatRoutes);
app.use('/api', videoRoutes);
app.use('/api', Notification);
app.use('/api', pageRoutes);
app.use('/api', profileVisitRoute);


// app.use(function (err, req, res, next) {
//     if (err.name === 'UnauthorizedError') {
//         res.status(401).json({ error: 'Unauthorized!' });
//     }
// });


const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`A Node Js API is listening on port: ${port}`);
})
//      console.log("before io.on")
//  const server = require('http').Server(app);
// //const io = require('socket.io')(server);
// const io = require('socket.io')(server, {
//     cors: {
//       origin: "http://localhost:3001",
//       credentials: true
//     }
//   })

// io.on('connection', function (client) {
//     console.log("after io.on")
//     const {
//       handleRegister,
//       handleJoin,
//       handleLeave,
//       handleMessage,
//       handleGetChatrooms,
//       handleGetAvailableUsers,
//       handleDisconnect
//     } = makeHandlers(client, clientManager, chatroomManager)
  
//     console.log('client connected...', client.id)
//     clientManager.addClient(client)
  
//     client.on('register', handleRegister)
  
//     client.on('join', handleJoin)
  
//     client.on('leave', handleLeave)
  
//     client.on('message', handleMessage)
  
//     client.on('chatrooms', handleGetChatrooms)
  
//     client.on('availableUsers', handleGetAvailableUsers)
  
//     client.on('disconnect', function () {
//       console.log('client disconnect...', client.id)
//       handleDisconnect()
//     })
  
//     client.on('error', function (err) {
//       console.log('received error from client:', client.id)
//       console.log(err)
//     })
  
//   })
//   io.on('error', function(error) {
//       console.log(error)
//   })

// });


// const http = require('http').Server(app);
// const io = require('socket.io')(server);

// const io = require('socket.io')(server, {
//     cors: {
//       origin: "http://localhost:3001",
//       credentials: true
//     }
//   })



