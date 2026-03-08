import type { env } from "node:process";
import { connectDb } from "./config/db";
import app from "./app";
import dotenv from "dotenv";

async function startServer() {
  try {
    dotenv.config();
    await connectDb();

    const PORT = Number(process.env.PORT) || 3000;

    app.listen(PORT, () => {
      console.log(`🚀 NotifyX backend running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
