const searchButton = document.getElementById('search-button');
const searchBar = document.getElementById('search-bar');
const movieResults = document.getElementById('movie-results');
const genreFilter = document.getElementById('genre-filter');
const randomMovieButton = document.getElementById('random-movie');
const movieDetailModal = document.getElementById('movie-detail-modal');
const movieDetailModalContent = document.createElement('div');
movieDetailModal.appendChild(movieDetailModalContent);

// Your API key
const apiKey = "05f1abcfd0b660f430f9ca05b193bed5";

searchButton.addEventListener('click', async () => {
    const query = searchBar.value;
    const genre = genreFilter.value;
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${query}&with_genres=${genre}&api_key=${apiKey}`);
    const data = await response.json();
    displayMovies(data.results);
});

function displayMovies(movies) {
    movieResults.innerHTML = '';
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <p>${movie.release_date}</p>
        `;
        movieCard.addEventListener('click', () => showMovieDetails(movie));
        movieResults.appendChild(movieCard);
    });
}

async function showMovieDetails(movie) {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}`);
    const movieDetails = await response.json();
    movieDetailModalContent.innerHTML = `
        <h2>${movieDetails.title}</h2>
        <p>${movieDetails.overview}</p>
        <p>Runtime: ${movieDetails.runtime} minutes</p>
        <button id="close-modal">Close</button>
    `;
    movieDetailModal.style.display = 'flex';

    document.getElementById('close-modal').addEventListener('click', () => {
        movieDetailModal.style.display = 'none';
    });
}

randomMovieButton.addEventListener('click', async () => {
    const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`);
    const data = await response.json();
    const randomMovie = data.results[Math.floor(Math.random() * data.results.length)];
    displayRandomMovie(randomMovie);
});

function displayRandomMovie(movie) {
    const randomMovieDetails = document.getElementById('random-movie-details');
    randomMovieDetails.innerHTML = `
        <h2>${movie.title}</h2>
        <p>${movie.overview}</p>
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
    `;
}


/* Navigation Link Active State */
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        document.querySelectorAll('.nav-links a').forEach(el => el.classList.remove('active'));
        e.target.classList.add('active');
    });
});