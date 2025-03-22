// Sample execution
// node addVideo.js -i test-video.mp4 -t "Big Buck Bunny"


const { spawn } = require('child_process');
const fs  = require('fs');
const path = require("path");

// PARAMETERS VALIDATION
const args = process.argv.slice(2);
let inputVideo = "";
let title = "";

for (let i = 0; i < args.length; i++) {
    if (args[i] === "-i" && args[i + 1]) {
        inputVideo = args[i + 1];
    } else if (args[i] === "-t" && args[i + 1]) {
        title = args[i + 1];
    }
}
if (!inputVideo || !title) {
    console.error("Usage: node addVideo.js -i <input_video> -t <title>");
    process.exit(1);
}



function runBashScript(scriptPath, args = []) {
  return new Promise((resolve, reject) => {
    const process = spawn(scriptPath, args, { stdio: "inherit" });

    process.on("error", (error) => {
      reject(`Error: ${error.message}`);
    });

    process.on("close", (code) => {
      if (code === 0) {
        resolve("Script executed successfully");
      } else {
        reject(`Script exited with code ${code}`);
      }
    });
  });
}

function sanitizeMovieName(movieName) {
  return movieName
      .trim()                         // Remove leading & trailing spaces
      .replace(/\s+/g, "_")           // Replace spaces with underscores
      .replace(/[^a-zA-Z0-9_]/g, ""); // Remove special characters
}

function getVideoDuration(m3u8Path) {
  const fileContent = fs.readFileSync(m3u8Path, "utf-8");
  const lines = fileContent.split("\n");

  let totalDuration = 0;

  for (let line of lines) {
      if (line.startsWith("#EXTINF")) {
          const duration = parseFloat(line.split(":")[1]);
          totalDuration += duration;
      }
  }
  return totalDuration.toFixed(2);
}

function saveMovieData(movieData) {
  const libraryPath = path.join(__dirname, "data", "library.json");
  let library = [];
  if (fs.existsSync(libraryPath)) {
    const fileContent = fs.readFileSync(libraryPath, "utf-8");
    if (fileContent.trim()) {
      library = JSON.parse(fileContent);
    }
  }
  library.push(movieData);
  fs.writeFileSync(libraryPath, JSON.stringify(library, null, 2), "utf-8");
  console.log("Movie data saved successfully!");
}


const scriptPath = './convert.sh';
const converterArgs = ['-i', inputVideo, '-o', `data/${sanitizeMovieName(title)}`]

runBashScript(scriptPath, converterArgs)
  .then((output) => {
    console.log(output);

    // Read Video length
    const durationSec = getVideoDuration(`data/${sanitizeMovieName(title)}/stream_0/playlist.m3u8`)

    // Save entry to the library.json
    const movieData = {
      title,
      durationSec,
      hlsMasterPath: `data/${sanitizeMovieName(title)}/master.m3u8`
    }
    saveMovieData(movieData);

  })
  .catch((error) => {
    console.error("Error running Bash script:", error);
  });