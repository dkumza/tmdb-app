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

// * fetch latest movies
const nowPlayingMovies = [];

const showLatest3Trailers = (arr, num) => {
   const trailersWrap = document.querySelector(".trailers-wrap");
   // * to suffle values
   // const shuffled = [...arr].sort(() => 0.5 - Math.random()).slice(0, num);

   const [...getId] = arr.map((val) => val.id).splice(0, num);
   getId.map((val) => {
      fetch(
         `https://api.themoviedb.org/3/movie/${val}/videos?language=en-US`,
         options
      )
         .then((response) => response.json())
         .then((response) => {
            // console.log(response.results);
            const result = response.results.find((val) => {
               return val.type === "Trailer";
            });
            // console.log(result.key);
            trailersWrap.innerHTML += `<div class="m-c movies-1">
                                          <iframe
                                          class="trailer-wrap"
                                          src="https://www.youtube.com/embed/${result.key}?si=wU4EgryzidVHRpfn&controls=0"
                                          title="YouTube video player"
                                          frameborder="0"
                                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                          allowfullscreen
                                          ></iframe>
                                    </div>`;
         })

         .catch((err) => console.error(err));
   });
};

fetch(
   "https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1",
   options
)
   .then((response) => response.json())
   .then((response) => {
      nowPlayingMovies.push(...response.results);
      showLatest3Trailers(nowPlayingMovies, 3);
   })
   .catch((err) => console.error(err));
