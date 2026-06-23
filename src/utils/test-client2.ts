import { io } from 'socket.io-client';

const socket = io("http://localhost:3000");

socket.on("connect", ()=>{
  console.log("connected", socket.id);
  socket.emit("register", "1a0f31f614e1111111caedf1");
})

socket.on('new_notification', (data)=>{
  console.log("data got in message:", data);
})

socket.on("disconnect", () => {
  console.log("Disconnected");
});