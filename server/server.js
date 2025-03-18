const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors({
  origin: "http://localhost:5173", // Change to your React frontend URL
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true
}));

// Serve HLS video files statically
app.use("/data", express.static(path.join(__dirname, "data")));

app.get("/", (req, res) => {
    res.send("HLS Server Running. Access HLS stream at /data/master.m3u8");
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
