const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const uuid = require('uuid');
const bodyParser = require('body-parser');
const {
    DATABASE_URL,
    PORT
} = require('./config');

const {
    People
} = require('./models/people-model');


const app = express();

app.use(express.static("public"));
app.use(morgan('dev'));

const jsonParser = bodyParser.json();


//get all people
app.get('/cd-microfluidics/people', (req, res) => {
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

//create a new person
app.post('/cd-microfluidics/createPerson', jsonParser, (req, res) => {
    console.log("adding a new person to the lab B^)");

    const {
        firstName,
        lastName,
        description,
        major
    } = req.body;

    if (!firstName || !lastName || !description || !major) {
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
        major
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
app.patch('/cd-microfluidics/updatePerson/:id', jsonParser, (req, res) => {
    console.log("updating a person")

    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let description = req.body.description;
    let major = req.body.major;

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
                    .patchById(id, firstName, lastName, description, major)
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