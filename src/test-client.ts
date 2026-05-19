import {io} from 'socket.io-client';

const socket = io(http.localhost:3000);


const connectSocket = (socket)=>{
  socket.send("connect", socket.id )
}