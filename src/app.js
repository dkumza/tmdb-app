// async function displayTopRatedMovies() {
//    const result = await fetchAPIData("/movie/top_rated");
//    console.log(result);
// }

// // fetch data
// async function fetchAPIData(endpoint) {
//    const API_KEY = "1563fbe64685383509de99f4f1e8f7e5";
//    const API_URL = "https://api.themoviedb.org/3";

//    const response = await fetch(
//       `${API_URL}/${endpoint}?api_key=${API_KEY}?language=en-US`
//    );

//    const data = await response.json();

//    return data;
// }

// displayTopRatedMovies();

const options = {
   method: "GET",
   headers: {
      accept: "application/json",
      Authorization:
         "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNTYzZmJlNjQ2ODUzODM1MDlkZTk5ZjRmMWU4ZjdlNSIsInN1YiI6IjY1NGNhNGY2ZDQ2NTM3MDBmZTM0NTBkYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1LWXb6rU4E-WvOsJHOjPxr_XEJ6NEOIMUoBWsw86sCg",
   },
};

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
   showToDom.innerHTML = topMovies
      .slice(0, 5)
      .map(
         (val) => `
        <div class="m-c movies-2 flex justify-center items-center transition transform hover:scale-105">
            <img class="object-cover h-96" src="https://image.tmdb.org/t/p/w300${val.poster_path}" alt="">
        </div>`
      )
      .join("");
};
