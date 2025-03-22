import {BrowserRouter, Route, Routes} from 'react-router-dom';
import VideoGalleryView from './VideoGalleryView';
import VideoView from './VideoView';

const Root = function() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<VideoGalleryView />}></Route>
          <Route path="/video/*" element={<VideoView />}></Route>

        </Routes>
      </BrowserRouter>
    </>
  )
}
export default Root;