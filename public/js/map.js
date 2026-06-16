// 1. Create map centered on Amritsar
const map = L.map('map').setView([coordinates[1], coordinates[0]], 12);

// 2. Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// 3. Add a marker
L.marker([coordinates[1], coordinates[0]])
    .addTo(map)
    .bindPopup(`${loc} <br><br> Note: exact location will be provided after booking`)
    .openPopup();