const options = {
   method: "GET",
   headers: {
      accept: "application/json",
      Authorization:
         "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNTYzZmJlNjQ2ODUzODM1MDlkZTk5ZjRmMWU4ZjdlNSIsInN1YiI6IjY1NGNhNGY2ZDQ2NTM3MDBmZTM0NTBkYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1LWXb6rU4E-WvOsJHOjPxr_XEJ6NEOIMUoBWsw86sCg",
   },
};

// * fetch top rated movies
fetch(
   "https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1",
   options
)
   .then((response) => response.json())
   .then((response) => {
      topMovies.push(...response.results);
      showTop5(topMovies);
   })
   .catch((err) => console.error(err));

const topMovies = [];

const showTop5 = (topMovies) => {
   const showToDom = document.querySelector(".latest-cont");
   //    console.log(topMovies);
   showToDom.innerHTML = topMovies
      .slice(0, 5)
      .map(
         (val) => `
        <div class="m-c transition transform hover:scale-105 duration-500 h-fit">
            <img class="object-contain w-40 min-w-full" src="https://image.tmdb.org/t/p/original${val.poster_path}" alt="">
        </div>`
      )
      .join("");
};

const showLatest3Trailers = (arr, num) => {
   const trailersWrap = document.querySelector(".trailers-wrap");

   const shuffled = [...arr].sort(() => 0.5 - Math.random());

   return shuffled.slice(0, num);
   //    console.log(trailersWrap);
};

const nowPlayingMovies = [];
// * fetch latest movies
fetch(
   "https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1",
   options
)
   .then((response) => response.json())
   .then((response) => {
      nowPlayingMovies.push(...response.results);
      console.log(nowPlayingMovies);
      showLatest3Trailers(nowPlayingMovies);
      // showTop5(topMovies);
   })
   .catch((err) => console.error(err));
