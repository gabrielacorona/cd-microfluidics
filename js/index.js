var slideIndex = 0;
const API_KEY = "AIzaSyDVV83q2YmvcJBm2WUSWb_Kq17K0tpXtMs";

var url = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&callback=initMap`

function showSlides() {
    var i;
    var slides = document.getElementsByClassName("mySlides");
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > slides.length) {
        slideIndex = 1
    }
    slides[slideIndex - 1].style.display = "block";
    setTimeout(showSlides, 3000); // Change image every 2 seconds
}




function initMap() {
   
    var tec = {
        lat: 25.6519834,
        lng: -100.291414
    };
    // The map, centered at tec
    var map = new google.maps.Map(
        document.getElementById('map'), {
            zoom: 4,
            center: tec
        });
    // The marker, positioned at tec
    var marker = new google.maps.Marker({
        position: tec,
        map: map
    });
}


function init() {
    showSlides();
    initMap();
}

init();