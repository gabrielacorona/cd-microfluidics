const express = require('express');
const formData = require('express-form-data');

const mongoose = require('mongoose');
const morgan = require('morgan');
const uuid = require('uuid');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const multer = require('multer');
const jsonParser = bodyParser.json();
const cors = require('./middleware/cors');



const textupload = multer();



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
    PORT,
    JWT_KEY
} = require('./config');

const {
    Users
} = require('./models/users-model');

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

////------------------>USER ENDPOINTS<------------------
//Create a new user
app.post('/cd-microfluidics/createUser', jsonParser, (req, res) => {
    bcrypt.hash(req.body.password, 5, (err, hash) => {
        if (err) {
            res.statusMessage = "Something went wrong with the DB. Try again later.";
            return res.status(500).end();
        } else {
            let id = uuid.v4();
            let email = req.body.email;
            let password = hash;
            if (!email || !password) {
                res.statusMessage = "missing param";
                console.log(req.body.title);
                return res.status(406).end(); //not accept status
            }
            let newUser = {
                id,
                email,
                password
            };
            Users
                .createUser(newUser)
                .then(result => {
                    return res.status(201).json(result);
                })
                .catch(err => {
                    res.statusMessage = "Something went wrong with the DB. Try again later.";
                    return res.status(500).end();
                })
        }
    })

});

//login
app.post('/cd-microfluidics/login', jsonParser, (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    Users
        .getUserByEmail(email)
        .then(user => {
            if (user.length === 0) {
                res.statusMessage = "Auth failed.";
                return res.status(401).end();
            }
            bcrypt.compare(password, user[0].password, (err, result) => {
                if (err) {
                    res.statusMessage = "Auth failed.";
                    return res.status(401).end();
                }
                if (result) {
                    const token = jwt.sign({
                        email: user[0].email,
                        id: user[0].id
                    }, JWT_KEY, {
                        expiresIn: "1h"

                    });
                    res.statusMessage = "Auth successful.";
                    console.log(token)
                    return res.status(200).json(result);
                }
                res.statusMessage = "Auth failed.";
                return res.status(401).end();
            });
        })
        .catch(err => {
            res.statusMessage = "Something went wrong with the DB. Try again later.";
            return res.status(500).end();
        })
});


//get all users
app.get('/cd-microfluidics/users', (req, res) => {
    console.log("getting all users owo")
    Users
        .getUsers()
        .then(users => {
            return res.status(200).json(users);
        })
        .catch(err => {
            res.statusMessage = "Something went wrong while retrieving the people";
            return res.status(500).end()
        })
});

//get user by id
app.get('/cd-microfluidics/getUserById/:id', (req, res) => {
    console.log("getting a user by their id =w=");
    let id = req.params.id;
    if (!id) {
        res.statusMessage = "please send 'ID' as a param";
        return res.status(406).end();
    }

    Users
        .getUserById(id)
        .then(user => {
            if (user.length === 0) {
                console.log(user)
                res.statusMessage = `no users with the provided id ${id}"`;
                return res.status(404).end();
            } else {
                return res.status(200).json(user);
            }
        })
        .catch(err => {
            res.statusMessage = "Something went wrong with the DB. Try again later.";
            return res.status(500).end();
        });
});

//delete a user by their id
app.delete('/cd-microfluidics/deleteUser/:id', (req, res) => {
    console.log("deleting a user u.u")
    let id = req.params.id;
    console.log(id);
    Users
        .getUserById(id)
        .then(userToRemove => {
            if (userToRemove.length === 0) {
                res.statusMessage = "id not found";
                return res.status(404).end();
            } else {
                Users
                    .deleteUserById(id)
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

//update a user by their id (sent as a param)
app.patch('/cd-microfluidics/updateUser/:id', jsonParser, (req, res) => {
    console.log("updating a person owo")
    bcrypt.hash(req.body.password, 5, (err, hash) => {
        if (err) {
            res.statusMessage = "Something went wrong with the DB. Try again later.";
            return res.status(500).end();
        } else {
            let email = req.body.email;
            let password = hash;
            let id = req.params.id;

            if (!id) {
                res.statusMessage = "missing id, verify  query"
                return res.status(406).end();
            }

            Users
                .getUserById(id)
                .then(userToUpdate => {
                    if (userToUpdate.length === 0) {
                        res.statusMessage = "id not found";
                        return res.status(404).end();
                    } else {
                        Users
                            .patchUserById(id, email, password)
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
        }
    })
});


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
app.post('/cd-microfluidics/createPerson', upload.any(), (req, res) => {
    console.log("adding a new person to the lab B^)");
    let personImage = req.files[0].path
    const {
        firstName,
        lastName,
        description,
        major
    } = req.body;

    if (!firstName || !lastName || !description || !major || !personImage) {
        res.statusMessage = "missing param";
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
app.patch('/cd-microfluidics/updatePerson/:id', upload.any(), (req, res) => {
    console.log("updating a person owo")
    let personImage = req.files[0].path;
    const {
        firstName,
        lastName,
        description,
        major
    } = req.body;



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
app.post('/cd-microfluidics/createPublication', upload.any(), (req, res) => {
    console.log("adding a new publication to the lab B^)");
    console.log

    let publicationImage = req.files[0].path;
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
app.patch('/cd-microfluidics/updatePublication/:id', upload.any(), (req, res) => {
    console.log("updating a publication owo")

    let publicationImage = req.files[0].path
    const {
        title,
        description,
        url,
        date
    } = req.body;

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


/*
myImage
let imageInfo = $('#myImage')[0].files;
let imgfile = imageInfo.item(0);

let dataF = new FormData();
dataF.append('text', postText)
dataF.append('id', postId);
dataF.append('myImage', imgfile);


https: //github.com/maripal/node-capstone-tasks.git
index add image

*/
//create a new project
app.post('/cd-microfluidics/createProject', upload.any(), (req, res) => {
    console.log("adding a new project to the lab B^)");
    //console.log(req.body)
    //let projectImage = req.file.path;
    //console.log(req.files, "DATA")
    console.log(req.body)
    let projectImage = req.files[0].path
    console.log(req.files)
    const {
        title,
        description,
        url,
        date
    } = req.body;

    if (!title || !description || !url || !date || !projectImage) {
        res.statusMessage = "missing param";
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
app.patch('/cd-microfluidics/updateProject/:id', upload.any(), (req, res) => {
    console.log("updating a project owo")

    let projectImage = req.files[0].path
    const {
        title,
        description,
        url,
        date
    } = req.body;

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