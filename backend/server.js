const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./Routes/userRoutes');
const chatRoutes = require('./Routes/chatRoutes');
const messageRoutes = require('./Routes/messageRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const path = require('path');


const PORT = process.env.PORT || 5000;
const app = express();
dotenv.config()
connectDB();

app.use(cors({ origin: 'http://localhost:3000' }));

app.use(express.json()); //to accept json data


app.use('/api/user',userRoutes);
app.use('/api/chat',chatRoutes );
app.use('/api/message',messageRoutes);


// ...........................Deployment....................................
const __dirname1 = path.resolve();
if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname1, '/frontend/build')))
    app.get('*',(req, res)=>{
        res.sendFile(path.resolve(__dirname1,"frontend","build","index.html"));
    })

}else{
    app.get("/",(req, res)=>{
        res.send("Api is running");
    })
}

// ...........................Deployment....................................



app.use(notFound);
app.use(errorHandler);

const server = app.listen(PORT,()=>{
    console.log(`Server started on port ${PORT}`)
})

const io = require('socket.io')(server,{
    pingTimeOut: 60000,
    cors: {
        origin:'http://localhost:3000',
        // origin: "https://bc01-117-210-145-79.ngrok-free.app",
    }
});

io.on('connection', (socket)=>{
    console.log("connected to socket.io");

    socket.on('setup', (userData)=>{
        // creating a room
        socket.join(userData._id);

        console.log(userData._id);
        socket.emit('connected');
    })


    // for joining room
    socket.on("join chat", (room)=>{
        socket.join(room);
        console.log("user joinded room: ", room)
    });

    // for typing indicator
    socket.on('typing', (room)=>socket.in(room).emit("typing"))
    socket.on('stop typing', (room)=>socket.in(room).emit("stop typing"))

    // for receiving new message
    socket.on("new message", (newMessageReceived)=>{
        var chat = newMessageReceived.chat;
        if(!chat.users) return console.log("chat.users is not defined")

        chat.users.forEach(user=>{
            if(user._id == newMessageReceived.sender._id){
                return;
            }
            socket.in(user._id).emit("message recieved",newMessageReceived);
        })
    })

    socket.off("setup", ()=>{
        console.log("User disconnected");
        socket.leave(userData._id)
    })
})