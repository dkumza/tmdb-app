const options = {
   method: "GET",
   headers: {
      accept: "application/json",
      Authorization:
         "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNTYzZmJlNjQ2ODUzODM1MDlkZTk5ZjRmMWU4ZjdlNSIsInN1YiI6IjY1NGNhNGY2ZDQ2NTM3MDBmZTM0NTBkYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1LWXb6rU4E-WvOsJHOjPxr_XEJ6NEOIMUoBWsw86sCg",
   },
};

// * fetch top rated movies
const topMovies = [];
fetch(
   "https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1",
   options
)
   .then((response) => response.json())
   .then((response) => {
      // console.log(response.results);
      topMovies.push(...response.results);
      showTop5(topMovies);
   })
   .catch((err) => console.error(err));

const showTop5 = (topMovies) => {
   const showToDom = document.querySelector(".latest-cont");
   // console.log(topMovies);
   showToDom.innerHTML = topMovies
      .slice(0, 5)
      .map(
         (val) => `        
            <div class="m-c flex flex-col">
               <img class="" src="https://image.tmdb.org/t/p/w300/${val.poster_path}" alt="">
               <div>
              
               </div>
            </div>`
      )
      .join("");

   // <h1 class="font-semibold pt-2 pl-1">${val.title}</h1>
   // <h1 class=" text-sm pt-2 pl-1">${val.release_date}</h1>
};

// * fetch latest movies
const nowPlayingMovies = [];

const showLatest3Trailers = (arr, num) => {
   const trailersWrap = document.querySelector(".trailers-wrap");
   // * to shuffle values
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
      // showLatest3Trailers(nowPlayingMovies, 3);
   })
   .catch((err) => console.error(err));

// * fetch top rated people
const popP = [];
fetch(
   "https://api.themoviedb.org/3/person/popular?language=en-US&page=1",
   options
)
   .then((response) => response.json())
   .then((response) => {
      console.log(response.results);
      popP.push(...response.results);
      showPop(popP);
   })
   .catch((err) => console.error(err));

const showPop = (target) => {
   const showP = document.querySelector(".celeb-wrap");
   //    console.log(topMovies);
   showP.innerHTML = target
      .slice(0, 10)
      .map(
         (val) => `        
            <div class="m-c celeb-1 flex flex-col">
               <img class="" src="https://image.tmdb.org/t/p/w300/${val.profile_path}" alt="Photo of ${val.name}">
               <div>
                  <h1 class="font-semibold">${val.name}</h1>
               </div>
            </div>`
      )
      .join("");
};
