const mongoose = require('mongoose');

const usersSchema = mongoose.Schema({
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
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true
    },
    projects: [{
        required: false,
        type: mongoose.Schema.Types.String,
        ref: 'projects'
    }]
});

const usersCollection = mongoose.model('users', usersSchema);


const Users = {
    createUser: function (newUser) {
        return usersCollection
            .create(newUser)
            .then(createdUser => {
                return createdUser;
            })
            .catch(err => {
                throw new Error(err);
            });
    },
    //get all people
    getUsers: function () {
        return usersCollection
            .find()
            .then(users => {
                return users;
            })
            .catch(err => {
                console.log(err)
                throw new Error(err);
            })
    },
    getUserById: function (idUser) {
        return usersCollection
            .findOne({
                id: idUser
            })
            .then(user => {
                if (!user) {
                    throw new Error('User not found');
                }
                return user
            })
            .catch(err => {
                console.log(err)
                throw new Error(err);
            });
    },
    getUserByEmail: function (query) {
        return usersCollection
            .findOne({
                email: query
            })
            .then(resultByEmail => {
                return resultByEmail;
            })
            .catch(err => {
                return err;
            })
    },
    deleteUserById: function (query) {
        return usersCollection
            .deleteOne({
                id: query
            })
            .then(userToDelete => {
                return userToDelete;
            })
            .catch(err => {
                return err;
            });
    },
    updateBookmarks: function (id, projects) {
        return usersCollection
            .findOneAndUpdate({
                id: id
            }, {
                $set: {
                    projects
                }
            }, {
                new: true
            })
            .populate({
                path: 'projects'
            })
            .then(user => {
                return user
            })
            .catch(err => {
                return err
            })
    }
}



module.exports = {
    Users
}