// Set the target date
const endDate = new Date("2025-08-23");
const today = new Date();

// Calculate remaining days
const msPerDay = 1000 * 60 * 60 * 24;
const daysLeft = Math.ceil((endDate - today) / msPerDay);

// Update text content
document.getElementById("countdown-text").textContent =
  daysLeft > 0
    ? `There are ${daysLeft} days left until move-in day (August 23, 2025)!`
    : "You're already moved in! 🎉";