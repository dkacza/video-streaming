# Video Streaming Application Demo

This application is a demonstration of video streaming using HLS format. The quality of the video is dynamicaly adjusted to the network throughput.

### Prerequisites
Node.js, FFMPEG (optional)

### Using the application
#### 1. Add videos to be streamed

  Run the `node addVideo.js -i <PATH_TO_VIDEO> -t <VIDEO_TITLE>` within `sever` directory.
  
  *This will only work with FFMPEG installed. Otherwise extract the sample data directory to the server folder*

  [Sample data Download link](https://drive.google.com/file/d/1D98SIlXo0J3fl7xIWxmipP3DDOoWtQl3/view?usp=sharing)

#### 2. Start server
  
  Use `node server.js` executed within `server` directory.

#### 3. Start the client
  
  Execute `npm run dev` in the `client` directory.

After performing this steps application will be available under http://localhost:5173.

