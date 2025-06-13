// Coordinates
const berkeley = [37.8656, -122.2600];
const sf = [37.7379, -122.3982];
const anaheim = [33.8239, -117.9186];

// Countdown logic
const startDate = new Date("2025-05-25T00:00:00-07:00");
const endDate = new Date("2025-08-23T00:00:00-07:00");
const today = new Date();
today.setHours(0, 0, 0, 0);

const msPerDay = 1000 * 60 * 60 * 24;

const totalDaysForProgress = Math.round((endDate.getTime() - startDate.getTime()) / msPerDay);
const daysElapsedForProgress = Math.floor((today.getTime() - startDate.getTime()) / msPerDay);
const progress = Math.min(daysElapsedForProgress / totalDaysForProgress, 1);

const dayAfterToday = new Date(today);
dayAfterToday.setDate(today.getDate() + 1);
dayAfterToday.setHours(0, 0, 0, 0);

const daysLeftForDisplay = Math.max(0, Math.round((endDate.getTime() - dayAfterToday.getTime()) / msPerDay) + 1);

document.getElementById('days-left').textContent = daysLeftForDisplay;

const daysElapsedValueElement = document.getElementById('days-elapsed-value');
if (daysElapsedValueElement) {
  daysElapsedValueElement.textContent = daysElapsedForProgress;
}

function lerp(start, end, t) {
    return start + (end - start) * t;
}

const currentSF = [
    lerp(sf[0], berkeley[0], progress),
    lerp(sf[1], berkeley[1], progress)
];
const currentAnaheim = [
    lerp(anaheim[0], berkeley[0], progress),
    lerp(anaheim[1], berkeley[1], progress)
];

const sfLatLng = L.latLng(currentSF[0], currentSF[1]);
const anaheimLatLng = L.latLng(currentAnaheim[0], currentAnaheim[1]);
const distanceMeters = sfLatLng.distanceTo(anaheimLatLng);
const distanceMiles = (distanceMeters * 0.000621371).toFixed(2);

document.getElementById('distance-value').textContent = `${distanceMiles} miles`;

const sfToBerkeleyDistMeters = L.latLng(sf[0], sf[1]).distanceTo(L.latLng(berkeley[0], berkeley[1]));
const anaheimToBerkeleyDistMeters = L.latLng(anaheim[0], anaheim[1]).distanceTo(L.latLng(berkeley[0], berkeley[1]));

const sfMilesTraveled = (sfToBerkeleyDistMeters * progress * 0.000621371).toFixed(2);
const anaheimMilesTraveled = (anaheimToBerkeleyDistMeters * progress * 0.000621371).toFixed(2);

const totalMilesElapsed = (parseFloat(sfMilesTraveled) + parseFloat(anaheimMilesTraveled)).toFixed(2);

const milesElapsedValueElement = document.getElementById('miles-elapsed-value');
if (milesElapsedValueElement) {
  milesElapsedValueElement.textContent = `${totalMilesElapsed} miles`;
}

const map = L.map('map', { zoomControl: false }).setView([36.5, -120], 6);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 13,
}).addTo(map);

const iconMe = L.icon({
    iconUrl: 'tim.png',
    iconSize: [40, 40],
    iconAnchor: [20, 35], // Adjusted to be a little lower
    className: 'rounded-leaflet-icon'
});

const iconHer = L.icon({
    iconUrl: 'jenny.png',
    iconSize: [40, 40],
    iconAnchor: [20, 35], // Adjusted to be a little lower
    className: 'rounded-leaflet-icon'
});

const iconUs = L.icon({
    iconUrl: 'icons/us.png',
    iconSize: [50, 50],
    iconAnchor: [20, 35], // Adjusted to be a little lower
    className: 'rounded-leaflet-icon'
});

const markerMe = L.marker(currentSF, { icon: iconMe }).addTo(map);
const herMarker = L.marker(currentAnaheim, { icon: iconHer }).addTo(map);
const markerUs = L.marker(berkeley, { icon: iconUs }).addTo(map);

// --- Text Bubble Logic for 'her' sprite ---

const herQuotes = [
  "moby dick the author?",
  "carbonated not sparkly",
  "nuh uhhhh",
  "hey",
  "well yes",
  "the chinese guy named confectious?",
  "many have said",
  "you swane bolt",
  "its like bureaucrats",
  "theyre like cherries but not cherries",
  "put me on an epilator"
];
let currentQuoteIndex = 0;

const quoteBubble = document.createElement('div');
quoteBubble.id = 'her-quote-bubble';
quoteBubble.textContent = herQuotes[currentQuoteIndex];
document.body.appendChild(quoteBubble);

function updateQuoteBubblePosition() {
  if (herMarker && map && quoteBubble) {
    const herLatLng = herMarker.getLatLng();
    const pixelPoint = map.latLngToContainerPoint(herLatLng);

    quoteBubble.style.left = `${pixelPoint.x}px`;
    quoteBubble.style.top = `${pixelPoint.y}px`;
  }
}

function rotateQuotes() {
  quoteBubble.style.opacity = 0;
  setTimeout(() => {
    currentQuoteIndex = (currentQuoteIndex + 1) % herQuotes.length;
    quoteBubble.textContent = herQuotes[currentQuoteIndex];
    quoteBubble.style.opacity = 1;
  }, 1000);
}

updateQuoteBubblePosition();
quoteBubble.style.opacity = 1;
map.on('move', updateQuoteBubblePosition);
map.on('load', updateQuoteBubblePosition);
setInterval(rotateQuotes, 6000);


// --- Music Player Logic ---

const audio = new Audio();
const playlist = [
    { title: 'Fancy', artist: 'Drake, T.I., Swiss Beatz, ft. Tim', src: 'music/fancy.mp3', albumArt: 'icons/jenny1.png' },
    { title: 'Nights', artist: 'Frank Ocean, ft. Tim', src: 'music/nights.mp3', albumArt: 'icons/jenny2.png' },
    { title: 'DtMF', artist: 'Bad Bunny, ft. Tim', src: 'music/dtmf.mp3', albumArt: 'icons/jenny3.png' }
];

let currentTrackPlayingIndex = 0;
let isPlaying = false; // Our flag for if the user WANTS it to be playing
let isShuffled = false;
let isRepeating = 'none'; // 'none', 'one', 'all'
let originalPlaylistOrder = [...playlist];

// Get elements (select the <i> tag within the button for icon manipulation)
const playPauseBtn = document.getElementById('play-pause-btn');
const playPauseIcon = playPauseBtn.querySelector('i'); // Get the <i> tag
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const shuffleBtn = document.getElementById('shuffle-btn');
const shuffleIcon = shuffleBtn.querySelector('i'); // Get the <i> tag
const repeatBtn = document.getElementById('repeat-btn');
const repeatIcon = repeatBtn.querySelector('i'); // Get the <i> tag
const currentSongTitle = document.getElementById('current-song-title');
const currentSongArtist = document.getElementById('current-song-artist');
const albumArt = document.getElementById('album-art');
const seekSlider = document.getElementById('seek-slider');
const currentTimeDisplay = document.getElementById('current-time');
const durationDisplay = document.getElementById('duration');
const volumeSlider = document.getElementById('volume-slider');
const volumeIconBtn = document.getElementById('volume-icon'); // Renamed to avoid conflict with `volumeIcon` variable
const volumeIcon = volumeIconBtn.querySelector('i'); // Get the <i> tag

// Helper function to format time
function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
}

// Function to update the seek slider's visual fill
function updateSeekSliderFill() {
    const value = (seekSlider.value - seekSlider.min) / (seekSlider.max - seekSlider.min) * 100;
    seekSlider.style.background = `linear-gradient(to right, white 0%, white ${value}%, #555 ${value}%, #555 100%)`;
}

// Function to update the volume slider's visual fill
function updateVolumeSliderFill() {
    const value = (volumeSlider.value - volumeSlider.min) / (volumeSlider.max - volumeSlider.min) * 100;
    volumeSlider.style.background = `linear-gradient(to right, white 0%, white ${value}%, #555 ${value}%, #555 100%)`;
}


// --- Core Playback Control Functions ---
function playAudio() {
    if (playlist.length === 0) {
        console.warn("Attempted to play with empty playlist.");
        return;
    }
    if (!audio.src) { // If no source is loaded (e.g., first play)
        loadTrack(currentTrackPlayingIndex);
    }

    const playPromise = audio.play();
    if (playPromise !== undefined) {
        playPromise.then(() => {
            playPauseIcon.classList.remove('fa-play'); // Remove play icon
            playPauseIcon.classList.add('fa-pause');  // Add pause icon
            isPlaying = true;
            // console.log("Audio play successful.");
        }).catch(error => {
            playPauseIcon.classList.remove('fa-pause'); // Remove pause icon
            playPauseIcon.classList.add('fa-play');   // Add play icon
            isPlaying = false;
            console.error("Audio play failed (Promise rejected):", error);
        });
    } else { // Fallback for older browsers that don't return a Promise
        playPauseIcon.classList.remove('fa-play');
        playPauseIcon.classList.add('fa-pause');
        isPlaying = true;
        // console.warn("audio.play() did not return a Promise. Assuming success.");
    }
}

function pauseAudio() {
    audio.pause();
    playPauseIcon.classList.remove('fa-pause');
    playPauseIcon.classList.add('fa-play');
    isPlaying = false;
    // console.log("Audio paused.");
}


// Load a track into the audio element
function loadTrack(index) {
    if (playlist.length === 0) {
        currentSongTitle.textContent = 'No songs in playlist';
        currentSongArtist.textContent = '';
        albumArt.src = 'https://via.placeholder.com/50x50?text=No+Art';
        playPauseIcon.classList.remove('fa-pause');
        playPauseIcon.classList.add('fa-play');
        isPlaying = false;
        audio.src = '';
        seekSlider.value = 0;
        currentTimeDisplay.textContent = '0:00';
        durationDisplay.textContent = '0:00';
        updateSeekSliderFill();
        updateVolumeSliderFill();
        return;
    }

    currentTrackPlayingIndex = index;
    const track = playlist[currentTrackPlayingIndex];
    audio.src = track.src;
    currentSongTitle.textContent = track.title;
    currentSongArtist.textContent = track.artist;
    albumArt.src = track.albumArt || 'https://via.placeholder.com/50x50?text=No+Art';

    seekSlider.value = 0;
    currentTimeDisplay.textContent = '0:00';
    durationDisplay.textContent = '0:00';
    updateSeekSliderFill();
    updateVolumeSliderFill();

    // When metadata is loaded, update duration and enable controls
    audio.onloadedmetadata = () => {
        durationDisplay.textContent = formatTime(audio.duration);
        seekSlider.max = audio.duration;
        updateSeekSliderFill();
        if (isPlaying && audio.paused) {
            playAudio();
        }
    };
    if (isPlaying) {
        playAudio();
    }
}

// Play/Pause toggle (UI button click)
function togglePlayPause() {
    if (isPlaying) {
        pauseAudio();
    } else {
        playAudio();
    }
}

// Play next song
function playNext() {
    if (playlist.length === 0) return;

    if (isRepeating === 'one') {
        audio.currentTime = 0;
        playAudio();
        return;
    }
    currentTrackPlayingIndex = (currentTrackPlayingIndex + 1) % playlist.length;
    loadTrack(currentTrackPlayingIndex);
}

// Play previous song
function playPrev() {
    if (playlist.length === 0) return;

    if (audio.currentTime > 3 || currentTrackPlayingIndex === 0) {
        audio.currentTime = 0;
        playAudio();
    } else {
        currentTrackPlayingIndex = (currentTrackPlayingIndex - 1 + playlist.length) % playlist.length;
        loadTrack(currentTrackPlayingIndex);
    }
}

// Shuffle playlist
function shufflePlaylist() {
    if (isShuffled) {
        playlist.splice(0, playlist.length, ...originalPlaylistOrder);
        isShuffled = false;
        shuffleIcon.classList.remove('active'); // Remove active class
    } else {
        const shuffled = [...playlist];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        playlist.splice(0, playlist.length, ...shuffled);
        isShuffled = true;
        shuffleIcon.classList.add('active'); // Add active class
    }

    if (playlist.length > 0) {
        const currentSongSrc = audio.src;
        const newIndex = playlist.findIndex(track => currentSongSrc && currentSongSrc.includes(track.src));

        if (newIndex !== -1) {
            currentTrackPlayingIndex = newIndex;
            loadTrack(currentTrackPlayingIndex);
            if (isPlaying) playAudio();
        } else {
            loadTrack(0);
            if (isPlaying) playAudio();
        }
    }
}

// Repeat functionality
function toggleRepeat() {
    repeatIcon.classList.remove('active-all', 'active-one'); // Clear previous states

    if (isRepeating === 'none') {
        isRepeating = 'all';
        repeatIcon.classList.add('active-all'); // Add active-all class
    } else if (isRepeating === 'all') {
        isRepeating = 'one';
        repeatIcon.classList.add('active-one'); // Add active-one class
    } else {
        isRepeating = 'none';
    }

    // Update Font Awesome icon for repeat modes
    repeatIcon.classList.remove('fa-redo', 'fa-redo-alt'); // Remove existing repeat icons

    if (isRepeating === 'one') {
        repeatIcon.classList.add('fa-redo-alt'); // Use fa-redo-alt for repeat one (looks like a 1/arrow)
    } else { // 'all' or 'none'
        repeatIcon.classList.add('fa-redo'); // Use fa-redo for repeat all/none
    }
}

// Volume Mute/Unmute
let lastVolume = audio.volume;
function toggleMute() {
    if (audio.volume > 0) {
        lastVolume = audio.volume;
        audio.volume = 0;
        volumeSlider.value = 0;
        volumeIcon.classList.remove('fa-volume-up', 'fa-volume-down'); // Clear existing
        volumeIcon.classList.add('fa-volume-mute'); // Add mute icon
    } else {
        audio.volume = lastVolume > 0 ? lastVolume : 0.7;
        volumeSlider.value = audio.volume;
        // Update volume icon based on restored volume
        volumeIcon.classList.remove('fa-volume-mute', 'fa-volume-down'); // Clear existing
        if (audio.volume < 0.01) { // Still very low, show mute
            volumeIcon.classList.add('fa-volume-mute');
        } else if (audio.volume < 0.5) {
            volumeIcon.classList.add('fa-volume-down');
        } else {
            volumeIcon.classList.add('fa-volume-up');
        }
    }
    updateVolumeSliderFill();
}


// Event Listeners for Music Player
playPauseBtn.addEventListener('click', togglePlayPause);
prevBtn.addEventListener('click', playPrev);
nextBtn.addEventListener('click', playNext);
shuffleBtn.addEventListener('click', shufflePlaylist);
repeatBtn.addEventListener('click', toggleRepeat);
volumeIconBtn.addEventListener('click', toggleMute); // Use volumeIconBtn as it's the actual button

let audioTimeBeforeDrag = 0;

audio.addEventListener('timeupdate', () => {
    if (seekSlider.dataset.isDragging !== 'true') {
        seekSlider.value = audio.currentTime;
        currentTimeDisplay.textContent = formatTime(audio.currentTime);
        updateSeekSliderFill();
    }
});

audio.addEventListener('pause', () => {
    if (isPlaying) {
        playPauseIcon.classList.remove('fa-pause');
        playPauseIcon.classList.add('fa-play');
        // Do NOT set isPlaying = false here, as we might be pausing *temporarily* for seeking
        console.warn("Audio paused by browser/system (isPlaying flag still true).");
    }
});
audio.addEventListener('play', () => {
    if (!isPlaying) {
        playPauseIcon.classList.remove('fa-play');
        playPauseIcon.classList.add('fa-pause');
        isPlaying = true;
    }
});


audio.addEventListener('ended', () => {
    if (isRepeating === 'one') {
        audio.currentTime = 0;
        playAudio();
    } else if (isRepeating === 'all') {
        playNext();
    } else {
        if (currentTrackPlayingIndex === playlist.length - 1) {
            isPlaying = false;
            playPauseIcon.classList.remove('fa-pause');
            playPauseIcon.classList.add('fa-play');
            seekSlider.value = 0;
            currentTimeDisplay.textContent = '0:00';
            loadTrack(0);
        } else {
            playNext();
        }
    }
    updateSeekSliderFill();
});

seekSlider.addEventListener('mousedown', () => {
    seekSlider.dataset.isDragging = 'true';
    audioTimeBeforeDrag = audio.currentTime;
});

seekSlider.addEventListener('input', () => {
    currentTimeDisplay.textContent = formatTime(seekSlider.value);
    updateSeekSliderFill();
});

seekSlider.addEventListener('mouseup', () => {
    seekSlider.dataset.isDragging = 'false';
    audio.currentTime = seekSlider.value;
    if (isPlaying) {
        playAudio();
    } else {
        currentTimeDisplay.textContent = formatTime(audio.currentTime);
        updateSeekSliderFill();
    }
});

seekSlider.addEventListener('mouseleave', () => {
  if (seekSlider.dataset.isDragging === 'true') {
    seekSlider.dataset.isDragging = 'false';
    audio.currentTime = seekSlider.value;
    if (isPlaying) {
        playAudio();
    } else {
        currentTimeDisplay.textContent = formatTime(audio.currentTime);
        updateSeekSliderFill();
    }
  }
});


// Update audio volume when volume slider is moved
volumeSlider.addEventListener('input', () => {
    audio.volume = volumeSlider.value;
    // Update volume icon based on current volume
    volumeIcon.classList.remove('fa-volume-mute', 'fa-volume-down', 'fa-volume-up'); // Clear existing
    if (audio.volume === 0) {
        volumeIcon.classList.add('fa-volume-mute');
    } else if (audio.volume < 0.5) {
        volumeIcon.classList.add('fa-volume-down');
    } else {
        volumeIcon.classList.add('fa-volume-up');
    }
    updateVolumeSliderFill();
});

// Initial load of the first track
if (playlist.length > 0) {
    loadTrack(currentTrackPlayingIndex);
    audio.volume = volumeSlider.value;
    updateVolumeSliderFill();
    // Set initial icon states
    playPauseIcon.classList.add('fa-play'); // Initial play icon
    shuffleIcon.classList.remove('active'); // Ensure shuffle is off by default
    repeatIcon.classList.remove('active-all', 'active-one'); // Ensure repeat is off by default
    repeatIcon.classList.add('fa-redo'); // Initial repeat icon (all/none)
    // Set initial volume icon based on actual volume slider value
    if (audio.volume === 0) {
        volumeIcon.classList.add('fa-volume-mute');
    } else if (audio.volume < 0.5) {
        volumeIcon.classList.add('fa-volume-down');
    } else {
        volumeIcon.classList.add('fa-volume-up');
    }
}