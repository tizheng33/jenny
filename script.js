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
    iconAnchor: [20, 40],
    className: 'rounded-leaflet-icon'
});

const iconHer = L.icon({
    iconUrl: 'jenny.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    className: 'rounded-leaflet-icon'
});

const markerMe = L.marker(currentSF, { icon: iconMe }).addTo(map).bindPopup("me");
const herMarker = L.marker(currentAnaheim, { icon: iconHer }).addTo(map).bindPopup("my love ❤️");
L.marker(berkeley, { icon: L.icon({ iconUrl: 'https://cdn-icons-png.flaticon.com/512/68/68798.png', iconSize: [30, 30], iconAnchor: [15, 30] }) }).addTo(map).bindPopup("rochdale");


// --- Text Bubble Logic for 'her' sprite ---

const herQuotes = [
  "Can't wait to see you!",
  "Missing you already!",
  "Counting down the days!",
  "Soon, my love, soon!",
  "Our adventure awaits!"
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
setInterval(rotateQuotes, 5000);


// --- Music Player Logic ---

const audio = new Audio();
const playlist = [
    { title: 'SoundHelix Song 1', artist: 'SoundHelix', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', albumArt: 'https://via.placeholder.com/50x50?text=SH1' },
    { title: 'SoundHelix Song 2', artist: 'SoundHelix', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', albumArt: 'https://via.placeholder.com/50x50?text=SH2' },
    { title: 'SoundHelix Song 3', artist: 'SoundHelix', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', albumArt: 'https://via.placeholder.com/50x50?text=SH3' },
    { title: 'SoundHelix Song 4', artist: 'SoundHelix', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', albumArt: 'https://via.placeholder.com/50x50?text=SH4' },
    { title: 'SoundHelix Song 5', artist: 'SoundHelix', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', albumArt: 'https://via.placeholder.com/50x50?text=SH5' }
];

let currentTrackPlayingIndex = 0;
let isPlaying = false; // Our flag for if the user WANTS it to be playing
let isShuffled = false;
let isRepeating = 'none'; // 'none', 'one', 'all'
let originalPlaylistOrder = [...playlist];

// Get elements
const playPauseBtn = document.getElementById('play-pause-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const shuffleBtn = document.getElementById('shuffle-btn');
const repeatBtn = document.getElementById('repeat-btn');
const currentSongTitle = document.getElementById('current-song-title');
const currentSongArtist = document.getElementById('current-song-artist');
const albumArt = document.getElementById('album-art');
const seekSlider = document.getElementById('seek-slider');
const currentTimeDisplay = document.getElementById('current-time');
const durationDisplay = document.getElementById('duration');
const volumeSlider = document.getElementById('volume-slider');
const volumeIcon = document.getElementById('volume-icon');

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
// These ensure UI and internal 'isPlaying' state are consistent with audio.play()/pause() results

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
            playPauseBtn.textContent = '⏸️';
            isPlaying = true; // Audio is now truly playing
            // console.log("Audio play successful.");
        }).catch(error => {
            playPauseBtn.textContent = '▶️';
            isPlaying = false; // Audio failed to play
            console.error("Audio play failed (Promise rejected):", error);
            // Inform user if necessary, e.g., "Autoplay blocked by browser."
        });
    } else { // Fallback for older browsers that don't return a Promise
        playPauseBtn.textContent = '⏸️';
        isPlaying = true;
        // console.warn("audio.play() did not return a Promise. Assuming success.");
    }
}

function pauseAudio() {
    audio.pause();
    playPauseBtn.textContent = '▶️';
    isPlaying = false; // Audio is now truly paused
    // console.log("Audio paused.");
}


// Load a track into the audio element
function loadTrack(index) {
    if (playlist.length === 0) {
        currentSongTitle.textContent = 'No songs in playlist';
        currentSongArtist.textContent = '';
        albumArt.src = 'https://via.placeholder.com/50x50?text=No+Art';
        playPauseBtn.textContent = '▶️';
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
        // If it was playing, try to play the new track immediately
        if (isPlaying && audio.paused) { // Check if it was playing and browser auto-paused new track
            playAudio();
        }
    };
    // If we loaded a track and it was supposed to be playing, re-assert play
    if (isPlaying) {
        playAudio();
    }
}

// Play/Pause toggle (UI button click)
function togglePlayPause() {
    if (isPlaying) { // If currently marked as playing
        pauseAudio();
    } else { // If currently marked as paused
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
        playAudio(); // Re-assert play for current track
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
        shuffleBtn.style.color = '#b3b3b3';
    } else {
        const shuffled = [...playlist];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        playlist.splice(0, playlist.length, ...shuffled);
        isShuffled = true;
        shuffleBtn.style.color = '#1DB954';
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
    if (isRepeating === 'none') {
        isRepeating = 'all';
        repeatBtn.textContent = '🔁';
        repeatBtn.style.color = '#1DB954';
    } else if (isRepeating === 'all') {
        isRepeating = 'one';
        repeatBtn.textContent = '🔂';
        repeatBtn.style.color = '#1DB954';
    } else {
        isRepeating = 'none';
        repeatBtn.textContent = '🔁';
        repeatBtn.style.color = '#b3b3b3';
    }
}

// Volume Mute/Unmute
let lastVolume = audio.volume;
function toggleMute() {
    if (audio.volume > 0) {
        lastVolume = audio.volume;
        audio.volume = 0;
        volumeSlider.value = 0;
        volumeIcon.textContent = '🔇';
    } else {
        audio.volume = lastVolume > 0 ? lastVolume : 0.7;
        volumeSlider.value = audio.volume;
        if (audio.volume < 0.01) {
          volumeIcon.textContent = '🔇';
        } else if (audio.volume < 0.5) {
          volumeIcon.textContent = '🔉';
        } else {
          volumeIcon.textContent = '🔊';
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
volumeIcon.addEventListener('click', toggleMute);

// This variable will store the time of the audio *before* seeking starts
let audioTimeBeforeDrag = 0;

audio.addEventListener('timeupdate', () => {
    // ONLY update slider value and display if user is NOT actively dragging it
    if (seekSlider.dataset.isDragging !== 'true') {
        seekSlider.value = audio.currentTime;
        currentTimeDisplay.textContent = formatTime(audio.currentTime);
        updateSeekSliderFill();
    }
});

// Listener for when the browser's audio element actually pauses
audio.addEventListener('pause', () => {
    // Only update UI if we didn't explicitly call pauseAudio()
    // This catches external pauses (e.g., another tab playing audio, or browser policy)
    // and also captures the pause that might happen *before* seeking to a new time
    if (isPlaying) { // If our flag says it *should* be playing
        playPauseBtn.textContent = '▶️'; // Visually show paused
        // Do NOT set isPlaying = false here, as we might be pausing *temporarily* for seeking
        // The isPlaying flag should only be set by togglePlayPause() or play/pauseAudio()
        console.warn("Audio paused by browser/system (isPlaying flag still true).");
    }
});
// Listener for when the browser's audio element actually plays
audio.addEventListener('play', () => {
    // This catches successful plays after browser blocks, or after seeking
    if (!isPlaying) { // If our flag says it's not playing, but browser says it is
        playPauseBtn.textContent = '⏸️'; // Visually show playing
        isPlaying = true; // Update internal state
        // console.log("Audio resumed playing (caught by 'play' event).");
    }
});


audio.addEventListener('ended', () => {
    // This logic handles when a track finishes naturally
    if (isRepeating === 'one') {
        audio.currentTime = 0;
        playAudio(); // Re-start current track
    } else if (isRepeating === 'all') {
        playNext(); // Go to next track (will loop if last)
    } else {
        // No repeat, stop playback if it's the last song
        if (currentTrackPlayingIndex === playlist.length - 1) {
            isPlaying = false; // Mark as not playing
            playPauseBtn.textContent = '▶️'; // Update UI
            seekSlider.value = 0; // Reset slider
            currentTimeDisplay.textContent = '0:00';
            loadTrack(0); // Prepare first song for next play
        } else {
            playNext(); // Otherwise, play next song
        }
    }
    updateSeekSliderFill();
});

// User starts dragging seek slider
seekSlider.addEventListener('mousedown', () => {
    seekSlider.dataset.isDragging = 'true';
    audioTimeBeforeDrag = audio.currentTime; // Store current time before drag
    // console.log("Drag started. Audio time before drag:", audioTimeBeforeDrag);
});

// Update slider visual & display time based on user's drag
// Audio's currentTime is NOT updated here
seekSlider.addEventListener('input', () => {
    currentTimeDisplay.textContent = formatTime(seekSlider.value); // Update time based on slider
    updateSeekSliderFill(); // Update fill based on slider
    // console.log(`Dragging: slider.value=${seekSlider.value.toFixed(2)}, displayed=${currentTimeDisplay.textContent}`);
});

// User releases seek slider (mouse up)
seekSlider.addEventListener('mouseup', () => {
    seekSlider.dataset.isDragging = 'false';
    audio.currentTime = seekSlider.value; // FINALLY set audio's time
    // console.log("Drag ended (mouseup). New audio.currentTime:", audio.currentTime.toFixed(2));

    // If it was playing (or intended to be), resume playback
    if (isPlaying) {
        playAudio();
    } else {
        // If it was paused, update UI to reflect the new time but keep it paused
        currentTimeDisplay.textContent = formatTime(audio.currentTime);
        updateSeekSliderFill();
    }
});

// Handle mouseleave in case user drags off the slider and releases mouse
seekSlider.addEventListener('mouseleave', () => {
  if (seekSlider.dataset.isDragging === 'true') { // If they were dragging and left
    seekSlider.dataset.isDragging = 'false';
    audio.currentTime = seekSlider.value; // Set audio's time to where they left it
    // console.log("Drag ended (mouseleave). New audio.currentTime:", audio.currentTime.toFixed(2));

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
    if (audio.volume === 0) {
        volumeIcon.textContent = '🔇';
    } else if (audio.volume < 0.5) {
        volumeIcon.textContent = '🔉';
    } else {
        volumeIcon.textContent = '🔊';
    }
    updateVolumeSliderFill();
    // console.log(`Volume: slider.value=${volumeSlider.value.toFixed(2)}, audio.volume=${audio.volume.toFixed(2)}`);
});

// Initial load of the first track
if (playlist.length > 0) {
    loadTrack(currentTrackPlayingIndex);
    audio.volume = volumeSlider.value;
    updateVolumeSliderFill();
    // Do NOT call playAudio() here on initial load, as browsers block autoplay without user interaction.
    // The user will need to click the play button first.
}