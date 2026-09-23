import { connectDb } from "./config/db";
import app from "./app";
import dotenv from "dotenv";
import { seedSuperAdmin } from "./seed/seedSuperAdmin";
import http from "http";
import { Server } from "socket.io";
import { setIO, getUserSocketMap } from "./utils/socket";
import jwt from "jsonwebtoken";

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

    setIO(io);

    const userSocketMap = getUserSocketMap();

    io.on("connection", (socket) => {
      console.log("User connected:", socket.id);

      socket.on("register", (token: string) => {
        try {
          const payload = jwt.verify(token, process.env.JWT_SECRET as string);

          if (typeof payload === "string" || !payload.userId) {
            socket.disconnect(true);
            return;
          }

          const userId = String(payload.userId);
          userSocketMap.set(userId, socket.id);
          console.log(`Mapped ${userId} → ${socket.id}`);
        } catch {
          socket.disconnect(true);
        }
      });

      socket.on("disconnect", () => {
        for (const [userId, socketId] of userSocketMap.entries()) {
          if (socketId === socket.id) {
            userSocketMap.delete(userId);
            console.log(`Removed mapping for ${userId}`);
            break;
          }
        }
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
