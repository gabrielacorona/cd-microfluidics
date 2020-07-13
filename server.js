const express = require('express');

const mongoose = require('mongoose');
const morgan = require('morgan');
const uuid = require('uuid');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const multer = require('multer');
const jsonParser = bodyParser.json();
const cors = require('./middleware/cors');
const checkAdmin = require('./middleware/check-admin-auth');
const checkUser = require('./middleware/check-user-auth');
const awsWorker = require('./aws.controller');
const s3 = require('./s3.config');

const fs = require('fs')



let today = new Date();
let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
let dateTime = date + ' ' + time;

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './uploads/')
//     },
//     filename: function (req, file, cb) {
//         cb(null, dateTime + " " + file.originalname)
//     }
// });
var storage = multer.memoryStorage({
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
} = require('./config/config');

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

const {
    Pictures
} = require('./models/pictures-model');

const {
    Comments
} = require('./models/comments-model');

const {
    Markers
} = require('./models/maps-model');

const app = express();

app.use('/uploads', express.static('uploads'))
app.use(cors);
app.use(express.static("public"));
app.use(morgan('dev'));

////------------------>PICTURES ENDPOINTS<------------------
//get all pictures
app.get('/cd-microfluidics/pictures', (req, res) => {
    console.log("getting all pictures owo")
    Pictures
        .getPictures()
        .then(pictures => {
            return res.status(200).json(pictures);
        })
        .catch(err => {
            res.statusMessage = "Something went wrong while retrieving the pictures";
            return res.status(500).end()
        })
});

//get picture by id
app.get('/cd-microfluidics/getPictureByID/:id', checkAdmin, (req, res) => {
    console.log("getting a picture by their id =w=");
    let id = req.params.id;
    if (!id) {
        res.statusMessage = "please send 'ID' as a param";
        return res.status(406).end();
    }
    Pictures
        .getPictureByID(id)
        .then(person => {
            if (person.length === 0) {
                console.log(person)
                res.statusMessage = `no pictures with the provided id ${id}"`;
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

app.post('/cd-microfluidics/createPicture', upload.any(), awsWorker.doUpload)

//delete a picture by their id
app.delete('/cd-microfluidics/deletePicture/:id', checkAdmin, (req, res) => {
    console.log("deleting a picture u.u")
    let id = req.params.id;
    console.log(id);
    Pictures
        .getPictureByID(id)
        .then(pictureToRemove => {
            if (pictureToRemove.length === 0) {
                res.statusMessage = "id not found";
                return res.status(404).end();
            } else {
                //delete file from the filesystem
                const path = './' + pictureToRemove.image
                fs.unlink(path, (err) => {
                    if (err) {
                        console.log(err)
                        return
                    }
                });
                Pictures
                    .deletePictureByID(id)
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

//update a picture by their id (sent as a param)
app.patch('/cd-microfluidics/updatePicture/:id', checkAdmin, upload.any(), (req, res) => {
    console.log("updating a picture owo")

    let image = req.files[0].path
    let description = req.body.description;

    let id = req.params.id;

    if (!id) {
        res.statusMessage = "missing id, verify  query"
        return res.status(406).end();
    }

    Pictures
        .getPictureByID(id)
        .then(pictureToUpdate => {
            if (pictureToUpdate.length === 0) {
                res.statusMessage = "id not found";
                return res.status(404).end();
            } else {
                console.log(pictureToUpdate)
                Pictures
                    .patchPictureByID(id, description, image)
                    .then(result => {
                        console.log("Entra", result)
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

////------------------>USER ENDPOINTS<------------------
//Create a new Admin
app.post('/cd-microfluidics/createAdmin', checkAdmin, jsonParser, (req, res) => {
    bcrypt.hash(req.body.password, 5, (err, hash) => {
        if (err) {
            res.statusMessage = "Something went wrong with the DB. Try again later.";
            return res.status(500).end();
        } else {
            let id = uuid.v4();
            let firstName = req.body.firstName;
            let lastName = req.body.lastName;
            let email = req.body.email;
            let password = hash;
            let isAdmin = true;
            if (!email || !password) {
                res.statusMessage = "missing param";
                console.log(req.body.title);
                return res.status(406).end(); //not accept status
            }
            let newUser = {
                id,
                firstName,
                lastName,
                email,
                password,
                isAdmin
            };
            console.log(newUser)
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

//Create a new user
app.post('/cd-microfluidics/createUser', jsonParser, (req, res) => {
    Users
        .getUserByEmail(req.body.email)
        .then(user => {
            if (user) {
                res.statusMessage = "Mail already exists, please try with another email"
                return res.status(409).end()
            } else {
                bcrypt.hash(req.body.password, 5, (err, hash) => {
                    if (err) {
                        res.statusMessage = "Something went wrong with the DB. Try again later.";
                        return res.status(500).end();
                    } else {
                        let id = uuid.v4();
                        let firstName = req.body.firstName;
                        let lastName = req.body.lastName;
                        let email = req.body.email;
                        let password = hash;
                        let isAdmin = false;
                        if (!email || !password) {
                            res.statusMessage = "missing param";
                            console.log(req.body.title);
                            return res.status(406).end(); //not accept status
                        }
                        let newUser = {
                            id,
                            firstName,
                            lastName,
                            email,
                            password,
                            isAdmin,
                            bookmarks: []
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
            bcrypt.compare(password, user.password, (err, result) => {
                if (err) {
                    res.statusMessage = "Auth failed.";
                    return res.status(401).end();
                }
                if (result) {
                    const token = jwt.sign({
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        id: user.id,
                        isAdmin: user.isAdmin
                    }, JWT_KEY, {
                        expiresIn: "1h"

                    });
                    res.statusMessage = "Auth successful.";
                    //console.log(token)
                    result = {
                        id: user.id,
                        email: user.id,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        isAdmin: user.isAdmin,
                        token: token
                    }
                    return res.status(200).json(result);
                }
                res.statusMessage = "Auth failed.";
                return res.status(401).end();
            });
        })
        .catch(err => {
            console.log(err)
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
            console.log(users.projects)
            return res.status(200).json(users);
        })
        .catch(err => {
            res.statusMessage = "Something went wrong while retrieving the users";
            return res.status(500).end()
        })
});

//get user by email
app.get('/cd-microfluidics/getUser/:email', checkAdmin, (req, res) => {
    console.log("getting a user by their email :^o");
    let email = req.params.email;
    console.log(email)
    if (!email) {
        res.statusMessage = "please send 'Email' as a param";
        return res.status(406).end(); //not accept status
    }
    Users
        .getUserByEmail(email)
        .then(person => {
            if (person.length === 0) {
                console.log(person)
                res.statusMessage = `no user with the provided email ${email}"`;
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

//get user by id
app.get('/cd-microfluidics/getUserID/:id', (req, res) => {
    console.log("getting a user by their id =w=");
    let id = req.params.id;
    console.log(id)
    if (!id) {
        res.statusMessage = "please send 'ID' as a param";
        return res.status(406).end();
    }
    Users
        .getUserById(id)
        .then(user => {
            if (user.length === 0) {
                console.log(user)
                res.statusMessage = `no user with the provided id ${id}"`;
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
app.delete('/cd-microfluidics/deleteUser/:id', checkAdmin, (req, res) => {
    console.log("deleting a user u.u")
    let id = req.params.id;
    console.log(req.headers)
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
app.get('/cd-microfluidics/getPerson/:firstName', checkAdmin, (req, res) => {
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
app.get('/cd-microfluidics/getPersonByID/:id', checkAdmin, (req, res) => {
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
app.post('/cd-microfluidics/createPerson', upload.any(), awsWorker.createPerson)

//delete a person by their id
app.delete('/cd-microfluidics/deletePerson/:id', checkAdmin, (req, res) => {
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
                //delete file from the filesystem
                const path = './' + personToRemove.personImage
                fs.unlink(path, (err) => {
                    if (err) {
                        console.log(err)
                        return
                    }
                });
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
app.patch('/cd-microfluidics/updatePerson/:id', checkAdmin, upload.any(), (req, res) => {
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
            console.log(publications.comments)
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
app.get('/cd-microfluidics/getPublicationByID/:id', checkAdmin, (req, res) => {
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
app.post('/cd-microfluidics/createPublication', upload.any(), awsWorker.createPublication)

//delete a publication by their id
app.delete('/cd-microfluidics/deletePublication/:id', checkAdmin, (req, res) => {
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

                const path = './' + publicationToRemove.publicationImage
                fs.unlink(path, (err) => {
                    if (err) {
                        console.log(err)
                        return
                    }
                });
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
app.patch('/cd-microfluidics/updatePublication/:id', checkAdmin, upload.any(), (req, res) => {
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

//create a new project
app.post('/cd-microfluidics/createProject', upload.any(), awsWorker.createProject)

//delete a project by their id
app.delete('/cd-microfluidics/deleteProject/:id', checkAdmin, (req, res) => {
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
                const path = './' + projectToRemove.projectImage
                fs.unlink(path, (err) => {
                    if (err) {
                        console.log(err)
                        return
                    }
                });
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
app.patch('/cd-microfluidics/updateProject/:id', checkAdmin, upload.any(), (req, res) => {
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
////------------------>BOOKMARKS ENDPOINTS<------------------

app.post('/cd-microfluidics/createBookmark', jsonParser, (req, res) => {
    const {
        idUser,
        idProj
    } = req.body;
    console.log(idProj)
    Users
        .getUserById(idUser)
        .then(user => {
            Projects
                .getProjectById(idProj)
                .then(proj => {
                    let bookmarkArr = user.projects
                    bookmarkArr.push(proj.id)
                    Users
                        .updateBookmarks(user.id, bookmarkArr)
                        .then(userBookMark => {
                            console.log(userBookMark)
                            return res.status(201).json(user);
                        })
                        .catch(err => {
                            console.log(err)
                            res.statusMessage = "Something went wrong when updating bookmark.";
                            return res.status(400).end();
                        });
                }).catch(err => {
                    console.log(err)
                    res.statusMessage = "Something went wrong when getting proj.";
                    return res.status(400).end();
                });

        }).catch(err => {
            res.statusMessage = `Something went wrong: ${err.message}.`;
            return res.status(400).end();
        });

});


////------------------>COMMENTS ENDPOINTS<------------------

//get all comments
app.get('/cd-microfluidics/comments', (req, res) => {
    Comments
        .getAllComments()
        .then(comments => {
            return res.status(200).json(comments);
        })
        .catch(err => {
            res.statusMessage = "Something went wrong when retrieving the Comments.";
            return res.status(400).end();
        });
});

app.post('/cd-microfluidics/createComment', jsonParser, (req, res) => {
    const {
        title,
        content,
        idUser,
        idPost
    } = req.body;
    console.log(idUser);
    Users
        .getUserById(idUser)
        .then(author => {

            Publications
                .getPublicationById(idPost)
                .then(post => {
                    const newComment = {
                        title,
                        content,
                        author: author._id,
                        idPost: post.id
                    }
                    Comments
                        .createComment(newComment)
                        .then(createdComment => {
                            //return res.status(201).json(createdComment);
                            let commentArr = post.comments
                            commentArr.push(createdComment)

                            Publications
                                .updateComments(post.id, commentArr)
                                .then(newCommPub => {
                                    return res.status(201).json(newCommPub);
                                })
                        })
                        .catch(err => {
                            console.log(newComment, err)
                            res.statusMessage = "Something went wrong when creating the Comment.";
                            return res.status(400).end();
                        });
                })
        })
        .catch(err => {
            res.statusMessage = `Something went wrong: ${err.message}.`;
            return res.status(400).end();
        });

});

//delete a comment by their id
app.delete('/cd-microfluidics/deleteComment/:id', (req, res) => {
    console.log("deleting a comment u.u")
    let id = req.params.id;
    Comments
        .getCommentByID(id)
        .then(commentToRemove => {
            if (commentToRemove.length === 0) {
                res.statusMessage = "id not found";
                return res.status(404).end();
            } else {
                Comments
                    .deleteCommentById(id)
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


////------------------>MARKERS ENDPOINTS<------------------

//create a new marker
app.post('/cd-microfluidics/marker', jsonParser, (req, res) => {
    console.log("adding a new marker to the map B^)");

    const {
        lat,
        long,
        content
    } = req.body;

    if (!lat || !long || !content) {
        res.statusMessage = "missing param";
        console.log(req.body.title);
        return res.status(406).end(); //not accept status
    }
    let id = uuid.v4();

    let newMarker = {
        id,
        lat,
        long,
        content
    };

    Markers
        .createMarker(newMarker)
        .then(result => {
            return res.status(201).json(result);
        })
        .catch(err => {
            console.log(err)
            res.statusMessage = "Something went wrong with the DB. Try again later.";
            return res.status(500).end();
        })

});

//get all markers
app.get('/cd-microfluidics/markers', (req, res) => {
    console.log("getting all markers owo")
    Markers
        .getMarkers()
        .then(markers => {
            return res.status(200).json(markers);
        })
        .catch(err => {
            res.statusMessage = "Something went wrong while retrieving the projects";
            return res.status(500).end()
        })
})

//delete a marker by  id
app.delete('/cd-microfluidics/deleteMarker/:id', (req, res) => {
    console.log("deleting a marker u.u")
    let id = req.params.id;
    console.log(id);
    Markers
        .getMarkerById(id)
        .then(MarkerToRemove => {
            if (MarkerToRemove.length === 0) {
                res.statusMessage = "id not found";
                return res.status(404).end();
            } else {
                Markers
                    .deleteMarkerById(id)
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



////------------------>SERVER<------------------
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
            mongoose.disconnect();
            console.log(err);
        });
});