import axios from "axios";

const API_KEY = '81e21b87c0628a89b900ad9a6fe6df24';
const API_BASE = 'https://api.themoviedb.org/3';

const inputSearchMovie = document.getElementById('search-movie') as HTMLInputElement;
const buttonSearchMovie = document.getElementById('button-search') as HTMLButtonElement;
const movieContainer = document.querySelector('.movies') as HTMLDivElement;
const centerTitle = document.getElementById('center-home-button') as HTMLButtonElement;
const searchName = document.getElementById('movies-researched') as HTMLHeadingElement;

centerTitle.addEventListener('click', function(){
  axios.get(`https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}&language=pt-BR&page=1&vote_count.gte=100`).then((response) => {
    let popularMovies = response.data.results;
    displayMovies(popularMovies, true);
  });
})

axios.get(`https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}&language=pt-BR&page=1&vote_count.gte=100`).then((response) => {
  let popularMovies = response.data.results;
  displayMovies(popularMovies, false);
});

async function searchMoviesByName(query: string) {
  const response = await axios.get(`${API_BASE}/search/movie`, {
    params: {
      api_key: API_KEY,
      query: query,
      language: 'pt-BR'
    },
  });
  return response.data.results;
}

function displayMovies(data: any[], clearPrevious: boolean = false, query?: string) {
  if (clearPrevious) {
    movieContainer.innerHTML = '';
    searchName.textContent = 'Populares';
  }
  let movieElement: any;
  if (query) {
    searchName.textContent = `${data.length} resultados para "${query}"`;
  } else {
    searchName.textContent = 'Populares';
  }
  data.forEach((movie: any) => {
    movieElement = document.createElement('div');
    movieElement.classList.add('movie-container');
    movieElement.innerHTML = `
      <div class="movie">
        <div class="movie-info">
          <span class="movie-info-title">${movie.title}</span>
          <span class="movie-info-year">${movie.release_date.substring(0, 4)}</span>
        </div>
        <img class="movie-image" src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
      </div>
    `;
    movieContainer.appendChild(movieElement)
  })
}

buttonSearchMovie.addEventListener("click", async () => {
  const query = inputSearchMovie.value;
  if (query) {
    const movies = await searchMoviesByName(query);
    displayMovies(movies, true, query);
  } else {
    axios.get(`https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}&language=pt-BR&page=1&vote_count.gte=100`).then((response) => {
      let popularMovies = response.data.results;
      displayMovies(popularMovies, true);
    });
  }
});
