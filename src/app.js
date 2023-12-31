// * page router
const global = {
   currentPage: window.location.pathname,
};

// * fetch movie data from api
const fetchAPIData = async (endpoint) => {
   // * select movie category
   const API_URL = "https://api.themoviedb.org/3/";
   const options = {
      method: "GET",
      headers: {
         accept: "application/json",
         Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNTYzZmJlNjQ2ODUzODM1MDlkZTk5ZjRmMWU4ZjdlNSIsInN1YiI6IjY1NGNhNGY2ZDQ2NTM3MDBmZTM0NTBkYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1LWXb6rU4E-WvOsJHOjPxr_XEJ6NEOIMUoBWsw86sCg",
      },
   };

   // const endOfLink = "&page=1";
   const response = await fetch(
      `${API_URL}${endpoint}?language=en-US`,
      options
   );

   const data = await response.json();
   return data;
};

// *
const getMovieID = (items) => {
   items.forEach((item) => {
      item.addEventListener("click", (e) => {
         const selectedID = e.target.id;
         window.location.href = `more-info.html?targetID=${selectedID}`;
      });
   });
};

const showMoreInfoToDOM = async () => {
   const urlParams = new URLSearchParams(window.location.search);
   const selectedID = urlParams.get("targetID");
   // * fetch movie details
   const result = await fetchAPIData(`movie/${selectedID}`);
   const displayInfo = document.querySelector(".more-info-wrap");
   displayInfo.innerHTML = `
         <div class="bg-wrap"
         style="background-image: url(https://image.tmdb.org/t/p/w1280/${
            result.backdrop_path
         }); height: 600px">
            <div 
                  class="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-cover flex justify-center items-center p-12 gap-12"
                  style="background-color: rgba(116, 116, 116, 0.75)"> 

               <div class="info-left w-1/4">
                  <div class="info-img">
                  <img class=""  src="https://image.tmdb.org/t/p/w500/${
                     result.poster_path
                  }" alt="${result.title}" srcset=""
                       >
                  </div>
               </div>
               <div class="info-right w-3/4">
                  <div class="info-title flex flex-col w-3/4">
                     <div class="flex gap-4 align-bottom items-baseline ">                      
                     <h1 class="i-title text-4xl mb-4 font-bold">${
                        result.title
                     }</h1>
                     <h1 class="i-title text-5xl mb-4 ">(${result.release_date.slice(
                        0,
                        4
                     )})</h1>
                     </div>
                        <p class="i-para text-xl">${result.overview}</p>
                  </div>
               </div>        
            </div>
         </div>
   `;
};

// * fetch Upcoming movies - 20 by default
const displayUpcomingMovies = async () => {
   const { results } = await fetchAPIData(`movie/upcoming`);
   const slideShow = document.querySelector(".slideshow-container");
   slideShow.innerHTML = results
      // * show only 5 movies
      .slice(0, 5)
      .map(
         (movie) => `
         <div class="mySlides min-w-full">
            <img id="${movie.id}" class="select-me min-w-full" 
               src="https://image.tmdb.org/t/p/w1280/${
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

   // * add event on click of picture
   const selectedItem = document.querySelectorAll(".select-me");
   getMovieID(selectedItem);
};

// * fetch top rated movies
const topRatedMovies = async () => {
   const { results } = await fetchAPIData(`movie/top_rated`);
   const showToDom = document.querySelector(".latest-cont");
   showToDom.innerHTML = results
      .slice(0, 5)
      .map(
         (val) => `        
            <div class="m-c flex flex-col">
               <img id="${val.id}" class="select-me" src="https://image.tmdb.org/t/p/w300/${val.poster_path}" alt="">
            </div>`
      )
      .join("");

   // * add event on click of picture
   const selectedItem = document.querySelectorAll(".select-me");
   getMovieID(selectedItem);
};

// * fetch latest movies
const nowPlayingMovies = async () => {
   const { results } = await fetchAPIData(`movie/now_playing`);
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
         const result = await fetchAPIData(`movie/${val}/videos`);
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
const popularPeopleList = async () => {
   const { results } = await fetchAPIData(`person/popular`);
   const showPopularPeopleList = document.querySelector(".celeb-wrap");
   showPopularPeopleList.innerHTML = results
      .slice(0, 10)
      .map(
         (val) => `        
         <div class=" celeb-1 flex flex-col">
            <img class="" src="https://image.tmdb.org/t/p/w300/${val.profile_path}" alt="Photo of ${val.name}">
            <div>
               <h1 class="">${val.name}</h1>
            </div>
         </div>`
      )
      .join("");
};

// *search movies
const options = {
   method: "GET",
   headers: {
      accept: "application/json",
      Authorization:
         "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNTYzZmJlNjQ2ODUzODM1MDlkZTk5ZjRmMWU4ZjdlNSIsInN1YiI6IjY1NGNhNGY2ZDQ2NTM3MDBmZTM0NTBkYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1LWXb6rU4E-WvOsJHOjPxr_XEJ6NEOIMUoBWsw86sCg",
   },
};

// * search form eventlistener
const searchForm = document.querySelector(".form-wrap");
searchForm.addEventListener("submit", (e) => {
   e.preventDefault();
   const searchValue = document.querySelector(".search-value").value;
   if (searchValue === "") {
      alert(`Can't search for empty string`);
      return;
   }
   window.location.href = `search.html?value=${searchValue}`;
});

// * takes value from input field - fetches data and saves to global.search object
global.search = {};
getSearchResults = async () => {
   const urlParams = new URLSearchParams(window.location.search);
   const value = urlParams.get("value");

   const { results, total_results, page, total_pages } = await fetchAPIData(
      `search/movie?query=${value}&include_adult=false&page=1`
   );

   if (results.length === 0) {
      alert("no matches found");
      return;
   }

   global.search.term = value;
   global.search.page = page;
   global.search.totalPages = total_pages;
   global.search.totalResults = total_results;

   showSearchResultsAtDOM(results);
   paginationTool();

   // * add event on click of picture
   const selectedItem = document.querySelectorAll(".select-me");
   getMovieID(selectedItem);
};

const showSearchResultsAtDOM = (results) => {
   const displaySearchInfo = document.querySelector(".search-head");
   const displaySearchAt = document.querySelector(".search-res");
   displaySearchAt.innerHTML = results
      .map(
         (val) => `
         
               <div  class="search-item m-c flex flex-col">
               ${
                  val.poster_path
                     ? `<img id="${val.id}" class="select-me" src="https://image.tmdb.org/t/p/w300/${val.poster_path}"
                              alt=""></img>`
                     : `<img class="" src="../images/no-image.png"
                        alt=""></img>`
               }
               </div>
            `
      )
      .join("");

   // * show search info
   displaySearchInfo.innerHTML = `
                  <h2 class="my-4 font-semibold text-xl mt-8">${
                     results.length
                  } OF ${
      global.search.totalResults
   } RESULTS FOR ${global.search.term.toUpperCase()}</h2>`;

   paginationTool();
};

// * pagination function to display current page and results of that page
const paginationTool = () => {
   // * show pages
   const displayPages = document.querySelector(".pages-wrap");
   displayPages.innerHTML = `
                           <button class="btn-pages btn-prev px-6 py-1 hover:bg-slate-100">Prev</button>
                           <div class="page-counter px-4 py-1">${global.search.page} of ${global.search.totalPages}</div>
                           <button class="btn-pages btn-next px-6 py-1 hover:bg-slate-100">Next</button>
                     `;

   const prevPageBtn = document.querySelector(".btn-prev");
   const nextPageBtn = document.querySelector(".btn-next");

   // * on first page disable prev
   global.search.page === 1 ? (prevPageBtn.disabled = true) : null;

   // * on last page disable next
   global.search.page === global.search.totalPages
      ? (nextPageBtn.disabled = true)
      : null;

   nextPageBtn.addEventListener("click", async () => {
      global.search.page++;
      const { results } = await fetchAPIData(
         `search/movie?query=${global.search.term}&include_adult=false&page=${global.search.page}`
      );
      showSearchResultsAtDOM(results);
   });

   prevPageBtn.addEventListener("click", async () => {
      global.search.page--;
      const { results } = await fetchAPIData(
         `search/movie?query=${global.search.term}&include_adult=false&page=${global.search.page}`
      );
      showSearchResultsAtDOM(results);
   });
};

// * init app
const initApp = () => {
   switch (global.currentPage) {
      case "/":
      case "/index.html":
      case "/tmdb-app/":
      case "/tmdb-app/index.html":
         displayUpcomingMovies();
         topRatedMovies();
         nowPlayingMovies();
         popularPeopleList();
         break;
      case "/search.html":
      case "/tmdb-app/search.html":
      case "/tmdb-app/search.html":
         getSearchResults();
         break;

      case "/more-info.html":
      case "/tmdb-app/more-info.html":
      case "/tmdb-app/more-info.html":
         showMoreInfoToDOM();
         break;
   }
};

document.addEventListener("DOMContentLoaded", initApp);
