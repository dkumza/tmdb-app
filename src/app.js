const options = {
   method: "GET",
   headers: {
      accept: "application/json",
      Authorization:
         "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNTYzZmJlNjQ2ODUzODM1MDlkZTk5ZjRmMWU4ZjdlNSIsInN1YiI6IjY1NGNhNGY2ZDQ2NTM3MDBmZTM0NTBkYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1LWXb6rU4E-WvOsJHOjPxr_XEJ6NEOIMUoBWsw86sCg",
   },
};

// * page router
const global = {
   currentPage: window.location.pathname,
};

// * fetch movie data from api
const fetchAPIData = async (endpoint) => {
   // * select movie category
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

// * fetch Upcoming movies - 20 by default
const displayUpcomingMovies = async () => {
   const { results } = await fetchAPIData("upcoming");
   // console.log(results);
   const slideShow = document.querySelector(".slideshow-container");
   slideShow.innerHTML = results
      // * show only 5 movies
      .slice(0, 5)
      .map(
         (movie) => `
         <div class="mySlides grow fade relative">
            <img class="" 
               src="https://image.tmdb.org/t/p/original/${
                  movie.backdrop_path
               }"                           
            />
            <div class="slide-title">
               <h1>${movie.original_title.toUpperCase()}</h1>
            </div>
         </div>`
      )
      .join("");

   // * slideshow
   let slideIndex = 0;
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
   // *start slide show
   showSlides();
};

// * fetch top rated movies
const topRatedMovies = async () => {
   const { results } = await fetchAPIData("top_rated");
   const showToDom = document.querySelector(".latest-cont");
   showToDom.innerHTML = results
      .slice(0, 5)
      .map(
         (val) => `        
            <div class="m-c flex flex-col">
               <img class="" src="https://image.tmdb.org/t/p/w300/${val.poster_path}" alt="">
            </div>`
      )
      .join("");
};

// * fetch latest movies
const nowPlayingMovies = async () => {
   const { results } = await fetchAPIData("now_playing");
   nowPlayingYoutubeVideos(results, 3);
};

// * from latest movies fetch takes 3 movies ID's and fetches Youtube videos
const nowPlayingYoutubeVideos = async (target, num) => {
   const trailersWrap = document.querySelector(".trailers-wrap");
   // * gets 3 ID's from nowPlayingMovies function
   const [...getId] = target.map((val) => val.id).splice(0, num);
   const [...getName] = target.map((val) => val.title).splice(0, num);
   // * print to DOM 3 videos and titles, by getting from nowPlaying function
   await Promise.all(
      getId.map(async (val, index) => {
         const title = getName[index];
         const result = await fetchAPIData(`${val}/videos`);
         const trailer = result.results.find((val) => val.type === "Trailer");

         trailersWrap.innerHTML += `<div class="m-c movies-1">
          <iframe
            class="trailer-wrap"
            src="https://www.youtube.com/embed/${trailer.key}?si=wU4EgryzidVHRpfn&controls=0"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen>
          </iframe>
          <h1> ${title}</h1>
        </div>`;
      })
   );
};

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

// * init app
const initApp = () => {
   switch (global.currentPage) {
      case "/":
      case "/index.html":
      case "/tmdb-app/":
         console.log("Index file");
         displayUpcomingMovies();
         topRatedMovies();
         nowPlayingMovies();
         break;
      case "/search.html":
         console.log("Search file");
         break;
   }
};

document.addEventListener("DOMContentLoaded", initApp);
