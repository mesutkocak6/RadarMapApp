// Harita ve radar konumlarını tanımlamak için fonksiyonlar
let map;
const radarLocations = [
    { lat: 39.5426, lng: 32.4535, title: "Teknokent Radar"},
    { lat: 39.8717, lng: 32.6537, title: "ev Radar"},
    // Diğer radar konumları
];

// Harita başlatma fonksiyonu
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 39.9334, lng: 32.8597 }, // Türkiye'nin merkezi
        zoom: 6,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    radarLocations.forEach(location => {
        new google.maps.Marker({
            position: { lat: location.lat, lng: location.lng },
            map: map,
            title: location.title
        });
    });

    getUserLocation();
}

// Kullanıcının konumunu al ve haritada göster
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(showPosition, showError, {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 5000
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    const userLat = position.coords.latitude;
    const userLng = position.coords.longitude;
    const userLocation = new google.maps.LatLng(userLat, userLng);

    const marker = new google.maps.Marker({
        position: userLocation,
        map: map,
        title: "Kullanıcı",
        icon: {
            url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png' // Kullanıcı ikonu
        }
    });

    map.setCenter(userLocation);
    checkProximity(userLat, userLng);
    updateLocationBox(userLat, userLng); // Mevcut konumu güncelle
}

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("Kullanıcı konum iznini reddetti.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Kullanıcı konumu alınamadı.");
            break;
        case error.TIMEOUT:
            alert("Kullanıcı konumu alınamadı.");
            break;
        case error.UNKNOWN_ERROR:
            alert("Bilinmeyen bir hata oluştu.");
            break;
    }
}

function checkProximity(userLat, userLng) {
    const alarmSound = document.getElementById("alarmSound");
    radarLocations.forEach(location => {
        const distance = getDistanceFromLatLonInKm(userLat, userLng, location.lat, location.lng);
        if (distance < 1) { // 1 km mesafeye yaklaştığında uyarı
            alarmSound.play(); // Sesli alarm çal
            showMessage(`Radar konumuna yaklaşıyorsunuz: ${location.title}`);
        }
    });
}

function showMessage(message) {
    const messageBox = document.getElementById("messageBox");
    messageBox.textContent = message;
    messageBox.style.display = 'block';
    setTimeout(() => {
        messageBox.style.display = 'none';
    }, 50000); // Mesajı 5 saniye göster
}

function updateLocationBox(lat, lng) {
    const locationBox = document.getElementById("locationBox");
    locationBox.textContent = `Mevcut Konum: Enlem ${lat.toFixed(5)}, Boylam ${lng.toFixed(5)}`;
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Yerkürenin yarıçapı (km)
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
    const d = R * c; // Mesafe (km)
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

document.addEventListener('DOMContentLoaded', () => {
    initMap();
});