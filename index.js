import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./api/routes/auth.js";
import usersRoute from "./api/routes/users.js";
import hotelsRoute from "./api/routes/hotels.js";
import roomsRoute from "./api/routes/rooms.js";
import cookieParser from "cookie-parser";

const app = express();
dotenv.config();

const connect = async () => {
  try {
    mongoose.connect(process.env.MONGO);
    console.log("Connected to MONGODB");
  } catch (e) {
    throw e;
  }
};

/* EMPIEZA A BUSCAR LA CONEXION AUTOMATICAMENTE, ENCASO DE SER DESCONECTADO
A LA BASE DE DATOS */
mongoose.connection.on("disconnected", () => {
  console.log("mongoDB disconnected");
});

/* CREATING A COOKIE USED FOR SET UP A HOTEL 
ONLY ARE LOGGED AND IF isAdmin */
app.use(cookieParser());
//CREATING A MIDDLEWARE
app.use(express.json());
/* prevent a bug with Headers Policy */
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"),
    res.setHeader("Access-Control-Allow-Headers", "*"),
    next();
});

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/hotels", hotelsRoute);
app.use("/api/rooms", roomsRoute);

app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong";

  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

/* TERMINA DE BUSCAR CONEXION AUTOMATICAMENTE */

app.listen(8800, () => {
  connect();
  console.log("connected to backend");
});
