import type { env } from "node:process";
import { connectDb } from "./config/db";
import app from "./app";
import dotenv from "dotenv";
import { seedSuperAdmin } from "./seed/seedSuperAdmin";
import http from "http";
import { Server } from "socket.io";
import express from "express";

const userSocketMap = new Map<string, string>();

async function startServer() {
  try {
    dotenv.config();
    await connectDb();

    await seedSuperAdmin();

    const PORT = Number(process.env.PORT) || 3000;
    const server = http.createServer(app);

    const io = new Server(server, {
      cors: {
        origin: "*",
      },
    });

    io.on("connection", (socket) => {
      console.log("User connected:", socket.id);

      socket.on("register", (userId:string)=>{
        userSocket
      })
      socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
      });
    });

    server.listen(PORT, () => {
      console.log(`NotifyX backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server: ", error);
    process.exit(1);
  }
}

startServer();
