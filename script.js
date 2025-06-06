// Coordinates
const berkeley = [37.8656, -122.2600];
const sf = [37.7379, -122.3982];
const anaheim = [33.8239, -117.9186];

// Countdown logic
const startDate = new Date("2025-06-04");
const endDate = new Date("2025-08-23");
const today = new Date;
const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
const daysElapsed = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
const progress = Math.min(daysElapsed / totalDays, 1);
const daysLeft = Math.max(0, totalDays - daysElapsed);

// Update countdown display
document.getElementById('days-left').textContent = daysLeft;

// Lerp function for interpolation
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

// Leaflet map setup
const map = L.map('map').setView([36.5, -120], 6);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 13,
}).addTo(map);

// Custom icons
const iconMe = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/194/194938.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40]
});

const iconHer = L.icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/194/194937.png',
  iconSize: [40, 40],
  iconAnchor: [20, 40]
});

// Add markers
L.marker(currentSF, { icon: iconMe }).addTo(map).bindPopup("me");
L.marker(currentAnaheim, { icon: iconHer }).addTo(map).bindPopup("my love ❤️");
L.marker(berkeley).addTo(map).bindPopup("rochdale");