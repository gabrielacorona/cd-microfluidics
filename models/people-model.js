const mongoose = require('mongoose');

const peopleSchema = mongoose.Schema({
    id: {
        type: String,
        unique: true,
        required: true,
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    major: {
        type: String,
        required: true
    },
    personImage: {
        type: String,
        required: true
    }
});

const peopleCollection = mongoose.model('people', peopleSchema);


const People = {
    createPerson: function (newPerson) {
        return peopleCollection
            .create(newPerson)
            .then(createdPerson => {
                return createdPerson;
            })
            .catch(err => {
                throw new Error(err);
            });
    },
    //get all people
    getPeople: function () {
        return peopleCollection
            .find()
            .then(allPeople => {
                return allPeople;
            })
            .catch(err => {
                throw new Error(err);
            })
    },
    getPersonByFirstName: function (query) {
        return peopleCollection
            .find({
                firstName: query
            })
            .then(resultByName => {
                return resultByName;
            })
            .catch(err => {
                return err;
            })
    },
    getPersonById: function (idUser) {
        return peopleCollection
            .findOne({
                id: idUser
            })
            .then(person => {
                if (!person) {
                    throw new Error('Person not found');
                }
                return person
            })
            .catch(err => {
                throw new Error(err);
            });
    },
    deletePersonById: function (query) {
        return peopleCollection
            .deleteOne({
                id: query
            })
            .then(personToDelete => {
                return personToDelete;
            })
            .catch(err => {
                return err;
            });
    },
    patchPersonById: function (id, firstName, lastName, description, major, personImage) {
        return peopleCollection
            .updateOne({
                id: id
            }, {
                $set: {
                    firstName: firstName,
                    lastName: lastName,
                    description: description,
                    major: major,
                    personImage: personImage
                }
            })
            .then(updatedPerson => {
                return updatedPerson;
            })
            .catch(err => {
                return err;
            })
    }

}



module.exports = {
    People
}