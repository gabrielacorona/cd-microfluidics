const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const uuid = require('uuid');
const bodyParser = require('body-parser');

const multer = require('multer');
const jsonParser = bodyParser.json();
const cors = require('./middleware/cors');

let today = new Date();
let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
let dateTime = date + ' ' + time;

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, dateTime + " " + file.originalname)
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    limits: {
        //5mb limit
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

const {
    DATABASE_URL,
    PORT
} = require('./config');

const {
    People
} = require('./models/people-model');

const {
    Publications
} = require('./models/publications-model');

const {
    Projects
} = require('./models/projects-model');


const app = express();

app.use('/uploads', express.static('uploads'))
app.use(cors);
app.use(express.static("public"));
app.use(morgan('dev'));




////------------------>PEOPLE ENDPOINTS<------------------
//get all people
app.get('/cd-microfluidics/people', (req, res) => {
    console.log("getting all people owo")
    People
        .getPeople()
        .then(people => {
            return res.status(200).json(people);
        })
        .catch(err => {
            res.statusMessage = "Something went wrong while retrieving the people";
            return res.status(500).end()
        })
})

//get person by firstName
app.get('/cd-microfluidics/getPerson/:firstName', (req, res) => {
    console.log("getting a person by their first name :^o");
    let firstName = req.params.firstName;
    console.log(firstName)
    if (!firstName) {
        res.statusMessage = "please send 'First Name' as a param";
        return res.status(406).end(); //not accept status
    }
    People
        .getPersonByFirstName(firstName)
        .then(person => {
            if (person.length === 0) {
                console.log(person)
                res.statusMessage = `no people with the provided firstName ${firstName}"`;
                return res.status(404).end();
            } else {
                return res.status(200).json(person);
            }
        })
        .catch(err => {
            res.statusMessage = "Something went wrong with the DB. Try again later.";
            return res.status(500).end();
        });
});

//get person by id
app.get('/cd-microfluidics/getPersonByID/:id', (req, res) => {
    console.log("getting a person by their id =w=");
    let id = req.params.id;
    if (!id) {
        res.statusMessage = "please send 'ID' as a param";
        return res.status(406).end();
    }
    People
        .getPersonById(id)
        .then(person => {
            if (person.length === 0) {
                console.log(person)
                res.statusMessage = `no people with the provided id ${id}"`;
                return res.status(404).end();
            } else {
                return res.status(200).json(person);
            }
        })
        .catch(err => {
            res.statusMessage = "Something went wrong with the DB. Try again later.";
            return res.status(500).end();
        });
});

//create a new person
app.post('/cd-microfluidics/createPerson', upload.single('personImage'), jsonParser, (req, res) => {
    console.log(req.file);
    console.log("adding a new person to the lab B^)");
    let personImage = req.file.path
    const {
        firstName,
        lastName,
        description,
        major
    } = req.body;
    console.log(!firstName, !lastName, !description, !major)
    if (!firstName || !lastName || !description || !major || !personImage) {
        res.statusMessage = "missing param";
        console.log(req.body.title);
        return res.status(406).end(); //not accept status
    }
    let id = uuid.v4();

    let newPerson = {
        id,
        firstName,
        lastName,
        description,
        major,
        personImage
    };

    People
        .createPerson(newPerson)
        .then(result => {
            return res.status(201).json(result);
        })
        .catch(err => {
            res.statusMessage = "Something went wrong with the DB. Try again later.";
            return res.status(500).end();
        })

});

//delete a person by their id
app.delete('/cd-microfluidics/deletePerson/:id', (req, res) => {
    console.log("deleting a person u.u")
    let id = req.params.id;
    console.log(id);
    People
        .getPersonById(id)
        .then(personToRemove => {
            if (personToRemove.length === 0) {
                res.statusMessage = "id not found";
                return res.status(404).end();
            } else {
                People
                    .deletePersonById(id)
                    .then(result => {
                        res.statusMessage = "successfully deleted"
                        return res.status(200).end();
                    })
                    .catch(err => {
                        res.statusMessage = "Something went wrong with the DB. Try again later.";
                        return res.status(500).end();
                    });
            }
        })
        .catch(err => {
            res.statusMessage = "Something went wrong with the DB. Try again later.";
            return res.status(500).end();
        });

});

//update a person by their id (sent as a param)
app.patch('/cd-microfluidics/updatePerson/:id', upload.single('personImage'), jsonParser, (req, res) => {
    console.log("updating a person owo")

    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let description = req.body.description;
    let major = req.body.major;
    let personImage = req.file.path;


    let id = req.params.id;

    if (!id) {
        res.statusMessage = "missing id, verify  query"
        return res.status(406).end();
    }

    People
        .getPersonById(id)
        .then(personToUpdate => {
            if (personToUpdate.length === 0) {
                res.statusMessage = "id not found";
                return res.status(404).end();
            } else {
                People
                    .patchPersonById(id, firstName, lastName, description, major, personImage)
                    .then(result => {
                        if (!result) {
                            res.statusMessage = "Id not found";
                            return res.status(404).end();
                        } else {
                            res.statusMessage = "updated successfully";
                            return res.status(200).json(result);
                        }
                    })
                    .catch(err => {
                        res.statusMessage = "Something went wrong with the DB. Try again later.";
                        return res.status(500).end();
                    })
            }
        })
        .catch(err => {
            res.statusMessage = "Something went wrong with the DB. Try again later.";
            return res.status(500).end();
        })
});



////------------------>PUBLICATIONS ENDPOINTS<------------------
//get all publications
app.get('/cd-microfluidics/publications', (req, res) => {
    console.log("getting all publications owo")
    Publications
        .getPublications()
        .then(publications => {
            return res.status(200).json(publications);
        })
        .catch(err => {
            res.statusMessage = "Something went wrong while retrieving the publications";
            return res.status(500).end()
        })
})

//get publication by title
app.get('/cd-microfluidics/getPublication/:title', (req, res) => {
    console.log("getting a publication by the title :^o");
    let title = req.params.title;
    console.log(title)
    if (!title) {
        res.statusMessage = "please send 'Title' as a param";
        return res.status(406).end(); //not accept status
    }
    Publications
        .getPublicationByTitle(title)
        .then(publication => {
            if (publication.length === 0) {
                console.log(publication)
                res.statusMessage = `no publications with the provided title ${title}"`;
                return res.status(404).end();
            } else {
                return res.status(200).json(publication);
            }
        })
        .catch(err => {
            res.statusMessage = "Something went wrong with the DB. Try again later.";
            return res.status(500).end();
        });
});

//get publication by id
app.get('/cd-microfluidics/getPublicationByID/:id', (req, res) => {
    console.log("getting a publication by their id =w=");
    let id = req.params.id;
    if (!id) {
        res.statusMessage = "please send 'ID' as a param";
        return res.status(406).end();
    }
    Publications
        .getPublicationById(id)
        .then(publication => {
            if (publication.length === 0) {
                console.log(publication)
                res.statusMessage = `no publication with the provided id ${id}"`;
                return res.status(404).end();
            } else {
                return res.status(200).json(publication);
            }
        })
        .catch(err => {
            res.statusMessage = "Something went wrong with the DB. Try again later.";
            return res.status(500).end();
        });
});


//create a new publication
app.post('/cd-microfluidics/createPublication', upload.single('publicationImage'), jsonParser, (req, res) => {
    console.log("adding a new publication to the lab B^)");
    let publicationImage = req.file.path;
    const {
        title,
        description,
        url,
        date
    } = req.body;

    if (!title || !description || !url || !date || !publicationImage) {
        res.statusMessage = "missing param";
        console.log(req.body.title);
        return res.status(406).end(); //not accept status
    }
    let id = uuid.v4();

    let newPublication = {
        id,
        title,
        description,
        url,
        date,
        publicationImage
    };

    Publications
        .createPublication(newPublication)
        .then(result => {
            return res.status(201).json(result);
        })
        .catch(err => {
            res.statusMessage = "Something went wrong with the DB. Try again later.";
            return res.status(500).end();
        })

});

//delete a publication by their id
app.delete('/cd-microfluidics/deletePublication/:id', (req, res) => {
    console.log("deleting a publication u.u")
    let id = req.params.id;
    console.log(id);
    Publications
        .getPublicationById(id)
        .then(publicationToRemove => {
            if (publicationToRemove.length === 0) {
                res.statusMessage = "id not found";
                return res.status(404).end();
            } else {
                Publications
                    .deletePublicationById(id)
                    .then(result => {
                        res.statusMessage = "successfully deleted"
                        return res.status(200).end();
                    })
                    .catch(err => {
                        res.statusMessage = "Something went wrong with the DB. Try again later.";
                        return res.status(500).end();
                    });
            }
        })
        .catch(err => {
            res.statusMessage = "Something went wrong with the DB. Try again later.";
            return res.status(500).end();
        });

});

//update a publication by their id (sent as a param)
app.patch('/cd-microfluidics/updatePublication/:id', upload.single('publicationImage'), jsonParser, (req, res) => {
    console.log("updating a publication owo")

    let title = req.body.title;
    let description = req.body.description;
    let url = req.body.url;
    let date = req.body.date;
    let publicationImage = req.file.path;
    let id = req.params.id;

    if (!id) {
        res.statusMessage = "missing id, verify  query"
        return res.status(406).end();
    }

    Publications
        .getPublicationById(id)
        .then(publicationToUpdate => {
            if (publicationToUpdate.length === 0) {
                res.statusMessage = "id not found";
                return res.status(404).end();
            } else {
                Publications
                    .patchPublicationById(id, title, description, url, date, publicationImage)
                    .then(result => {
                        if (!result) {
                            res.statusMessage = "Id not found";
                            return res.status(404).end();
                        } else {
                            res.statusMessage = "updated successfully";
                            return res.status(200).json(result);
                        }
                    })
                    .catch(err => {
                        res.statusMessage = "Something went wrong with the DB. Try again later.";
                        return res.status(500).end();
                    })
            }
        })
        .catch(err => {
            res.statusMessage = "Something went wrong with the DB. Try again later.";
            return res.status(500).end();
        })
});



////------------------>PROJECTS ENDPOINTS<------------------
//get all projects
app.get('/cd-microfluidics/projects', (req, res) => {
    console.log("getting all projects owo")
    Projects
        .getProjects()
        .then(projects => {
            return res.status(200).json(projects);
        })
        .catch(err => {
            res.statusMessage = "Something went wrong while retrieving the projects";
            return res.status(500).end()
        })
})

//get project by title
app.get('/cd-microfluidics/getProject/:title', (req, res) => {
    console.log("getting a project by the title :^o");

    let title = req.params.title;

    if (!title) {
        res.statusMessage = "please send 'Title' as a param";
        return res.status(406).end(); //not accept status
    }
    Projects
        .getProjectByTitle(title)
        .then(project => {
            if (project.length === 0) {
                console.log(project)
                res.statusMessage = `no projects with the provided title ${title}"`;
                return res.status(404).end();
            } else {
                return res.status(200).json(project);
            }
        })
        .catch(err => {
            res.statusMessage = "Something went wrong with the DB. Try again later.";
            return res.status(500).end();
        });
});

//get project by id
app.get('/cd-microfluidics/getProjectByID/:id', (req, res) => {
    console.log("getting a project by their id =w=");
    let id = req.params.id;
    if (!id) {
        res.statusMessage = "please send 'ID' as a param";
        return res.status(406).end();
    }
    Projects
        .getProjectById(id)
        .then(project => {
            if (project.length === 0) {
                console.log(project)
                res.statusMessage = `no project with the provided id ${id}"`;
                return res.status(404).end();
            } else {
                return res.status(200).json(project);
            }
        })
        .catch(err => {
            res.statusMessage = "Something went wrong with the DB. Try again later.";
            return res.status(500).end();
        });
});

//create a new project
app.post('/cd-microfluidics/createProject', upload.single('projectImage'), jsonParser, (req, res) => {
    console.log("adding a new project to the lab B^)");
    let projectImage = req.file.path;
    const {
        title,
        description,
        url,
        date
    } = req.body;

    if (!title || !description || !url || !date || !projectImage) {
        res.statusMessage = "missing param";
        console.log(req.body.title);
        return res.status(406).end(); //not accept status
    }
    let id = uuid.v4();

    let newProject = {
        id,
        title,
        description,
        url,
        date,
        projectImage
    };

    Projects
        .createProject(newProject)
        .then(result => {
            return res.status(201).json(result);
        })
        .catch(err => {
            res.statusMessage = "Something went wrong with the DB. Try again later.";
            return res.status(500).end();
        })
});

//delete a project by their id
app.delete('/cd-microfluidics/deleteProject/:id', (req, res) => {
    console.log("deleting a project u.u")
    let id = req.params.id;
    console.log(id);
    Projects
        .getProjectById(id)
        .then(projectToRemove => {
            if (projectToRemove.length === 0) {
                res.statusMessage = "id not found";
                return res.status(404).end();
            } else {
                Projects
                    .deleteProjectById(id)
                    .then(result => {
                        res.statusMessage = "successfully deleted"
                        return res.status(200).end();
                    })
                    .catch(err => {
                        res.statusMessage = "Something went wrong with the DB. Try again later.";
                        return res.status(500).end();
                    });
            }
        })
        .catch(err => {
            res.statusMessage = "Something went wrong with the DB. Try again later.";
            return res.status(500).end();
        });

});

//update a project by their id (sent as a param)
app.patch('/cd-microfluidics/updateProject/:id', upload.single('projectImage'), jsonParser, (req, res) => {
    console.log("updating a project owo")

    let title = req.body.title;
    let description = req.body.description;
    let url = req.body.url;
    let date = req.body.date;
    let projectImage = req.file.path;

    let id = req.params.id;

    if (!id) {
        res.statusMessage = "missing id, verify  query"
        return res.status(406).end();
    }

    Projects
        .getProjectById(id)
        .then(projectToUpdate => {
            if (projectToUpdate.length === 0) {
                res.statusMessage = "id not found";
                return res.status(404).end();
            } else {
                Projects
                    .patchProjectById(id, title, description, url, date, projectImage)
                    .then(result => {
                        if (!result) {
                            res.statusMessage = "Id not found";
                            return res.status(404).end();
                        } else {
                            res.statusMessage = "updated successfully";
                            return res.status(200).json(result);
                        }
                    })
                    .catch(err => {
                        res.statusMessage = "Something went wrong with the DB. Try again later.";
                        return res.status(500).end();
                    })
            }
        })
        .catch(err => {
            res.statusMessage = "Something went wrong with the DB. Try again later.";
            return res.status(500).end();
        })
});


app.listen(PORT, () => {
    console.log("This server is RUNNING ㅇㅅㅇ");

    new Promise((resolve, reject) => {
            const settings = {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true
            };

            mongoose.connect(DATABASE_URL, settings, (err) => {
                if (err) {
                    return reject(err);
                } else {
                    console.log("Database connected successfully :^)")
                    return resolve();
                }
            })
        })
        .catch(err => {
            console.log(err);
        });
});