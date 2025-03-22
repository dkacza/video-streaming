import { createContext } from "react";

const MovieContext = createContext(null);
export function MovieProvider(props) {
  const movieContextValues = {
    movieList: [
      {
        title: 'Test',
        durationSec: 12,
      }
    ]
  };
  return <MovieContext.Provider value={movieContextValues}>{props.children}</MovieContext.Provider>
}
export default MovieContext;