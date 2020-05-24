var slideIndex = 0;
const API_KEY = "AIzaSyDVV83q2YmvcJBm2WUSWb_Kq17K0tpXtMs";


// -------------------------- PEOPLE FETCH --------------------------

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
                    <div class = "peopleImage">
                        <img src = "http://localhost:8080/${responseJSON[i].personImage}" >
                    </div>
                    <div class = "peopleDescription">
                        <h2>${responseJSON[i].firstName} ${responseJSON[i].lastName}</h2>
                        <h3>${responseJSON[i].major}</h3>
                        <p>${responseJSON[i].description}</p>
                        <p>id : ${responseJSON[i].id}</p>
                    </div>
                </div>
                `
            }
        })
        .catch(err => {
            results.innerHTML = `<div>${err.message}</div>`;
        });

}

function addPersonFetch(firstName, lastName, description, major, personImage) {
    console.log("add person fetch")
    let postUrl = '/cd-microfluidics/createPerson';
    console.log(personImage)

    const fd = new FormData();
    fd.append('personImage', personImage)
    fd.append('firstName', firstName)
    fd.append('lastName', lastName)
    fd.append('description', description)
    fd.append('major', major)

    let settings = {
        method: 'POST',
        body: fd
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
                    <div class = "peopleImage">
                        <img src = "http://localhost:8080/${responseJSON[i].personImage}" >
                    </div>
                    <div class = "peopleDescription">
                        <h2>${responseJSON[i].firstName} ${responseJSON[i].lastName}</h2>
                        <h3>${responseJSON[i].major}</h3>
                        <p>${responseJSON[i].description}</p>
                        <p>id : ${responseJSON[i].id}</p>
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

            results.innerHTML += `
                <div class ="people">
                    <div class = "peopleImage">
                        <img src = "http://localhost:8080/${responseJSON.personImage}" >
                    </div>
                    <div class = "peopleDescription">
                        <h2>${responseJSON.firstName} ${responseJSON.lastName}</h2>
                        <h3>${responseJSON.major}</h3>
                        <p>${responseJSON.description}</p>
                        <p>id : ${responseJSON.id}</p>
                    </div>
                </div>
                `
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
                return response;
            }
            throw new Error(response.statusText);
        }).then(res => {
            console.log(res)
        })
        .catch(err => {
            results.innerHTML = `<div>${err.message}</div>`;
        });
}

function updatePersonFetch(id, firstName, lastName, description, major, personImage) {
    console.log("update person fetch")
    let url = "/cd-microfluidics/updatePerson/" + id;

    const fd = new FormData();
    fd.append('personImage', personImage)
    fd.append('firstName', firstName)
    fd.append('lastName', lastName)
    fd.append('description', description)
    fd.append('major', major)
    fd.append('id', id)

    let settings = {
        method: 'PATCH',
        body: fd
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

// -------------------------- PEOPLE ADMIN FORMS --------------------------
function watchAddPersonForm() {
    let getPeople = document.getElementById('getAllPeople')

    let personsForm = document.querySelector('.add-person-form');

    let firstName = document.getElementById('personFirstName');
    let lastName = document.getElementById('personLastName');
    let description = document.getElementById('personDescription');
    let major = document.getElementById('personMajor');

    let picture = document.getElementById('addPersonImage');

    personsForm.addEventListener('submit', (event) => {
        event.preventDefault();
        let imgFile = picture.files[0]
        addPersonFetch(firstName.value, lastName.value, description.value, major.value, imgFile);
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

    let picture = document.getElementById('updateImage');

    findButton.addEventListener('click', event => {
        getPersonByIDFetch(id.value)
    });

    form.addEventListener('submit', event => {
        event.preventDefault();
        let imgFile = picture.files[0]
        updatePersonFetch(id.value, firstName.value, lastName.value, description.value, major.value, imgFile);
    });

}


// -------------------------- PROJECTS FETCH --------------------------

function getProjectsFetch() {
    console.log('get projects fetch')
    let url = '/cd-microfluidics/projects'

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
                <div class ="publications">
                    <div class = "publicationsImage">
                        <img src = "http://localhost:8080/${responseJSON[i].projectImage}">
                    </div>
                    <div class = "publicationsDescription">
                        <h5>Date:${responseJSON[i].date}</h5>
                        <h2>${responseJSON[i].title}</h2>
                        <p>${responseJSON[i].description}</p>
                        <a href=${responseJSON[i].url}>Link to Publication</a>
                        <p>id : ${responseJSON[i].id}</p>
                    </div>
                </div>
                `
            }
        })
        .catch(err => {
            results.innerHTML = `<div>${err.message}</div>`;
        });
}

function addProjectFetch(title, description, url, date, projectImage) {
    console.log('add project fetch')
    let postUrl = '/cd-microfluidics/createProject'

    console.log(projectImage)
    console.log(typeof (projectImage))

    const fd = new FormData();
    fd.append('projectImage', projectImage)
    fd.append('title', title)
    fd.append('description', description)
    fd.append('url', url)
    fd.append('date', date)

    let settings = {
        method: 'POST',
        body: fd
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
            <h1>new project added :^)</h1>
            </div>
            `;
            console.log(responseJSON)
        })
        .catch(err => {
            results.innerHTML = `<div>${err.message}</div>`;
        });
}

function getProjectByTitleFetch(title) {
    console.log('get project by title fetch')
    let url = '/cd-microfluidics/getProject/' + title;

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
                <div class ="publications">
                    <div class = "publicationsImage">
                        <img src = "http://localhost:8080/${responseJSON[i].projectImage}">
                    </div>
                    <div class = "publicationsDescription">
                        <h5>Date:${responseJSON[i].date}</h5>
                        <h2>${responseJSON[i].title}</h2>
                        <p>${responseJSON[i].description}</p>
                        <a href=${responseJSON[i].url}>Link to Publication</a>
                        <p>id : ${responseJSON[i].id}</p>
                    </div>
                </div>
                `
            }
        })
        .catch(err => {
            results.innerHTML = `<div>${err.message}</div>`;
        });
}

function getProjectByIdFetch(id) {
    console.log('get project by id fetch')
    let reqUrl = '/cd-microfluidics/getProjectByID/' + id;
    let settings = {
        method: 'GET',
    }
    let results = document.querySelector('.results');

    let title = document.getElementById('projectTitleUpdate')
    let description = document.getElementById('projectDescriptionUpdate')
    let url = document.getElementById('projectUrlUpdate')
    let date = document.getElementById('projectDateUpdate')


    fetch(reqUrl, settings)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJSON => {
            results.innerHTML = "";
            title.value = responseJSON.title;
            description.value = responseJSON.description;
            url.value = responseJSON.url;
            date.value = responseJSON.date;

            results.innerHTML += `
                <div class ="publications">
                    <div class = "publicationsImage">
                        <img src = "http://localhost:8080/${responseJSON.projectImage}">
                    </div>
                    <div class = "publicationsDescription">
                        <h5>Date:${responseJSON.date}</h5>
                        <h2>${responseJSON.title}</h2>
                        <p>${responseJSON.description}</p>
                        <a href=${responseJSON.url}>Link to Publication</a>
                        <p>id : ${responseJSON.id}</p>
                    </div>
                </div>
                `
        })
        .catch(err => {
            results.innerHTML = `<div>${err.message}</div>`;
        });

}

function deleteProjectFetch(id) {
    console.log('delete project fetch')
    let url = '/cd-microfluidics/deleteProject/' + id
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
                return response;
            }
            throw new Error(response.statusText);
        }).then(res => {
            console.log(res)
        })
        .catch(err => {
            results.innerHTML = `<div>${err.message}</div>`;
        });
}

function updateProjectFetch(id, title, description, url, date, projectImage) {
    console.log('update project fetch')
    let reqUrl = '/cd-microfluidics/updateProject/' + id;

    const fd = new FormData();
    fd.append('projectImage', projectImage)
    fd.append('title', title)
    fd.append('description', description)
    fd.append('url', url)
    fd.append('date', date)
    fd.append('id', id)

    let settings = {
        method: 'PATCH',
        body: fd
    }
    let results = document.querySelector('.results');
    fetch(reqUrl, settings)
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

// -------------------------- PROJECTS ADMIN FORMS --------------------------

function watchAddProjectsForm() {
    let getProjects = document.getElementById('getAllProjects')

    let form = document.querySelector('.add-project-form');

    let title = document.getElementById('projectTitle')
    let description = document.getElementById('projectDescription')
    let url = document.getElementById('projectUrl')
    let date = document.getElementById('projectDate')

    let picture = document.getElementById('addProjectImage')

    form.addEventListener('submit', event => {
        event.preventDefault();
        let imgFile = picture.files[0]
        addProjectFetch(title.value, description.value, url.value, date.value, imgFile);

    });

    getProjects.addEventListener('click', event => {
        getProjectsFetch()
    });
}

function watchGetProjectsByTitle() {
    let form = document.querySelector('.get-projects-by-title');
    let title = document.getElementById('projectTitleFilter');

    form.addEventListener('submit', event => {
        event.preventDefault();
        getProjectByTitleFetch(title.value);

    });
}

function watchDeleteProjectsByID() {
    let form = document.querySelector('.delete-project-by-id');
    let id = document.getElementById('deleteProject');

    form.addEventListener('submit', event => {
        event.preventDefault();
        deleteProjectFetch(id.value);
    });

}

function watchUpdateProjects() {

    let form = document.querySelector('.update-project-form');
    let id = document.getElementById('updateProjectID');
    let find = document.getElementById('findprojectToUpdate');


    let title = document.getElementById('projectTitleUpdate')
    let description = document.getElementById('projectDescriptionUpdate')
    let url = document.getElementById('projectUrlUpdate')
    let date = document.getElementById('projectDateUpdate')

    let picture = document.getElementById('updateProjectImage')

    find.addEventListener('click', event => {
        getProjectByIdFetch(id.value)
    });

    form.addEventListener('submit', event => {
        event.preventDefault();
        let imgFile = picture.files[0]
        updateProjectFetch(id.value, title.value, description.value, url.value, date.value, imgFile);
    });

}

// -------------------------- PUBLICATIONS FETCH --------------------------

function getPublicationsFetch() {
    console.log('get publications fetch')
    let url = '/cd-microfluidics/publications'

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
                <div class ="publications">
                    <div class = "publicationsImage">
                        <img src = "http://localhost:8080/${responseJSON[i].publicationImage}">
                    </div>
                    <div class = "publicationsDescription">
                        <h5>Date:${responseJSON[i].date}</h5>
                        <h2>${responseJSON[i].title}</h2>
                        <p>${responseJSON[i].description}</p>
                        <a href=${responseJSON[i].url}>Link to Publication</a>
                        <p>id : ${responseJSON[i].id}</p>
                    </div>
                </div>
                `
            }
        })
        .catch(err => {
            results.innerHTML = `<div>${err.message}</div>`;
        });
}

function addPublicationsFetch(title, description, url, date, publicationImage) {
    console.log('add publication fetch')
    let postUrl = '/cd-microfluidics/createPublication'

    const fd = new FormData();
    fd.append('publicationImage', publicationImage)
    fd.append('title', title)
    fd.append('description', description)
    fd.append('url', url)
    fd.append('date', date)

    let settings = {
        method: 'POST',
        body: fd
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
            <h1>new project added :^)</h1>
            </div>
            `;
            console.log(responseJSON)
        })
        .catch(err => {
            results.innerHTML = `<div>${err.message}</div>`;
        });
}

function getPublicationByTitleFetch(title) {
    console.log('get publication by title fetch')
    let url = '/cd-microfluidics/getPublication/' + title;

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
                <div class ="publications">
                    <div class = "publicationsImage">
                        <img src = "http://localhost:8080/${responseJSON[i].publicationImage}">
                    </div>
                    <div class = "publicationsDescription">
                        <h5>Date:${responseJSON[i].date}</h5>
                        <h2>${responseJSON[i].title}</h2>
                        <p>${responseJSON[i].description}</p>
                        <a href=${responseJSON[i].url}>Link to Publication</a>
                        <p>id : ${responseJSON[i].id}</p>
                    </div>
                </div>
                `
            }
        })
        .catch(err => {
            results.innerHTML = `<div>${err.message}</div>`;
        });
}

function getPublicationByIdFetch(id) {
    console.log('get publication by id fetch')
    let reqUrl = '/cd-microfluidics/getPublicationByID/' + id;
    let settings = {
        method: 'GET',
    }
    let results = document.querySelector('.results');

    let title = document.getElementById('publicationTitleUpdate')
    let description = document.getElementById('publicationDescriptionUpdate')
    let url = document.getElementById('publicationUrlUpdate')
    let date = document.getElementById('publicationDateUpdate')


    fetch(reqUrl, settings)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJSON => {
            results.innerHTML = "";
            title.value = responseJSON.title;
            description.value = responseJSON.description;
            url.value = responseJSON.url;
            date.value = responseJSON.date;

            results.innerHTML += `
                <div class ="publications">
                    <div class = "publicationsImage">
                        <img src = "http://localhost:8080/${responseJSON.publicationImage}">
                    </div>
                    <div class = "publicationsDescription">
                        <h5>Date:${responseJSON.date}</h5>
                        <h2>${responseJSON.title}</h2>
                        <p>${responseJSON.description}</p>
                        <a href=${responseJSON.url}>Link to Publication</a>
                        <p>id : ${responseJSON.id}</p>
                    </div>
                </div>
                `
        })
        .catch(err => {
            results.innerHTML = `<div>${err.message}</div>`;
        });

}

function deletePublicationFetch(id) {
    console.log('delete publication fetch')
    let url = '/cd-microfluidics/deletePublication/' + id
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
                return response;
            }
            throw new Error(response.statusText);
        }).then(res => {
            console.log(res)
        })
        .catch(err => {
            results.innerHTML = `<div>${err.message}</div>`;
        });
}

function updatePublicationFetch(id, title, description, url, date, publicationImage) {
    console.log('update publication fetch')
    let reqUrl = '/cd-microfluidics/updatePublication/' + id;

    const fd = new FormData();
    fd.append('publicationImage', publicationImage)
    fd.append('title', title)
    fd.append('description', description)
    fd.append('url', url)
    fd.append('date', date)
    fd.append('id', id)

    let settings = {
        method: 'PATCH',
        body: fd
    }
    let results = document.querySelector('.results');
    fetch(reqUrl, settings)
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

// -------------------------- PUBLICATIONS ADMIN FORMS --------------------------


function watchAddPublicationForm() {
    let getPublications = document.getElementById('getAllPublications')

    let form = document.querySelector('.add-publication-form');

    let title = document.getElementById('publicationTitle')
    let description = document.getElementById('publicationDescription')
    let url = document.getElementById('publicationUrl')
    let date = document.getElementById('publicationDate')

    let picture = document.getElementById('addPublicationImage')

    form.addEventListener('submit', event => {
        event.preventDefault();
        let imgFile = picture.files[0]
        addPublicationsFetch(title.value, description.value, url.value, date.value, imgFile);
    });

    getPublications.addEventListener('click', event => {
        getPublicationsFetch()
    });
}

function watchGetPublicationByTitle() {
    let form = document.querySelector('.get-publications-by-title');
    let title = document.getElementById('publicationTitleFilter');

    form.addEventListener('submit', event => {
        event.preventDefault();
        getPublicationByTitleFetch(title.value);

    });
}

function watchDeletePublicationByID() {
    let form = document.querySelector('.delete-publication-by-id');
    let id = document.getElementById('deletePublication');

    form.addEventListener('submit', event => {
        event.preventDefault();
        deletePublicationFetch(id.value);
    });

}

function watchUpdatePublications() {

    let form = document.querySelector('.update-publication-form');
    let id = document.getElementById('updatePublicationID');
    let find = document.getElementById('findPublicationToUpdate');


    let title = document.getElementById('publicationTitleUpdate')
    let description = document.getElementById('publicationDescriptionUpdate')
    let url = document.getElementById('publicationUrlUpdate')
    let date = document.getElementById('publicationDateUpdate')

    let picture = document.getElementById('updatePublicationImage')


    find.addEventListener('click', event => {
        getPublicationByIdFetch(id.value)
    });

    form.addEventListener('submit', event => {
        event.preventDefault();
        let imgFile = picture.files[0]

        updatePublicationFetch(id.value, title.value, description.value, url.value, date.value, imgFile);
    });

}
// -------------------------- PICTURES FETCH --------------------------
function getPicturesFetch() {
    console.log("get pictures fetch")
    let url = '/cd-microfluidics/pictures';
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
                <div class ="galleryImg">
                    <img src = "http://localhost:8080/${responseJSON[i].image}">
                    <p>${responseJSON[i].description}</p>
                    <p>id : ${responseJSON[i].id}</p>
                </div>
                `
                //the responseJSON[i].image stores the path to get to the uploads folder
            }
        })
        .catch(err => {
            results.innerHTML = `<div>${err.message}</div>`;
        });

}

function addPictureFetch(description, imgFile) {
    console.log("add picture fetch")
    let postUrl = '/cd-microfluidics/createPicture';
    //form data send the image as an object, in the request the file is sent in the files section
    const fd = new FormData();
    fd.append('image', imgFile)
    fd.append('description', description)

    let settings = {
        method: 'POST',
        body: fd
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
            <h1>new image added :^)</h1>
            </div>
            `;
            console.log(responseJSON)
        })
        .catch(err => {
            results.innerHTML = `<div>${err.message}</div>`;
        });
}

function getPictureByIDFetch(id) {
    console.log('get picture by id fetch')
    let reqUrl = '/cd-microfluidics/getPictureByID/' + id;
    let settings = {
        method: 'GET',
    }
    let results = document.querySelector('.results');

    let description = document.getElementById('updatePicDescription')


    fetch(reqUrl, settings)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJSON => {
            results.innerHTML = "";
            description.value = responseJSON.description;
            console.log(responseJSON.image)

            results.innerHTML += `
                <div class ="galleryImg">
                    <img src = "http://localhost:8080/${responseJSON.image}">
                    <p>${responseJSON.description}</p>
                    <p>id : ${responseJSON.id}</p>
                </div>
                `
        })
        .catch(err => {
            results.innerHTML = `<div>${err.message}</div>`;
        });

}

function deletePictureFetch(id) {
    console.log('delete picture fetch')
    let url = '/cd-microfluidics/deletePicture/' + id
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
                return response;
            }
            throw new Error(response.statusText);
        }).then(res => {
            console.log(res)
        })
        .catch(err => {
            results.innerHTML = `<div>${err.message}</div>`;
        });
}

function updatePictureFetch(id, description, imgFile) {
    console.log('update publication fetch')
    let reqUrl = '/cd-microfluidics/updatePicture/' + id;

    const fd = new FormData();
    fd.append('image', imgFile)
    fd.append('description', description)
    fd.append('id', id)

    let settings = {
        method: 'PATCH',
        body: fd
    }
    let results = document.querySelector('.results');
    fetch(reqUrl, settings)
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

// -------------------------- PICTURES ADMIN FORMS --------------------------
function watchAddImageForm() {
    let getPictures = document.getElementById('getAllPictures')

    let form = document.querySelector('.add-image-form');
    let picture = document.getElementById('addImage');
    let description = document.getElementById('pictureDescription');

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        let imgFile = picture.files[0]
        addPictureFetch(description.value, imgFile);
    });

    getPictures.addEventListener('click', event => {
        getPicturesFetch();
    });
}

function watchDeletePictureByID() {
    let form = document.querySelector('.delete-picture-by-id');
    let id = document.getElementById('deletePicture');

    form.addEventListener('submit', event => {
        event.preventDefault();
        deletePictureFetch(id.value);
    });

}

function watchUpdatePictureByID() {

    let form = document.querySelector('.update-picture-form');
    let id = document.getElementById('updatePictureID');
    let find = document.getElementById('findPicToUpdate');


    let description = document.getElementById('updatePicDescription')
    let picture = document.getElementById('updateGalleryImage')


    find.addEventListener('click', event => {
        getPictureByIDFetch(id.value)
    });

    form.addEventListener('submit', event => {
        event.preventDefault();
        let imgFile = picture.files[0]

        updatePictureFetch(id.value, description.value, imgFile);
    });

}

// -------------------------- MENU --------------------------
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

        let pastAdmin = document.querySelector('.selectedAdmin');
        pastAdmin.classList.remove('selectedAdmin')
        pastAdmin.classList.add('hidden')

        let adminSection = document.getElementById('homeAdmin')
        adminSection.classList.remove('hidden')
        adminSection.classList.add('selectedAdmin');

        let results = document.querySelector('.results');
        results.innerHTML = ""

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

        let pastAdmin = document.querySelector('.selectedAdmin');
        pastAdmin.classList.remove('selectedAdmin')
        pastAdmin.classList.add('hidden')

        let adminSection = document.getElementById('projectsAdmin')
        adminSection.classList.remove('hidden')
        adminSection.classList.add('selectedAdmin');

        let results = document.querySelector('.results');
        results.innerHTML = ""
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


        let pastAdmin = document.querySelector('.selectedAdmin');
        pastAdmin.classList.remove('selectedAdmin')
        pastAdmin.classList.add('hidden')

        let adminSection = document.getElementById('peopleAdmin')
        adminSection.classList.remove('hidden')
        adminSection.classList.add('selectedAdmin');

        let results = document.querySelector('.results');
        results.innerHTML = ""
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

        let pastAdmin = document.querySelector('.selectedAdmin');
        pastAdmin.classList.remove('selectedAdmin')
        pastAdmin.classList.add('hidden')

        let adminSection = document.getElementById('publicationsAdmin')
        adminSection.classList.remove('hidden')
        adminSection.classList.add('selectedAdmin');

        let results = document.querySelector('.results');
        results.innerHTML = ""
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

        let pastAdmin = document.querySelector('.selectedAdmin');
        pastAdmin.classList.remove('selectedAdmin')
        pastAdmin.classList.add('hidden')

        let adminSection = document.getElementById('galleryAdmin')
        adminSection.classList.remove('hidden')
        adminSection.classList.add('selectedAdmin');

        let results = document.querySelector('.results');
        results.innerHTML = ""
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

        let pastAdmin = document.querySelector('.selectedAdmin');
        pastAdmin.classList.remove('selectedAdmin')
        pastAdmin.classList.add('hidden')

        let adminSection = document.getElementById('mapsAdmin')
        adminSection.classList.remove('hidden')
        adminSection.classList.add('selectedAdmin');

        let results = document.querySelector('.results');
        results.innerHTML = ""
    });
}


// Slides Functionality 

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




// Map functionality, not working yet
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

    //person
    watchAddPersonForm();
    watchDeletePersonById();
    watchGetPersonByFirstName();
    watchUpdatePerson();

    //projects
    watchAddProjectsForm();
    watchDeleteProjectsByID();
    watchGetProjectsByTitle();
    watchUpdateProjects();

    //publications
    watchAddPublicationForm();
    watchDeletePublicationByID();
    watchGetPublicationByTitle();
    watchUpdatePublications();


    //pictures
    watchAddImageForm();
    watchDeletePictureByID();
    watchUpdatePictureByID();



    initMap();
}

init();