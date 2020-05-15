var slideIndex = 0;
const API_KEY = "AIzaSyDVV83q2YmvcJBm2WUSWb_Kq17K0tpXtMs";

var url = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&callback=initMap`



function getPeopleFetch() {
    console.log("get people fetch")
    let url = '/cd-microfluidics/people';
    let settings = {
        method: 'GET'
    }
    let results = document.querySelector('.results');

    fetch(url, settings)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJSON => {
            results.innerHTML = "";
            for (let i = 0; i < responseJSON.length; i++) {
                results.innerHTML += `
                <div class ="people">
                    <div class = "peopleDescription">
                        <h2>${responseJSON[i].firstName} ${responseJSON[i].lastName}</h2>
                        <h3>${responseJSON[i].major}</h3>
                        <p>${responseJSON[i].description}</p>
                        <p>${responseJSON[i].id}</p>
                    </div>
                </div>
                `
            }
        })
        .catch(err => {
            results.innerHTML = `<div>${err.message}</div>`;
        });

}

function addPersonFetch(firstName, lastName, description, major) {
    let postUrl = '/cd-microfluidics/createPerson';
    console.log(firstName, lastName, description, major)
    let newPerson = {
        firstName: firstName,
        lastName: lastName,
        description: description,
        major: major
    }

    let settings = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPerson)
    }

    let results = document.querySelector('.results');
    fetch(postUrl, settings)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJSON => {
            results.innerHTML = `
            <div>
            <h1>new person added :^)</h1>
            </div>
            `;
            console.log(responseJSON)
        })
        .catch(err => {
            results.innerHTML = `<div>${err.message}</div>`;
        });
}

function getPersonByFirstNameFetch(firstName) {
    let url = "/cd-microfluidics/getPerson/" + firstName;

    let settings = {
        method: 'GET',
    }
    let results = document.querySelector('.results');
    fetch(url, settings)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJSON => {
            results.innerHTML = "";
            for (let i = 0; i < responseJSON.length; i++) {
                results.innerHTML += `
                <div class ="people">
                    <div class = "peopleDescription">
                        <h2>${responseJSON[i].firstName} ${responseJSON[i].lastName}</h2>
                        <h3>${responseJSON[i].major}</h3>
                        <p>${responseJSON[i].description}</p>
                        <p>${responseJSON[i].id}</p>
                    </div>
                </div>
                `
            }
        })
        .catch(err => {
            results.innerHTML = `<div>${err.message}</div>`;
        });

}

function getPersonByIDFetch(id) {
    let url = "/cd-microfluidics/getPersonByID/" + id;
    let settings = {
        method: 'GET',
    }
    let results = document.querySelector('.results');

    let firstName = document.getElementById('updateFirstName')
    let lastName = document.getElementById('updateLastName')
    let description = document.getElementById('updateDescription')
    let major = document.getElementById('updateMajor')

    fetch(url, settings)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJSON => {
            results.innerHTML = "";
            firstName.value = responseJSON.firstName;
            lastName.value = responseJSON.lastName;
            description.value = responseJSON.description;
            major.value = responseJSON.major;
        })
        .catch(err => {
            results.innerHTML = `<div>${err.message}</div>`;
        });

}

function deletePersonFetch(id) {
    let url = '/cd-microfluidics/deletePerson/' + id;
    let settings = {
        method: 'DELETE'
    }
    let results = document.querySelector('.results');
    fetch(url, settings)
        .then(response => {
            if (response.ok) {
                results.innerHTML = `
                <div>
                <h1>Successfully deleted</h1>
                </div>
                `
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .catch(err => {
            results.innerHTML = `<div>${err.message}</div>`;
        });



}




function updatePersonFetch(id, firstName, lastName, description, major) {
    console.log("update person fetch")
    let url = "/cd-microfluidics/updatePerson/" + id;

    let updated = {
        id: id,
        firstName: firstName,
        lastName: lastName,
        description: description,
        major: major
    }
    let settings = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updated)
    }
    let results = document.querySelector('.results');
    fetch(url, settings)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJSON => {
            results.innerHTML = "";
            results.innerHTML = `
                <div>
                <h1>Successfully updated</h1>
                </div>
                `
            console.log(responseJSON)
        })
        .catch(err => {
            results.innerHTML = `<div>${err.message}</div>`;
        });

}

function watchAddPersonForm(id) {
    let getPeople = document.getElementById('getAllPeople')

    let personsForm = document.querySelector('.add-person-form');

    let firstName = document.getElementById('personFirstName');
    let lastName = document.getElementById('personLastName');
    let description = document.getElementById('personDescription');
    let major = document.getElementById('personMajor');

    personsForm.addEventListener('submit', (event) => {
        event.preventDefault();
        addPersonFetch(firstName.value, lastName.value, description.value, major.value);
    });

    getPeople.addEventListener('click', event => {
        getPeopleFetch();
    });

}



function watchGetPersonByFirstName() {
    let form = document.querySelector('.get-person-by-firstName');
    let firstName = document.getElementById('personFirstNameFilter')

    form.addEventListener('submit', event => {
        event.preventDefault();
        getPersonByFirstNameFetch(firstName.value)
    });

}

function watchDeletePersonById() {
    let form = document.querySelector('.delete-person-by-id');
    let id = document.getElementById('deletePerson')

    form.addEventListener('submit', event => {
        event.preventDefault();
        deletePersonFetch(id.value);
    });
}

function watchUpdatePerson() {
    let form = document.querySelector('.update-person-form');
    let id = document.getElementById('updateID')
    let findButton = document.getElementById('findToUpdate');

    let firstName = document.getElementById('updateFirstName')
    let lastName = document.getElementById('updateLastName')
    let description = document.getElementById('updateDescription')
    let major = document.getElementById('updateMajor')

    findButton.addEventListener('click', event => {
        getPersonByIDFetch(id.value)
    });

    form.addEventListener('submit', event => {
        event.preventDefault();
        updatePersonFetch(id.value, firstName.value, lastName.value, description.value, major.value);
    });

}


function watchMenu() {
    let homeBtn = document.getElementById('homeMenu')
    let projectsBtn = document.getElementById('projectsMenu')
    let peopleBtn = document.getElementById('peopleMenu')
    let publicationsBtn = document.getElementById('publicationsMenu')
    let galleryBtn = document.getElementById('galleryMenu')
    let mapsBtn = document.getElementById('mapsMenu')

    homeBtn.addEventListener('click', event => {
        let pastOption = document.querySelector('.activeOption');
        pastOption.classList.remove('activeOption');
        homeBtn.classList.add('activeOption');

        let pastSection = document.querySelector('.selectedSection')
        pastSection.classList.remove('selectedSection')
        pastSection.classList.add('hidden')

        let homeSection = document.getElementById('home')
        homeSection.classList.remove('hidden');
        homeSection.classList.add('selectedSection')
    });

    projectsBtn.addEventListener('click', event => {
        let pastOption = document.querySelector('.activeOption');
        pastOption.classList.remove('activeOption');
        projectsBtn.classList.add('activeOption');

        let pastSection = document.querySelector('.selectedSection')
        pastSection.classList.remove('selectedSection')
        pastSection.classList.add('hidden')

        let projectsSection = document.getElementById('projects')
        projectsSection.classList.remove('hidden');
        projectsSection.classList.add('selectedSection')
    });

    peopleBtn.addEventListener('click', event => {
        console.log("people menu")
        let pastOption = document.querySelector('.activeOption');
        pastOption.classList.remove('activeOption');
        peopleBtn.classList.add('activeOption');

        let pastSection = document.querySelector('.selectedSection')
        pastSection.classList.remove('selectedSection')
        pastSection.classList.add('hidden')

        let peopleSection = document.getElementById('people')
        peopleSection.classList.remove('hidden');
        peopleSection.classList.add('selectedSection')


        let adminSection = document.getElementById('peopleAdmin')
        adminSection.classList.remove('hidden')
    });

    publicationsBtn.addEventListener('click', event => {
        let pastOption = document.querySelector('.activeOption');
        pastOption.classList.remove('activeOption');
        publicationsBtn.classList.add('activeOption');

        let pastSection = document.querySelector('.selectedSection')
        pastSection.classList.remove('selectedSection')
        pastSection.classList.add('hidden')

        let publicationsSection = document.getElementById('publications')
        publicationsSection.classList.remove('hidden');
        publicationsSection.classList.add('selectedSection')
    });

    galleryBtn.addEventListener('click', event => {
        let pastOption = document.querySelector('.activeOption');
        pastOption.classList.remove('activeOption');
        galleryBtn.classList.add('activeOption');

        let pastSection = document.querySelector('.selectedSection')
        pastSection.classList.remove('selectedSection')
        pastSection.classList.add('hidden')

        let projectsSection = document.getElementById('gallery')
        projectsSection.classList.remove('hidden');
        projectsSection.classList.add('selectedSection')
    });

    mapsBtn.addEventListener('click', event => {
        let pastOption = document.querySelector('.activeOption');
        pastOption.classList.remove('activeOption');
        mapsBtn.classList.add('activeOption');

        let pastSection = document.querySelector('.selectedSection')
        pastSection.classList.remove('selectedSection')
        pastSection.classList.add('hidden')

        let mapsSection = document.getElementById('maps')
        mapsSection.classList.remove('hidden');
        mapsSection.classList.add('selectedSection')
    });
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
    watchMenu();

    watchAddPersonForm();
    watchDeletePersonById();
    watchGetPersonByFirstName();
    watchUpdatePerson();

    initMap();
}

init();