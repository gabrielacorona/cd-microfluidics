var slideIndex = 0;
const API_KEY = "AIzaSyDVV83q2YmvcJBm2WUSWb_Kq17K0tpXtMs";

var url = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&callback=initMap`





function watchNativationMenu(){
    let navigationElements = document.getElementsByClassName( 'menu' );

    for ( let i = 0; i < navigationElements.length; i ++ ){
        navigationElements[i].addEventListener( 'click', ( event ) => {
            let pastOption = document.querySelector('.activeOption')
            pastOption.classList.remove('activeOption')
            //console.log(navigationElements[i])
            navigationElements[i].classList.add('activeOption')

            let selectedSection = document.querySelector( '.selectedSection' );
            selectedSection.classList.add( 'hidden' );
            selectedSection.classList.remove( 'selectedSection' );
            

            // let pastSection = document.querySelector('.selectedSection');
            // pastSection.classList.remove('selectedSection');
            // pastSection.classList.add('hidden');
            
            let currentElement = navigationElements[i].textContent;
            currentElement = currentElement.toLowerCase().trim();
            console.log(currentElement);


            let elementToShow = document.getElementById( `${currentElement}` );
            console.log(elementToShow);
            elementToShow.classList.remove( 'hidden' );
            elementToShow.classList.add( 'selectedSection' );
        });
    }
}


/*
Slides Functionality 
*/
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



/*
Map functionality, not working yet
 */
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
    watchNativationMenu();
    initMap();
}

init();