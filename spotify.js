const clientId = 'YOUR_CLIENT_ID';
const redirectUri = 'http://localhost/callback';
let accessToken = '';

document.getElementById('login-btn').addEventListener('click', () => {
    const scopes = 'user-read-private user-read-email playlist-read-private';
    const authUrl = `https://accounts.spotify.com/authorize?response_type=token&client_id=${clientId}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(redirectUri)}`;
    window.location.href = authUrl;
});

function getAccessTokenFromUrl() {
    const params = new URLSearchParams(window.location.hash.replace('#', '?'));
    return params.get('access_token');
}

function fetchPlaylists() {
    fetch('https://api.spotify.com/v1/me/playlists', {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then(response => response.json())
    .then(data => {
        displayPlaylists(data.items);
    })
    .catch(error => console.error('Error fetching playlists:', error));
}

function displayPlaylists(playlists) {
    const playlistContainer = document.getElementById('playlists');
    playlists.forEach(playlist => {
        const playlistElement = document.createElement('div');
        playlistElement.textContent = playlist.name;
        playlistElement.addEventListener('click', () => fetchPlaylistTracks(playlist.id));
        playlistContainer.appendChild(playlistElement);
    });
}

function fetchPlaylistTracks(playlistId) {
    fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then(response => response.json())
    .then(data => {
        playTrack(data.items[0].track.preview_url);
    })
    .catch(error => console.error('Error fetching tracks:', error));
}

function playTrack(url) {
    const audio = document.getElementById('audio');
    audio.src = url;
    audio.play();
}

// Periksa apakah token akses ada di URL
if (window.location.hash) {
    accessToken = getAccessTokenFromUrl();
    window.history.replaceState({}, document.title, "/"); // Hapus token dari URL
    fetchPlaylists();
}
