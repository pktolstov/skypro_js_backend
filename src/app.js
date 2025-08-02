const express = require("express");
const dotenv = require("dotenv");
const userRouter = require("./routes/users");
const bookRouter = require("./routes/books")
const loggerOne = require("./middlewares/loggerOne");
const loggerTwo = require("./middlewares/loggerTwo");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
dotenv.config();

const { PORT, API_URL, MONGO_URL } = process.env;

// MongoDB Connection
mongoose.connection.on("connected", () => console.log("MongoDB: connected"));
mongoose.connection.on("disconnected", () =>
  console.log("MongoDB: disconnected")
);
mongoose.connection.on("error", (err) => console.error("MongoDB error:", err));

mongoose
  .connect(MONGO_URL)
  .then(console.log("MongoDB Connected"))
  .catch((error) => console.log(error));

// (async () => {
//     try {
//       await mongoose.connect(MONGO_URL);
//       console.log("MongoDB connected");
//     } catch (err) {
//       console.error("MongoDB connection error:", err);
//     }
//   })();

mongoose.connection.on("error", (err) => {
  console.log(err);
});
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(loggerOne);
// app.use(loggerTwo);

app.use(userRouter);
app.use(bookRouter)

app.listen(PORT, () => {
  console.log(`Сервер запущен на ${API_URL}:${PORT}`);
});
