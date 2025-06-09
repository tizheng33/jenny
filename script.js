// Coordinates
const berkeley = [37.8656, -122.2600];
const sf = [37.7379, -122.3982];
const anaheim = [33.8239, -117.9186];

// Countdown logic
// Set start date to June 4th (PST) for the progress calculation.
// "T00:00:00-07:00" specifies midnight at UTC-7 (Pacific Daylight Time)
const startDate = new Date("2025-05-25T00:00:00-07:00");
const endDate = new Date("2025-08-23T00:00:00-07:00");
const today = new Date(); // Gets current date and time in local timezone

// Normalize 'today' to the start of its day in the local timezone (midnight)
// This ensures consistent calculation for the current day regardless of the time it runs.
today.setHours(0, 0, 0, 0);

const msPerDay = 1000 * 60 * 60 * 24;

// Calculate total days for the progress bar (inclusive of start and end dates)
// This is the total duration of the journey.
const totalDaysForProgress = Math.round((endDate.getTime() - startDate.getTime()) / msPerDay);


// Calculate days elapsed for the progress bar
// This is the number of full days that have passed since the start date.
const daysElapsedForProgress = Math.floor((today.getTime() - startDate.getTime()) / msPerDay);
const progress = Math.min(daysElapsedForProgress / totalDaysForProgress, 1); // Progress from 0 to 1

// --- Corrected Calculation for 'days-left' display to show 76 days ---
// Goal: 76 days when today is June 8th (PST) and end is August 23rd (PST).
// This counts from the day *after* today (June 9th) up to and including the end date (August 23rd).

// Get the date for the day after today, normalized to local midnight.
const dayAfterToday = new Date(today);
dayAfterToday.setDate(today.getDate() + 1); // Advances to next calendar day
dayAfterToday.setHours(0, 0, 0, 0); // Normalizes to midnight in local time

// Calculate the number of full 24-hour periods remaining until endDate.
// We add 1 to include the endDate itself in the count, representing the "days until".
const daysLeftForDisplay = Math.max(0, Math.round((endDate.getTime() - dayAfterToday.getTime()) / msPerDay) + 1);


// Update countdown display
document.getElementById('days-left').textContent = daysLeftForDisplay;

// Update days elapsed display
const daysElapsedValueElement = document.getElementById('days-elapsed-value');
if (daysElapsedValueElement) {
  daysElapsedValueElement.textContent = daysElapsedForProgress; // Use daysElapsedForProgress
}


// Lerp function for interpolation
function lerp(start, end, t) {
    return start + (end - start) * t;
}

// Calculate current positions based on progress
const currentSF = [
    lerp(sf[0], berkeley[0], progress),
    lerp(sf[1], berkeley[1], progress)
];
const currentAnaheim = [
    lerp(anaheim[0], berkeley[0], progress),
    lerp(anaheim[1], berkeley[1], progress)
];

// Calculate distance between the two sprites
const sfLatLng = L.latLng(currentSF[0], currentSF[1]);
const anaheimLatLng = L.latLng(currentAnaheim[0], currentAnaheim[1]);
const distanceMeters = sfLatLng.distanceTo(anaheimLatLng);
const distanceMiles = (distanceMeters * 0.000621371).toFixed(2); // Convert meters to miles and format to 2 decimal places

// Update distance between us display
document.getElementById('distance-value').textContent = `${distanceMiles} miles`;

// Calculate Miles Elapsed for each person
const sfToBerkeleyDistMeters = L.latLng(sf[0], sf[1]).distanceTo(L.latLng(berkeley[0], berkeley[1]));
const anaheimToBerkeleyDistMeters = L.latLng(anaheim[0], anaheim[1]).distanceTo(L.latLng(berkeley[0], berkeley[1]));

const sfMilesTraveled = (sfToBerkeleyDistMeters * progress * 0.000621371).toFixed(2);
const anaheimMilesTraveled = (anaheimToBerkeleyDistMeters * progress * 0.000621371).toFixed(2);

// Total Miles Elapsed: Sum of distances covered by both individuals towards Berkeley.
const totalMilesElapsed = (parseFloat(sfMilesTraveled) + parseFloat(anaheimMilesTraveled)).toFixed(2);

const milesElapsedValueElement = document.getElementById('miles-elapsed-value');
if (milesElapsedValueElement) {
  milesElapsedValueElement.textContent = `${totalMilesElapsed} miles`;
}


// Leaflet map setup
const map = L.map('map', { zoomControl: false }).setView([36.5, -120], 6);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 13,
}).addTo(map);

// Custom icons
const iconMe = L.icon({
    iconUrl: 'tim.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    className: 'rounded-leaflet-icon' // Add this line
});

const iconHer = L.icon({
    iconUrl: 'jenny.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    className: 'rounded-leaflet-icon' // Add this line
});

// Add markers
const markerMe = L.marker(currentSF, { icon: iconMe }).addTo(map).bindPopup("me");
// Store the 'her' marker in a variable so we can access its position for the quote bubble
const herMarker = L.marker(currentAnaheim, { icon: iconHer }).addTo(map).bindPopup("my love ❤️");
// A simple marker for the destination (Berkeley/Rochdale)
L.marker(berkeley, { icon: L.icon({ iconUrl: 'https://cdn-icons-png.flaticon.com/512/68/68798.png', iconSize: [30, 30], iconAnchor: [15, 30] }) }).addTo(map).bindPopup("rochdale");


