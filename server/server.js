const express = require("express");
const path = require("path");
const cors = require("cors");
const fs = require("fs");

const libraryPath = path.join(__dirname, "data", "library.json");

function getMovieList() {
  if (!fs.existsSync(libraryPath)) {
    console.log("No library found. The movie list is empty.");
    return [];
  }

  const fileContent = fs.readFileSync(libraryPath, "utf-8");

  if (!fileContent.trim()) {
    console.log("Library file is empty.");
    return [];
  }

  try {
    const movies = JSON.parse(fileContent);
    return movies;
  } catch (error) {
    console.error("Error parsing library.json:", error);
    return [];
  }
}

const movieList = getMovieList();
console.log("Movie List:", movieList);

const app = express();
app.use(cors({
  origin: "http://localhost:5173", // Change to your React frontend URL
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true
}));

// Serve HLS video files statically
app.use("/data", express.static(path.join(__dirname, "data")));

app.get("/", (req, res) => {
    res.send(movieList);
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
