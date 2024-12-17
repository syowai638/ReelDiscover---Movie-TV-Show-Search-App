const searchButton = document.getElementById('search-button');
const searchBar = document.getElementById('search-bar');
const movieResults = document.getElementById('movie-results');
const genreFilter = document.getElementById('genre-filter');
const typeFilter = document.getElementById('type-filter');  // **Filtering by movie type**
const sortFilter = document.getElementById('sort-filter');  // **Sorting by popularity or rating**
const randomMovieButton = document.getElementById('random-movie');
const movieDetailModal = document.getElementById('movie-detail-modal');
const movieDetailModalContent = document.createElement('div');
movieDetailModal.appendChild(movieDetailModalContent);

// Your API key
const apiKey = "05f1abcfd0b660f430f9ca05b193bed5";

// Event Listener for Search Button
searchButton.addEventListener('click', async () => {
    const query = searchBar.value; // Get search input
    const genre = genreFilter.value; // Get selected genre
    const type = typeFilter.value; // Get selected type (movie/TV)
    const sortBy = sortFilter.value; // Get selected sort option

    try {
        // **Modified API call to include type and sort filters**
        const response = await fetch(
            `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&query=${query}&with_genres=${genre}&with_type=${type}&sort_by=${sortBy}`
        );
        const data = await response.json();
        displayMovies(data.results); // Display fetched movies
    } catch (error) {
        console.error("Error fetching movies:", error);
    }
});

// Function to display fetched movies
function displayMovies(movies) {
    movieResults.innerHTML = '';
    if (movies.length === 0) {
        movieResults.innerHTML = `<p>No results found. Try another search!</p>`;
        return;
    }
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <p>${movie.release_date || 'Release date not available'}</p>
            <button class="favorite-btn" onclick="toggleFavorite(${movie.id})">Add to Favorites</button>  <!-- **Favorites button** -->
        `;
        movieCard.addEventListener('click', () => showMovieDetails(movie));
        movieResults.appendChild(movieCard);
    });
}

// Function to show detailed movie information in a modal
async function showMovieDetails(movie) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}`);
        const movieDetails = await response.json();
        movieDetailModalContent.innerHTML = `
            <h2>${movieDetails.title}</h2>
            <p>${movieDetails.overview || 'No description available.'}</p>
            <p>Runtime: ${movieDetails.runtime || 'N/A'} minutes</p>
            <button id="close-modal">Close</button>
        `;
        movieDetailModal.style.display = 'flex';

        // Close modal
        document.getElementById('close-modal').addEventListener('click', () => {
            movieDetailModal.style.display = 'none';
        });
    } catch (error) {
        console.error("Error fetching movie details:", error);
    }
}

// Event Listener for "Surprise Me" button
randomMovieButton.addEventListener('click', async () => {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`);
        const data = await response.json();
        const randomMovie = data.results[Math.floor(Math.random() * data.results.length)];
        displayRandomMovie(randomMovie);
    } catch (error) {
        console.error("Error fetching random movie:", error);
    }
});

// Function to display random movie details
function displayRandomMovie(movie) {
    const randomMovieDetails = document.getElementById('random-movie-details');
    randomMovieDetails.innerHTML = `
        <h2>${movie.title}</h2>
        <p>${movie.overview || 'No description available.'}</p>
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
    `;
}

// **Favorites Management Using LocalStorage**
function toggleFavorite(movieId) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const movieIndex = favorites.findIndex(movie => movie.id === movieId);

    // **Toggle favorite movie**
    if (movieIndex === -1) {
        favorites.push({ id: movieId });
        alert('Movie added to favorites');
    } else {
        favorites.splice(movieIndex, 1);
        alert('Movie removed from favorites');
    }

    // **Save favorites to LocalStorage**
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Highlight active link in navigation
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', (e) => {
        document.querySelectorAll('.nav-links a').forEach(el => el.classList.remove('active'));
        e.target.classList.add('active');
    });
});
