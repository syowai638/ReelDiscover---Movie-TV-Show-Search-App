const searchButton = document.getElementById('search-button');
const searchBar = document.getElementById('search-bar');
const movieResults = document.getElementById('movie-results');
const genreFilter = document.getElementById('genre-filter');
const typeFilter = document.getElementById('type-filter');
const sortFilter = document.getElementById('sort-filter');
const randomMovieButton = document.getElementById('random-movie');
const movieDetailModal = document.getElementById('movie-detail-modal');
const movieDetailModalContent = document.createElement('div');
movieDetailModal.appendChild(movieDetailModalContent);

// Your API key
const apiKey = "05f1abcfd0b660f430f9ca05b193bed5";

// Keep track of the current content type (movie or tv)
let contentType = 'movie'; // Default to movie

// Event Listener for Search Button
searchButton.addEventListener('click', async () => {
    const query = searchBar.value; // Get search input
    const genre = genreFilter.value; // Get selected genre
    const type = typeFilter.value || contentType; // Get type from filter or use the current type

    try {
        // Fetch content based on query, genre, type, and sorting
        const response = await fetch(
            `https://api.themoviedb.org/3/search/${type}?query=${query}&with_genres=${genre}&api_key=${apiKey}&sort_by=${sortFilter.value}`
        );
        const data = await response.json();
        displayMovies(data.results); // Display fetched movies/TV shows
    } catch (error) {
        console.error("Error fetching movies:", error);
    }
});

// Function to display fetched movies/TV shows
function displayMovies(results) {
    movieResults.innerHTML = '';
    if (results.length === 0) {
        movieResults.innerHTML = `<p>No results found. Try another search!</p>`;
        return;
    }

    results.forEach(result => {
        const card = document.createElement('div');
        card.classList.add('movie-card');
        card.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${result.poster_path}" alt="${result.title || result.name}">
            <h3>${result.title || result.name}</h3>
            <p>${result.release_date || result.first_air_date || 'Release date not available'}</p>
        `;
        card.addEventListener('click', () => showMovieDetails(result));
        movieResults.appendChild(card);
    });
}

// Function to show detailed movie/TV show information in a modal
async function showMovieDetails(result) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/${contentType}/${result.id}?api_key=${apiKey}`);
        const details = await response.json();
        movieDetailModalContent.innerHTML = `
            <h2>${details.title || details.name}</h2>
            <p>${details.overview || 'No description available.'}</p>
            <p>Runtime: ${details.runtime || 'N/A'} minutes</p>
            <button id="close-modal">Close</button>
        `;
        movieDetailModal.style.display = 'flex';

        // Close modal
        document.getElementById('close-modal').addEventListener('click', () => {
            movieDetailModal.style.display = 'none';
        });
    } catch (error) {
        console.error("Error fetching details:", error);
    }
}

// Event Listener for "Surprise Me" button
randomMovieButton.addEventListener('click', async () => {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/${contentType}/popular?api_key=${apiKey}`);
        const data = await response.json();
        const randomItem = data.results[Math.floor(Math.random() * data.results.length)];
        displayRandomMovie(randomItem);
    } catch (error) {
        console.error("Error fetching random content:", error);
    }
});

// Function to display random movie/TV show details
function displayRandomMovie(item) {
    const randomMovieDetails = document.getElementById('random-movie-details');
    randomMovieDetails.innerHTML = `
        <h2>${item.title || item.name}</h2>
        <p>${item.overview || 'No description available.'}</p>
        <img src="https://image.tmdb.org/t/p/w500${item.poster_path}" alt="${item.title || item.name}">
    `;
}

// Switch between Movies and TV Shows when respective navigation links are clicked
document.getElementById('movies-link').addEventListener('click', () => {
    contentType = 'movie'; // Set content type to movie
    fetchMoviesOrShows();
});

document.getElementById('tv-shows-link').addEventListener('click', () => {
    contentType = 'tv'; // Set content type to TV
    fetchMoviesOrShows();
});

// Fetch movies or TV shows based on content type
async function fetchMoviesOrShows() {
    const query = searchBar.value || '';
    const genre = genreFilter.value || '';
    const type = contentType;

    try {
        const response = await fetch(
            `https://api.themoviedb.org/3/search/${type}?query=${query}&with_genres=${genre}&api_key=${apiKey}&sort_by=${sortFilter.value}`
        );
        const data = await response.json();
        displayMovies(data.results);
    } catch (error) {
        console.error("Error fetching content:", error);
    }
}