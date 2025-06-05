// --- Countdown Logic ---
const countdownDate = new Date("August 23, 2025 00:00:00").getTime();

const updateCountdown = () => {
    const now = new Date().getTime();
    const distance = countdownDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById("days").innerText = String(days).padStart(2, '0');
    document.getElementById("hours").innerText = String(hours).padStart(2, '0');
    document.getElementById("minutes").innerText = String(minutes).padStart(2, '0');
    document.getElementById("seconds").innerText = String(seconds).padStart(2, '0');

    // Simple animation for numbers when they change (optional)
    document.querySelectorAll('.time-unit span:first-child').forEach(span => {
        if (span.innerText !== span._oldValue && span._oldValue !== undefined) {
            span.parentElement.classList.add('pulse');
            setTimeout(() => {
                span.parentElement.classList.remove('pulse');
            }, 500);
        }
        span._oldValue = span.innerText;
    });


    if (distance < 0) {
        clearInterval(countdownInterval);
        document.getElementById("countdown").innerHTML = "<p>It's August 23rd! You're together!</p>";
        // Also stop map animation or set sprites to Berkeley
        updateMapSprites(0); // Set progress to 100%
    } else {
        // Update map sprites based on progress
        const totalDuration = countdownDate - new Date("June 4, 2025 17:39:00").getTime(); // Starting from current date
        const elapsed = now - new Date("June 4, 2025 17:39:00").getTime();
        const progress = elapsed / totalDuration; // 0 to 1
        updateMapSprites(progress);
    }
}

const countdownInterval = setInterval(updateCountdown, 1000);
updateCountdown(); // Initial call to display immediately

// --- Map Logic (Leaflet.js) ---
const map = L.map('map').setView([36.5, -119.5], 6); // Centered roughly between locations, adjust zoom

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Define coordinates
const anaheim = [33.8366, -117.9143];
const sanFrancisco = [37.7749, -122.4194];
const berkeley = [37.8715, -122.2730];

// Create custom icons (you'll need to provide these images)
const anaheimIcon = L.icon({
    iconUrl: 'anaheim_sprite.png', // Replace with your Anaheim sprite image
    iconSize: [40, 40], // size of the icon
    iconAnchor: [20, 40], // point of the icon which will correspond to marker's location
    popupAnchor: [0, -40] // point from which the popup should open relative to the iconAnchor
});

const sfIcon = L.icon({
    iconUrl: 'sf_sprite.png', // Replace with your SF sprite image
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
});

// Create markers
const anaheimMarker = L.marker(anaheim, { icon: anaheimIcon }).addTo(map)
    .bindPopup("Your GF is here (Anaheim!)").openPopup();

const sfMarker = L.marker(sanFrancisco, { icon: sfIcon }).addTo(map)
    .bindPopup("You are here (SF!)").openPopup();

const berkeleyMarker = L.marker(berkeley).addTo(map)
    .bindPopup("Your meeting point: Berkeley!").openPopup();

// Function to linearly interpolate between two points
const interpolateLatLng = (start, end, progress) => {
    const lat = start[0] + (end[0] - start[0]) * progress;
    const lng = start[1] + (end[1] - start[1]) * progress;
    return [lat, lng];
};

// Function to update sprite positions
const updateMapSprites = (progress) => {
    // Ensure progress is clamped between 0 and 1
    progress = Math.max(0, Math.min(1, progress));

    const currentAnaheimPos = interpolateLatLng(anaheim, berkeley, progress);
    const currentSfPos = interpolateLatLng(sanFrancisco, berkeley, progress);

    anaheimMarker.setLatLng(currentAnaheimPos);
    sfMarker.setLatLng(currentSfPos);
};

// Initial map sprite position
updateMapSprites(0); // Start at original positions