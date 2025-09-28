const express = require("express");
const db = require("./config/db");
const cors = require("cors");
const bodyParser = require("body-parser");

const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();
app.use(cors({
    origin: "http://localhost:5173", // Adjust this to your frontend URL
    credentials: true, // Allow credentials to be sent
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", authRoutes);
app.use("/api", jobRoutes);
app.use("/api", applicationRoutes);
app.use("/api", interviewRoutes);
app.use("/api", notificationRoutes);

db.connect((err) => {
    if (err) throw err;
    console.log("MySQL Connected!");
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
