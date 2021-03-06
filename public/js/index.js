var slideIndex = 0;
const API_KEY = "AIzaSyDVV83q2YmvcJBm2WUSWb_Kq17K0tpXtMs";
let map = new google.maps.Map(document.getElementById('map'), {
    center: {
        lat: 35.78613674,
        lng: -119.4491591
    },
    zoom: 4
});


// -------------------------- PEOPLE FETCH --------------------------
function getPeopleFetchPublic() {
    //console.log("get people fetch public")
    let url = '/cd-microfluidics/people';

    let settings = {
        method: 'GET',
    }

    let results = document.getElementById('people');

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
                        <img alt="Person Image " src = " ${responseJSON[i].personImage}" >
                    </div>
                    <div class = "peopleDescription">
                        <h2 alt="Person Name ">${responseJSON[i].firstName} ${responseJSON[i].lastName}</h2>
                        <h3 alt="Person Major ">${responseJSON[i].major}</h3>
                        <p alt="Person Description ">${responseJSON[i].description}</p>
                    </div>
                </div>
                `
            }
        })
        .catch(err => {
            results.innerHTML = `<div>${err.message}</div>`;
        });

}

function getPeopleFetch() {
    //console.log("get people fetch")
    let url = '/cd-microfluidics/people';

    const headers = new Headers();
    let authorization = localStorage.getItem('token')
    headers.append('Authorization', authorization)

    let settings = {
        method: 'GET',
        headers: headers
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
                        <img alt="Person Image " src = " ${responseJSON[i].personImage}" >
                    </div>
                    <div class = "peopleDescription">
                        <h2 alt="Person Name ">${responseJSON[i].firstName} ${responseJSON[i].lastName}</h2>
                        <h3 alt="Person Major ">${responseJSON[i].major}</h3>
                        <p alt="Person Description ">${responseJSON[i].description}</p>
                        <p> id :${responseJSON[i].id}</p>
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
    //console.log("add person fetch")
    let postUrl = '/cd-microfluidics/createPerson';
    ////console.log(personImage)

    const fd = new FormData();
    fd.append('personImage', personImage)
    fd.append('firstName', firstName)
    fd.append('lastName', lastName)
    fd.append('description', description)
    fd.append('major', major)

    const headers = new Headers();
    let authorization = localStorage.getItem('token')
    headers.append('Authorization', authorization)

    let settings = {
        method: 'POST',
        headers: headers,
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
            <p>Reload to see changes</p>
            </div>
            `;
            ////console.log(responseJSON)
        })
        .catch(err => {
            results.innerHTML = `<div>${err.message}</div>`;
        });
}

function getPersonByFirstNameFetch(firstName) {
    let url = "/cd-microfluidics/getPerson/" + firstName;

    const headers = new Headers();
    let authorization = localStorage.getItem('token')
    headers.append('Authorization', authorization)

    let settings = {
        method: 'GET',
        headers: headers
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
                        <img alt="Person Image " src = " ${responseJSON[i].personImage}" >
                    </div>
                    <div class = "peopleDescription">
                        <h2 alt="Person Name ">${responseJSON[i].firstName} ${responseJSON[i].lastName}</h2>
                        <h3 alt="Person Major ">${responseJSON[i].major}</h3>
                        <p alt="Person Description ">${responseJSON[i].description}</p>
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

    const headers = new Headers();
    let authorization = localStorage.getItem('token')
    headers.append('Authorization', authorization)

    let settings = {
        method: 'GET',
        headers: headers
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
                        <img alt="Person Image " src = " ${responseJSON.personImage}" >
                    </div>
                    <div class = "peopleDescription">
                        <h2 alt="Person Name ">${responseJSON.firstName} ${responseJSON.lastName}</h2>
                        <h3 alt="Person Major ">${responseJSON.major}</h3>
                        <p alt="Person Description ">${responseJSON.description}</p>
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

    const headers = new Headers();
    let authorization = localStorage.getItem('token')
    headers.append('Authorization', authorization)

    let settings = {
        method: 'DELETE',
        headers: headers
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
            //console.log(res)
        })
        .catch(err => {
            results.innerHTML = `<div>${err.message}</div>`;
        });
}

function updatePersonFetch(id, firstName, lastName, description, major, personImage) {
    //console.log("update person fetch")
    let url = "/cd-microfluidics/updatePerson/" + id;

    const fd = new FormData();
    fd.append('personImage', personImage)
    fd.append('firstName', firstName)
    fd.append('lastName', lastName)
    fd.append('description', description)
    fd.append('major', major)
    fd.append('id', id)

    const headers = new Headers();
    let authorization = localStorage.getItem('token')
    headers.append('Authorization', authorization)

    let settings = {
        method: 'PATCH',
        headers: headers,
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
            ////console.log(responseJSON)
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
function getProjectsFetchPublic() {
    //console.log('get projects fetch public')
    let url = '/cd-microfluidics/projects'

    let settings = {
        method: 'GET'
    }

    let results = document.getElementById('projects');

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
                    <div class = "publicationsContent">
                        <div class = "publicationsImage">
                            <img  alt="Project Image "src = " ${responseJSON[i].projectImage}">
                        </div>
                        <div class = "ProjectsDescription">
                            <h5 alt="Project Date ">Date:${responseJSON[i].date}</h5>
                            <h2 alt="Project Title ">${responseJSON[i].title}</h2>
                            <p alt="Project Description ">${responseJSON[i].description}</p>
                            <a alt="Project Link " href=${responseJSON[i].url}>Link to Project</a>
                        </div>
                    </div>
                </div>
                `
                watchCommentButton()
            }
        })
        .catch(err => {
            results.innerHTML = `<div>${err.message}</div>`;
        });
}

function getProjectsFetch() {
    //console.log('get projects fetch')
    let url = '/cd-microfluidics/projects'

    const headers = new Headers();
    let authorization = localStorage.getItem('token')
    headers.append('Authorization', authorization)

    let settings = {
        method: 'GET',
        headers: headers
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
                    <div class = "publicationsContent">
                        <div class = "publicationsImage">
                            <img  alt="Project Image "src = " ${responseJSON[i].projectImage}">
                        </div>
                        <div class = "ProjectsDescription">
                            <h5 alt="Project Date ">Date:${responseJSON[i].date}</h5>
                            <h2 alt="Project Title ">${responseJSON[i].title}</h2>
                            <p alt="Project Description ">${responseJSON[i].description}</p>
                            <a alt="Project Link " href=${responseJSON[i].url}>Link to Project</a>
                            <p> id : ${responseJSON[i].id}</p>
                        </div>
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
    //console.log('add project fetch')
    let postUrl = '/cd-microfluidics/createProject'

    // //console.log(projectImage)
    // //console.log(typeof (projectImage))

    const fd = new FormData();
    fd.append('projectImage', projectImage)
    fd.append('title', title)
    fd.append('description', description)
    fd.append('url', url)
    fd.append('date', date)

    const headers = new Headers();
    let authorization = localStorage.getItem('token')
    headers.append('Authorization', authorization)

    let settings = {
        method: 'POST',
        headers: headers,
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
            <p>Reload to see changes</p>
            </div>
            `;
            ////console.log(responseJSON)
        })
        .catch(err => {
            results.innerHTML = `<div>${err.message}</div>`;
        });
}

function getProjectByTitleFetch(title) {
    //console.log('get project by title fetch')
    let url = '/cd-microfluidics/getProject/' + title;

    const headers = new Headers();
    let authorization = localStorage.getItem('token')
    headers.append('Authorization', authorization)

    let settings = {
        method: 'GET',
        headers: headers
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
                    <div class = "publicationsContent">
                        <div class = "publicationsImage">
                            <img  alt="Project Image "src = " ${responseJSON[i].projectImage}">
                        </div>
                        <div class = "ProjectsDescription">
                            <h5 alt="Project Date ">Date:${responseJSON[i].date}</h5>
                            <h2 alt="Project Title ">${responseJSON[i].title}</h2>
                            <p alt="Project Description ">${responseJSON[i].description}</p>
                            <a alt="Project Link " href=${responseJSON[i].url}>Link to Project</a>
                            <p alt="Project Id ">id : ${responseJSON[i].id}</p>
                        </div>
                    </div>
                </div>
                `
            }
        })
        .catch(err => {
            results.innerHTML = `<div>${err.message}</div>`;
        });
}

function getProjectByTitleForBook(title) {
    //console.log('get project by title for bookmark')
    let url = '/cd-microfluidics/getProject/' + title;
    let projId = []
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
                projId.push(responseJSON[i].id)
            }
        })
        .catch(err => {
            results.innerHTML = `<div>${err.message}</div>`;
        });
    return projId
}

function getProjectByIdFetch(id) {
    //console.log('get project by id fetch')
    let reqUrl = '/cd-microfluidics/getProjectByID/' + id;

    const headers = new Headers();
    let authorization = localStorage.getItem('token')
    headers.append('Authorization', authorization)

    let settings = {
        method: 'GET',
        headers: headers
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
                    <div class = "publicationsContent">
                        <div class = "publicationsImage">
                            <img  alt="Project Image "src = " ${responseJSON.projectImage}">
                        </div>
                        <div class = "ProjectsDescription">
                            <h5 alt="Project Date ">Date:${responseJSON.date}</h5>
                            <h2 alt="Project Title ">${responseJSON.title}</h2>
                            <p alt="Project Description ">${responseJSON.description}</p>
                            <a alt="Project Link " href=${responseJSON.url}>Link to Project</a>
                            <p alt="Project Id ">id : ${responseJSON.id}</p>
                        </div>
                    </div>
                </div>
                `
        })
        .catch(err => {
            results.innerHTML = `<div>${err.message}</div>`;
        });

}

function deleteProjectFetch(id) {
    //console.log('delete project fetch')
    let url = '/cd-microfluidics/deleteProject/' + id

    const headers = new Headers();
    let authorization = localStorage.getItem('token')
    headers.append('Authorization', authorization)

    let settings = {
        method: 'DELETE',
        headers: headers
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
            //console.log(res)
        })
        .catch(err => {
            results.innerHTML = `<div>${err.message}</div>`;
        });
}

function updateProjectFetch(id, title, description, url, date, projectImage) {
    //console.log('update project fetch')
    let reqUrl = '/cd-microfluidics/updateProject/' + id;

    const fd = new FormData();
    fd.append('projectImage', projectImage)
    fd.append('title', title)
    fd.append('description', description)
    fd.append('url', url)
    fd.append('date', date)
    fd.append('id', id)


    const headers = new Headers();
    let authorization = localStorage.getItem('token')
    headers.append('Authorization', authorization)

    let settings = {
        method: 'PATCH',
        headers: headers,
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
            // //console.log(responseJSON)
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

function watchCommentButton() {
    let buttons = document.querySelectorAll('.postPublicationComment')

    for (let i = 0; i < buttons.length; i++) {
        //console.log(buttons[i])
        buttons[i].addEventListener('submit', event => {
            event.preventDefault();
            //console.log('clicked ' + i)
        })
    }
}

// -------------------------- PUBLICATIONS FETCH --------------------------

function getPublicationsFetchPublic() {
    //console.log('get publications fetch')
    let url = '/cd-microfluidics/publications'

    let settings = {
        method: 'GET'
    }

    let results = document.getElementById('publications');

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
                    <div class = "publicationsContent">
                        <div class = "publicationsImage">
                            <img alt = "Publication Image" src = " ${responseJSON[i].publicationImage}">
                        </div>
                        <div class = "publicationsDescription">
                            <h5 alt = "Publication Date">Date:${responseJSON[i].date}</h5>
                            <h2 alt = "Publication Title">${responseJSON[i].title}</h2>
                            <p alt = "Publication Description">${responseJSON[i].description}</p>
                            <a alt = "Publication Link" href=${responseJSON[i].url}>Link to Publication</a>
                        </div>
                    </div>`
                responseJSON[i].comments.forEach(comment => {
                    results.innerHTML += `
                    <div class = "publicationsComments">
                        <div class = "commentsBox" >
                            <div>
                                <h5 alt = "Publication Comment title"> ${comment.title} </h5> 
                                <p alt = "Publication Comment Author"> ${comment.author.firstName} ${comment.author.lastName}  </p> 
                                <p alt = "Publication Comment Content" >
                                ${comment.content}
                                </p> 
                            </div> 
                        </div>
                    </div>
                </div>
                        `
                })

            }
        })
        .catch(err => {
            results.innerHTML = `<div>${err.message}</div>`;
        });
}

function getPublicationsFetch() {
    //console.log('get publications fetch')
    let url = '/cd-microfluidics/publications'

    const headers = new Headers();
    let authorization = localStorage.getItem('token')
    headers.append('Authorization', authorization)

    let settings = {
        method: 'GET',
        headers: headers
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
                        <img alt = "Publication Image " src = " ${responseJSON[i].publicationImage}">
                    </div>
                    <div class = "publicationsDescription">
                        <h5 alt = "Publication Date ">Date:${responseJSON[i].date}</h5>
                        <h2 alt = "Publication Title ">${responseJSON[i].title}</h2>
                        <p alt = "Publication Description ">${responseJSON[i].description}</p>
                        <a alt = "Publication URL "href=${responseJSON[i].url}>Link to Publication</a>
                        <p alt = "Publication ID ">id : ${responseJSON[i].id}</p>
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
    //console.log('add publication fetch')
    let postUrl = '/cd-microfluidics/createPublication'

    const fd = new FormData();
    fd.append('publicationImage', publicationImage)
    fd.append('title', title)
    fd.append('description', description)
    fd.append('url', url)
    fd.append('date', date)

    const headers = new Headers();
    let authorization = localStorage.getItem('token')
    headers.append('Authorization', authorization)

    let settings = {
        method: 'POST',
        headers: headers,
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
            <p>Reload to see changes</p>
            </div>
            `;
            ////console.log(responseJSON)
        })
        .catch(err => {
            results.innerHTML = `<div>${err.message}</div>`;
        });
}

function getPublicationByTitleFetch(title) {
    //console.log('get publication by title fetch')
    let url = '/cd-microfluidics/getPublication/' + title;

    const headers = new Headers();
    let authorization = localStorage.getItem('token')
    headers.append('Authorization', authorization)

    let settings = {
        method: 'GET',
        headers: headers
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
                        <img src = " ${responseJSON[i].publicationImage}">
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

function getPublicationByTitleForComment(title) {
    //console.log('get publication by title for comment fetch')
    let url = '/cd-microfluidics/getPublication/' + title;
    let pubIdArr = []
    //console.log(title)
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
                //console.log(responseJSON[i].id)
                pubIdArr.push(responseJSON[i].id)
            }
        })
        .catch(err => {
            results.innerHTML = `<div>${err.message}</div>`;
        });
    return pubIdArr;
}

function getPublicationByIdFetch(id) {
    //console.log('get publication by id fetch')
    let reqUrl = '/cd-microfluidics/getPublicationByID/' + id;

    const headers = new Headers();
    let authorization = localStorage.getItem('token')
    headers.append('Authorization', authorization)

    let settings = {
        method: 'GET',
        headers: headers
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
                        <img src = " ${responseJSON.publicationImage}">
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
    //console.log('delete publication fetch')
    let url = '/cd-microfluidics/deletePublication/' + id

    const headers = new Headers();
    let authorization = localStorage.getItem('token')
    headers.append('Authorization', authorization)

    let settings = {
        method: 'DELETE',
        headers: headers
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
            //console.log(res)
        })
        .catch(err => {
            results.innerHTML = `<div>${err.message}</div>`;
        });
}

function updatePublicationFetch(id, title, description, url, date, publicationImage) {
    //console.log('update publication fetch')
    let reqUrl = '/cd-microfluidics/updatePublication/' + id;

    const fd = new FormData();
    fd.append('publicationImage', publicationImage)
    fd.append('title', title)
    fd.append('description', description)
    fd.append('url', url)
    fd.append('date', date)
    fd.append('id', id)


    const headers = new Headers();
    let authorization = localStorage.getItem('token')
    headers.append('Authorization', authorization)

    let settings = {
        method: 'PATCH',
        headers: headers,
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
            // //console.log(responseJSON)
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
function getPicturesFetchPublic() {
    //console.log("get pictures fetch")
    let url = '/cd-microfluidics/pictures';

    let settings = {
        method: 'GET'
    }

    let results = document.getElementById('galleryBox');

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
                    <img src = "${responseJSON[i].image}">
                    <p>${responseJSON[i].description}</p>
                </div>
                `
                //the responseJSON[i].image stores the path to get to the uploads folder
            }
        })
        .catch(err => {
            results.innerHTML = `<div>${err.message}</div>`;
        });

}

function getPicturesFetch() {
    //console.log("get pictures fetch")
    let url = '/cd-microfluidics/pictures';

    const headers = new Headers();
    let authorization = localStorage.getItem('token')
    headers.append('Authorization', authorization)

    let settings = {
        method: 'GET',
        headers: headers
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
                    <img src = "${responseJSON[i].image}">
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
    //console.log("add picture fetch")
    let postUrl = '/cd-microfluidics/createPicture';
    //form data send the image as an object, in the request the file is sent in the files section
    const fd = new FormData();
    fd.append('image', imgFile)
    fd.append('description', description)

    const headers = new Headers();
    let authorization = localStorage.getItem('token')
    headers.append('Authorization', authorization)

    let settings = {
        method: 'POST',
        headers: headers,
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
            <p>Reload to see changes</p>
            </div>
            `;
            ////console.log(responseJSON)
        })
        .catch(err => {
            results.innerHTML = `<div>${err.message}</div>`;
        });
}

function getPictureByIDFetch(id) {
    //console.log('get picture by id fetch')
    let reqUrl = '/cd-microfluidics/getPictureByID/' + id;

    const headers = new Headers();
    let authorization = localStorage.getItem('token')
    headers.append('Authorization', authorization)

    let settings = {
        method: 'GET',
        headers: headers
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
            ////console.log(responseJSON.image)

            results.innerHTML += `
                <div class ="galleryImg">
                    <img src = " ${responseJSON.image}">
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
    //console.log('delete picture fetch')
    let url = '/cd-microfluidics/deletePicture/' + id

    const headers = new Headers();
    let authorization = localStorage.getItem('token')
    headers.append('Authorization', authorization)

    let settings = {
        method: 'DELETE',
        headers: headers
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
            //console.log(res)
        })
        .catch(err => {
            results.innerHTML = `<div>${err.message}</div>`;
        });
}

function updatePictureFetch(id, description, imgFile) {
    //console.log('update publication fetch')
    let reqUrl = '/cd-microfluidics/updatePicture/' + id;

    const fd = new FormData();
    fd.append('image', imgFile)
    fd.append('description', description)
    fd.append('id', id)

    const headers = new Headers();
    let authorization = localStorage.getItem('token')
    headers.append('Authorization', authorization)

    let settings = {
        method: 'PATCH',
        headers: headers,
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
            // //console.log(responseJSON)
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

// -------------------------- USERS FETCH --------------------------
function addNewUserFetch(firstName, lastName, email, password) {
    //console.log("add user fetch")
    let postUrl = '/cd-microfluidics/createUser';

    let newUser = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
    }

    let settings = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
    }

    let results = document.querySelector('.welcomeBanner');
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
            <h1> welcome ${firstName} ${lastName}!</h1>
            </div>
            `;
        })
        .catch(err => {
            results.innerHTML = `<div>${err.message}</div>`;
        });
}

function addNewAdminFetch(firstName, lastName, email, password) {
    //console.log("add admin fetch")
    let postUrl = '/cd-microfluidics/createAdmin';

    let newAdmin = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
    }
    const headers = new Headers();
    let authorization = localStorage.getItem('token')
    headers.append('Content-Type', 'application/json')
    headers.append('Authorization', authorization)

    let settings = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(newAdmin)
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
            <h1>new admin added :^)</h1>
            <p>Reload to see changes</p>
            </div>
            `;
            ////console.log(responseJSON)
        })
        .catch(err => {
            results.innerHTML = `<div>${err.message}</div>`;
        });
}

function loginFetch(email, password) {
    //console.log("login fetch")
    let postUrl = '/cd-microfluidics/login';

    let userLogin = {
        email: email,
        password: password,
    }
    const headers = new Headers();
    let authorization = localStorage.getItem('token')
    headers.append('Content-Type', 'application/json')
    headers.append('Authorization', authorization)
    //console.log(authorization)

    let settings = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userLogin)
    }

    let results = document.querySelector('.welcomeBanner');
    let loginBar = document.querySelector('.LoginBar')
    let logOutDiv = document.querySelector('.logOutDiv')

    fetch(postUrl, settings)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJSON => {
            localStorage.setItem('token', responseJSON.token)
            localStorage.setItem('userId', responseJSON.id)
            results.innerHTML = `<div>
            <h1> welcome ${responseJSON.firstName} ${responseJSON.lastName}</h1>
            </div>
            `;
            if (responseJSON.isAdmin) {
                showAdminSections();
                redirectHomePage();
            } else {

                showCommentBookmarkForms()
                redirectHomePage();
                hideAdminSections();
            }
            logOutDiv.classList.remove('hidden')
            loginBar.classList.add('hidden')

        })
        .catch(err => {
            //console.log(err)
            results.innerHTML = `<div>${err.message}</div>`;
        });
}

function getUserByEmail(email) {
    let url = "/cd-microfluidics/getUser/" + email;

    const headers = new Headers();
    let authorization = localStorage.getItem('token')
    headers.append('Authorization', authorization)

    let settings = {
        method: 'GET',
        headers: headers
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
            results.innerHTML += `
                <div class ="people">
                    <div class = "peopleDescription">
                        <h2>${responseJSON.firstName} ${responseJSON.lastName}</h2>
                        <h3>${responseJSON.email}</h3>
                        <p>Admin: ${responseJSON.isAdmin}</p>
                        <p>id : ${responseJSON.id}</p>
                    </div>
                </div>
                `
        })
        .catch(err => {
            results.innerHTML = `<div>${err.message}</div>`;
        });

}

function deleteUserFetch(id) {
    let url = '/cd-microfluidics/deleteUser/' + id;

    const headers = new Headers();
    let authorization = localStorage.getItem('token')
    headers.append('Authorization', authorization)

    let settings = {
        method: 'DELETE',
        headers: headers
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
            //console.log(res)
        })
        .catch(err => {
            results.innerHTML = `<div>${err.message}</div>`;
        });
}

function getUsersFetch() {
    //console.log("get users fetch")
    let url = '/cd-microfluidics/users';

    const headers = new Headers();
    let authorization = localStorage.getItem('token')
    headers.append('Authorization', authorization)

    let settings = {
        method: 'GET',
        headers: headers
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
                        <h3>${responseJSON[i].email}</h3>
                        <p>Admin: ${responseJSON[i].isAdmin}</p>
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

// -------------------------- USERS ADMIN FORMS --------------------------


function watchLoginForm() {
    let loginButton = document.getElementById('loginButton')
    let email = document.getElementById('username')
    let password = document.getElementById('password')

    loginButton.addEventListener('click', event => {
        loginFetch(email.value, password.value)
    });
}

function watchNewUserForm() {

    let firstNameUser = document.getElementById('firstNameUser')
    let lastNameUser = document.getElementById('lastNameUser')
    let emailUser = document.getElementById('usernameUser')
    let passwordUser = document.getElementById('passwordUser')

    let logOutButton = document.getElementById('logOutButton')
    let logOutDiv = document.querySelector('.logOutDiv')
    let loginBar = document.querySelector('.LoginBar')
    let registerUserBtn = document.getElementById('registerUserBtn')

    let loginUser = document.getElementById('loginUser')



    registerUserBtn.addEventListener('click', event => {
        addNewUserFetch(firstNameUser.value, lastNameUser.value, emailUser.value, passwordUser.value);

        let registerUser = document.getElementById('registerUser')
        let loginUser = document.getElementById('loginUser')
        registerUser.classList.add('hidden')
        loginUser.classList.add('hidden')

        logOutDiv.classList.remove('hidden')

        loginBar.classList.add('hidden')
    });

    logOutButton.addEventListener('click', event => {
        loginBar.classList.remove('hidden');
        logOutDiv.classList.add('hidden');
        loginUser.classList.remove('hidden')
        hideAdminSections();

        let results = document.querySelector('.results');
        results.innerHTML = ""
        let welcomeBanner = document.querySelector('.welcomeBanner');
        welcomeBanner.innerHTML = ""
        redirectHomePage()

    })

}

function watchNewAdminForm() {
    let registerAdmin = document.getElementById('registerAdmin')
    let getAllUsers = document.getElementById('getAllUsers')

    let firstNameAdmin = document.getElementById('firstNameAdmin')
    let lastNameAdmin = document.getElementById('lastNameAdmin')
    let emailAdmin = document.getElementById('usernameAdmin')
    let passwordAdmin = document.getElementById('passwordAdmin')

    registerAdmin.addEventListener('submit', event => {
        event.preventDefault()
        addNewAdminFetch(firstNameAdmin.value, lastNameAdmin.value, emailAdmin.value, passwordAdmin.value);
    });

    getAllUsers.addEventListener('click', event => {
        getUsersFetch();
    })
}

function watchGetUserByEmail() {
    let getByEmail = document.getElementById('get-user-by-email')

    let email = document.getElementById('userEmailFilter')

    getByEmail.addEventListener('submit', event => {
        event.preventDefault()
        getUserByEmail(email.value)

    });
}

function watchDeleteUserByID() {
    let deleteById = document.getElementById('delete-user-by-id')

    let deleteUser = document.getElementById('deleteUser')

    deleteById.addEventListener('submit', event => {
        event.preventDefault()
        deleteUserFetch(deleteUser.value)
    });
}

// -------------------------- BOOKMARK  FORMS --------------------------
function addBookmarkFetch(idProj) {
    //console.log("add comment fetch")
    let postUrl = '/cd-microfluidics/createBookmark';
    let id = localStorage.getItem('userId')

    let newBookmark = {
        idUser: id,
        idProj: idProj
    }
    //console.log(newBookmark)

    let settings = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newBookmark)
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
            <h1> Bookmark Added, refresh to see update!</h1>
            </div>
            `;

        })
        .catch(err => {
            results.innerHTML = `<div>${err.message}</div>`;
        });
}

function watchAddBookmarkForm() {
    let form = document.getElementById('add-bookmark-form')
    let projectID = document.getElementById('projectTitleBook')
    let getTitleBook = document.getElementById('getTitleBook')
    let projId = [];

    getTitleBook.addEventListener('click', event => {
        //console.log(projectID.value)
        projId = getProjectByTitleForBook(projectID.value)
        //console.log(projId)
    });

    form.addEventListener('submit', click => {
        event.preventDefault()
        addBookmarkFetch(projId[0])
    })

}

function getProjectByIdBookmark(id) {
    let reqUrl = '/cd-microfluidics/getProjectByID/' + id;

    let settings = {
        method: 'GET',
    }

    let results = document.getElementById('userBookmarks')
    fetch(reqUrl, settings)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJSON => {
            results.innerHTML += `
                <div class ="publications">
                    <div class = "publicationsImage">
                        <img src = " ${responseJSON.projectImage}">
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
            //console.log(err)
            //results.innerHTML = `<div>${err.message}</div>`;
        });

}

function getProjectsFetchBookmarks() {
    //console.log('get projects fetch bookmark')
    let id = localStorage.getItem('userId')

    let url = '/cd-microfluidics/getUserID/' + id
    let settings = {
        method: 'GET'
    }
    let results = document.getElementById('projects');

    fetch(url, settings)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJSON => {
            //console.log("hola aqui estoy")

            responseJSON.projects.forEach(project => {
                getProjectByIdBookmark(project)
            })
        })
        .catch(err => {
            results.innerHTML = `<div>${err.message}</div>`;
        });
}

// -------------------------- COMMENT  FORMS --------------------------

function addCommentFetch(pubId, title, content) {
    //console.log("add comment fetch")
    let postUrl = '/cd-microfluidics/createComment';
    let id = localStorage.getItem('userId')

    let newComment = {
        title: title,
        content: content,
        idUser: id,
        idPost: pubId,
    }

    let settings = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newComment)
    }

    let results = document.querySelector('.welcomeBanner');
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
            <h1> Comment Added, refresh to see update!</h1>
            </div>
            `;
        })
        .catch(err => {
            results.innerHTML = `<div>${err.message}</div>`;
        });
}

function watchAddCommentForm() {
    let form = document.getElementById('add-comment-form')
    let publicationTitle = document.getElementById('publicationTitleCom')
    let commentTitle = document.getElementById('commentTitle')
    let commentContent = document.getElementById('commentContent')
    let getTitleForComment = document.getElementById('getTitleForComment')

    let pubId = [];

    getTitleForComment.addEventListener('click', event => {
        //console.log(publicationTitle.value)
        pubId = getPublicationByTitleForComment(publicationTitle.value)
    });

    form.addEventListener('submit', click => {
        event.preventDefault()
        //console.log(pubId[0], commentTitle.value, commentContent.value)
        addCommentFetch(pubId[0], commentTitle.value, commentContent.value)
    })
}

// -------------------------- MAPS ADMIN FORMS --------------------------
function getMarkersFetchPublic() {
    //console.log("get markers fetch")
    let url = '/cd-microfluidics/markers';

    let settings = {
        method: 'GET'
    }
    fetch(url, settings)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(results => {
            results.forEach((result) => {
                createMarkerForDisplay(result.lat, result.long, result.content)
            })
        })
        .catch(err => {
            results.innerHTML = `<div>${err.message}</div>`;
        });

}

function getMarkersFetch() {
    //console.log("get markers fetch")
    let url = '/cd-microfluidics/markers';

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
                    <div class ="peopleDescription">
                        <h2>${responseJSON[i].content}</h2>
                        <p>Lat: ${responseJSON[i].lat}</p>
                        <p>Long : ${responseJSON[i].long}</p>
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

function createMarkerForDisplay(lat, long, content) {
    const marker = new google.maps.Marker({
        position: {
            lat: lat,
            lng: long
        },
        map: map
    });

    var infoWindow = new google.maps.InfoWindow({
        content: content
    });
    marker.addListener('click', () => {
        infoWindow.open(map, marker);
    });
}

function addNewMarkerFetch(lat, long, content) {
    //console.log("add marker fetch")
    let postUrl = '/cd-microfluidics/marker';

    let newMarker = {
        lat: lat,
        long: long,
        content: content
    }

    let settings = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newMarker)
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
            <h1> Marker Added!</h1>
            </div>
            `;
            getMarkersFetchPublic();
        })
        .catch(err => {
            results.innerHTML = `<div>${err.message}</div>`;
        });
}

function deleteMarkerFetch(id) {
    let url = '/cd-microfluidics/deleteMarker/' + id;

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
                <p>Reload to see changes in map</p>
                </div>
                `
                getMarkersFetchPublic();
                return response;
            }
            throw new Error(response.statusText);
        }).then(res => {
            //console.log(res)
        })
        .catch(err => {
            results.innerHTML = `<div>${err.message}</div>`;
        });
}
// -------------------------- MENU --------------------------

function redirectHomePage() {
    let homeBtn = document.getElementById('homeMenu')

    let pastOption = document.querySelector('.activeOption');
    pastOption.classList.remove('activeOption');
    homeBtn.classList.add('activeOption');

    let pastSection = document.querySelector('.selectedSection')
    pastSection.classList.remove('selectedSection')
    pastSection.classList.add('hidden')

    let homeSection = document.getElementById('home')
    homeSection.classList.remove('hidden');
    homeSection.classList.add('selectedSection')

    let results = document.querySelector('.results');
    results.innerHTML = ""
    let commentForm = document.getElementById('addCommentSection')
    let bookmarksForm = document.getElementById('addBookmarkSection')
    let userBookmarks = document.getElementById('userBookmarks')

    commentForm.classList.add('hidden')
    bookmarksForm.classList.add('hidden')
    userBookmarks.classList.add('hidden')

}

function watchMenu() {
    let homeBtn = document.getElementById('homeMenu')
    let projectsBtn = document.getElementById('projectsMenu')
    let peopleBtn = document.getElementById('peopleMenu')
    let publicationsBtn = document.getElementById('publicationsMenu')
    let galleryBtn = document.getElementById('galleryMenu')
    let mapsBtn = document.getElementById('mapsMenu')

    let logOutButton = document.getElementById('logOutButton')
    let logOutDiv = document.querySelector('.logOutDiv')
    let loginBar = document.querySelector('.LoginBar')

    let addCommentSection = document.getElementById('addCommentSection')
    let addBookmarkSection = document.getElementById('addBookmarkSection')
    let userBookmarks = document.getElementById('userBookmarks')


    logOutButton.addEventListener('click', event => {
        loginBar.classList.remove('hidden');
        logOutDiv.classList.add('hidden');
        hideAdminSections();

        addCommentSection.classList.add('hidden')
        addBookmarkSection.classList.add('hidden')
        userBookmarks.classList.add('hidden')
        let welcomeBanner = document.querySelector('.welcomeBanner');
        welcomeBanner.innerHTML = ""
        redirectHomePage()
    })


    let unhideRegister = document.getElementById('unhideRegister')
    unhideRegister.addEventListener('click', event => {
        let registerUser = document.getElementById('registerUser')
        let loginUser = document.getElementById('loginUser')
        registerUser.classList.remove('hidden')
        loginUser.classList.add('hidden')
    });

    let backToLogin = document.getElementById('backToLogin')
    backToLogin.addEventListener('click', event => {
        let registerUser = document.getElementById('registerUser')
        let loginUser = document.getElementById('loginUser')
        registerUser.classList.add('hidden')
        loginUser.classList.remove('hidden')
    });


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

        let results = document.querySelector('.results');
        results.innerHTML = ""




        getProjectsFetchPublic();
    });

    peopleBtn.addEventListener('click', event => {
        //console.log("people menu")
        let pastOption = document.querySelector('.activeOption');
        pastOption.classList.remove('activeOption');
        peopleBtn.classList.add('activeOption');

        let pastSection = document.querySelector('.selectedSection')
        pastSection.classList.remove('selectedSection')
        pastSection.classList.add('hidden')

        let peopleSection = document.getElementById('people')
        peopleSection.classList.remove('hidden');
        peopleSection.classList.add('selectedSection')

        let results = document.querySelector('.results');
        results.innerHTML = ""




        getPeopleFetchPublic();
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

        let results = document.querySelector('.results');
        results.innerHTML = ""
        getPublicationsFetchPublic()
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

        let results = document.querySelector('.results');
        results.innerHTML = ""




        getPicturesFetchPublic()
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

function showAdminSections() {
    let adminSection = document.getElementById('homeAdmin')
    adminSection.classList.remove('hidden')
    adminSection.classList.add('selectedAdmin');

    let commentSection = document.querySelector('.publicationsComments')
    commentSection.classList.remove('hidden');

    let homeBtn = document.getElementById('homeMenu')
    let projectsBtn = document.getElementById('projectsMenu')
    let peopleBtn = document.getElementById('peopleMenu')
    let publicationsBtn = document.getElementById('publicationsMenu')
    let galleryBtn = document.getElementById('galleryMenu')
    let mapsBtn = document.getElementById('mapsMenu')


    let commentForm = document.getElementById('addCommentSection')
    let bookmarksForm = document.getElementById('addBookmarkSection')
    let userBookmarks = document.getElementById('userBookmarks')

    commentForm.classList.remove('hidden')
    bookmarksForm.classList.remove('hidden')
    userBookmarks.classList.remove('hidden')

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

        commentForm.classList.add('hidden')
        bookmarksForm.classList.add('hidden')
        userBookmarks.classList.add('hidden')


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
        commentForm.classList.add('hidden')


        bookmarksForm.classList.remove('hidden')
        userBookmarks.classList.remove('hidden')
        getProjectsFetchBookmarks()


        getProjectsFetchPublic();
    });

    peopleBtn.addEventListener('click', event => {
        //console.log("people menu")
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
        commentForm.classList.add('hidden')
        bookmarksForm.classList.add('hidden')
        userBookmarks.classList.add('hidden')



        getPeopleFetchPublic();
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

        bookmarksForm.classList.add('hidden')
        userBookmarks.classList.add('hidden')

        commentForm.classList.remove('hidden')


        getPublicationsFetchPublic()
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
        commentForm.classList.add('hidden')
        bookmarksForm.classList.add('hidden')
        userBookmarks.classList.add('hidden')



        getPicturesFetchPublic()
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
        commentForm.classList.add('hidden')
        bookmarksForm.classList.add('hidden')
        userBookmarks.classList.add('hidden')


    });
}

function hideAdminSections() {
    let homeAdminSection = document.getElementById('homeAdmin')
    homeAdminSection.classList.add('hidden')
    homeAdminSection.classList.remove('selectedAdmin');

    let projectsAdminSection = document.getElementById('projectsAdmin')
    projectsAdminSection.classList.add('hidden')
    projectsAdminSection.classList.remove('selectedAdmin');

    let peopleAdminSection = document.getElementById('peopleAdmin')
    peopleAdminSection.classList.add('hidden')
    peopleAdminSection.classList.remove('selectedAdmin');

    let publicationsAdminSection = document.getElementById('publicationsAdmin')
    publicationsAdminSection.classList.add('hidden')
    publicationsAdminSection.classList.remove('selectedAdmin');

    let galleryAdminSection = document.getElementById('galleryAdmin')
    galleryAdminSection.classList.add('hidden')
    galleryAdminSection.classList.remove('selectedAdmin');

    let mapsAdminSection = document.getElementById('mapsAdmin')
    mapsAdminSection.classList.add('hidden')
    mapsAdminSection.classList.remove('selectedAdmin');
}

function showCommentBookmarkForms() {
    let commentForm = document.getElementById('addCommentSection')
    let bookmarksForm = document.getElementById('addBookmarkSection')
    let userBookmarks = document.getElementById('userBookmarks')

    let homeBtn = document.getElementById('homeMenu')
    let projectsBtn = document.getElementById('projectsMenu')
    let peopleBtn = document.getElementById('peopleMenu')
    let publicationsBtn = document.getElementById('publicationsMenu')
    let galleryBtn = document.getElementById('galleryMenu')
    let mapsBtn = document.getElementById('mapsMenu')


    commentForm.classList.remove('hidden')
    bookmarksForm.classList.remove('hidden')
    userBookmarks.classList.remove('hidden')

    homeBtn.addEventListener('click', event => {
        commentForm.classList.add('hidden')
        bookmarksForm.classList.add('hidden')
        userBookmarks.classList.add('hidden')
    })

    peopleBtn.addEventListener('click', event => {
        commentForm.classList.add('hidden')
        bookmarksForm.classList.add('hidden')
        userBookmarks.classList.add('hidden')
    })

    projectsBtn.addEventListener('click', event => {
        commentForm.classList.add('hidden')


        bookmarksForm.classList.remove('hidden')
        userBookmarks.classList.remove('hidden')
        getProjectsFetchBookmarks()
    })

    publicationsBtn.addEventListener('click', event => {
        bookmarksForm.classList.add('hidden')
        userBookmarks.classList.add('hidden')

        commentForm.classList.remove('hidden')

    })

    galleryBtn.addEventListener('click', event => {
        commentForm.classList.add('hidden')
        bookmarksForm.classList.add('hidden')
        userBookmarks.classList.add('hidden')
    })

    mapsBtn.addEventListener('click', event => {
        commentForm.classList.add('hidden')
        bookmarksForm.classList.add('hidden')
        userBookmarks.classList.add('hidden')
    })

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

function initMap() {

    let form = document.getElementById('add-marker')
    let lat = document.getElementById('latitude')
    let long = document.getElementById('longitude')
    let content = document.getElementById('content')
    let getMarkers = document.getElementById('getMarkers')
    let markerID = document.getElementById('markerID')
    let deleteMarker = document.getElementById('delete-marker')


    form.addEventListener('submit', event => {
        event.preventDefault();
        addNewMarkerFetch(lat.value, long.value, content.value);
    })

    deleteMarker.addEventListener('submit', event => {
        event.preventDefault();
        deleteMarkerFetch(markerID.value);
    })

    getMarkers.addEventListener('click', event => {
        getMarkersFetch();
    })

    getMarkersFetchPublic();

}



function init() {
    showSlides();
    watchMenu();

    //users
    watchLoginForm();
    watchNewUserForm();
    watchNewAdminForm();
    watchGetUserByEmail();
    watchDeleteUserByID();

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

    //comments and bookmarks
    watchAddCommentForm();
    watchAddBookmarkForm();





    initMap();
}

init();