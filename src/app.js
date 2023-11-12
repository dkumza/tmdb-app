const options = {
   method: "GET",
   headers: {
      accept: "application/json",
      Authorization:
         "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNTYzZmJlNjQ2ODUzODM1MDlkZTk5ZjRmMWU4ZjdlNSIsInN1YiI6IjY1NGNhNGY2ZDQ2NTM3MDBmZTM0NTBkYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1LWXb6rU4E-WvOsJHOjPxr_XEJ6NEOIMUoBWsw86sCg",
   },
};

// * fetch movie data from api
const fetchAPIData = async (endpoint) => {
   const API_URL = "https://api.themoviedb.org/3/movie/";
   const options = {
      method: "GET",
      headers: {
         accept: "application/json",
         Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNTYzZmJlNjQ2ODUzODM1MDlkZTk5ZjRmMWU4ZjdlNSIsInN1YiI6IjY1NGNhNGY2ZDQ2NTM3MDBmZTM0NTBkYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1LWXb6rU4E-WvOsJHOjPxr_XEJ6NEOIMUoBWsw86sCg",
      },
   };

   const response = await fetch(
      `${API_URL}${endpoint}?language=en-US&page=1`,
      options
   );

   const data = await response.json();
   return data;
};
const displayUpcomingMovies = async () => {
   const { results } = await fetchAPIData("upcoming");
   console.log(results);
};

displayUpcomingMovies();

// * fetch Upcoming movies
const upcomingM = [];
fetch(
   "https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1",
   options
)
   .then((response) => response.json())
   .then((response) => {
      // console.log(response.results);
      upcomingM.push(...response.results);
      showUpcomingM(upcomingM);
   })
   .catch((err) => console.error(err));

const showUpcomingM = (target) => {
   const slideShow = document.querySelector(".slideshow-container");
   slideShow.innerHTML = target
      .slice(0, 10)
      .map(
         (val) => `        
                        <div class="mySlides fade grow relative flex ">
                           <img class=""
                              src="https://image.tmdb.org/t/p/original/${
                                 val.backdrop_path
                              }"                           
                           />
                           <div class="slide-title">
                           <h1>${val.original_title.toUpperCase()}</h1>
                           </div>
                        </div>`
      )
      .join("");

   // * slideshow
   let slideIndex = 0;
   showSlides();

   function showSlides() {
      const slides = Array.from(document.getElementsByClassName("mySlides"));
      const dots = Array.from(document.getElementsByClassName("dot"));

      slides.forEach((slide) => (slide.style.display = "none"));
      dots.map((dot) => (dot.className = dot.className.replace(" active", "")));

      slideIndex = slideIndex >= slides.length ? 0 : slideIndex;

      slides[slideIndex].style.display = "block";
      dots[slideIndex].className += " active";

      slideIndex++;
      setTimeout(showSlides, 3000);
   }
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
   // * getName should be same length as getId array
   const [...getName] = arr.map((val) => val.title).splice(0, num);
   getId.map((val, index) => {
      // * takes title by index of getId array from getName array
      const title = getName[index];
      fetch(
         `https://api.themoviedb.org/3/movie/${val}/videos?language=en-US`,
         options
      )
         .then((response) => response.json())
         .then((response) => {
            const result = response.results.find((val) => {
               return val.type === "Trailer";
            });

            // console.log(title);
            trailersWrap.innerHTML += `<div class="m-c movies-1">
                                          <iframe
                                          class="trailer-wrap"
                                          src="https://www.youtube.com/embed/${result.key}?si=wU4EgryzidVHRpfn&controls=0"
                                          title="YouTube video player"
                                          frameborder="0"
                                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                          allowfullscreen>
                                          </iframe>
                                          <h1> ${title}</h1>
                                    </div>`;
         })

         .catch((err) => console.error(err));
   });

   // const videoTitle = document.querySelector(".movies-1");
};

fetch(
   "https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=1",
   options
)
   .then((response) => response.json())
   .then((response) => {
      nowPlayingMovies.push(...response.results);
      // console.log(nowPlayingMovies);
      showLatest3Trailers(nowPlayingMovies, 3);
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
      // console.log(response.results);
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
                  <h1 class="">${val.name}</h1>
               </div>
            </div>`
      )
      .join("");
};
