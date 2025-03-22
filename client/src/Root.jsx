import {BrowserRouter, Route, Routes} from 'react-router-dom';
import MovieGalleryView from './MovieGalleryView';
import VideoView from './VideoView';

const Root = function() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MovieGalleryView />}></Route>
          <Route path="/video" element={<VideoView />}></Route>

        </Routes>
      </BrowserRouter>
    </>
  )
}
export default Root;