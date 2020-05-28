const mongoose = require('mongoose');
/*
projects {
    id: string,
    title: string,
    description: string,
    picture: string,
    comments[
        comment: {
            author: {
                firstName: String,
                lastName: String
            },
            title: string,
            content: content
        },
        comment: {
            author: {
                firstName: String,
                lastName: String
            },
            title: string,
            content: content
        }
    ]
}

 */
const publicationsSchema = mongoose.Schema({
    id: {
        type: String,
        unique: true,
        required: true,
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    publicationImage: {
        type: String,
        required: true
    },
    comments: [{
        required: false,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comments'
    }]
});


const publicationCollection = mongoose.model('publications', publicationsSchema);



const Publications = {
    createPublication: function (newPublication) {
        return publicationCollection
            .create(newPublication)
            .then(createdPublication => {
                return createdPublication;
            })
            .catch(err => {
                throw new Error(err);
            });
    },
    getPublications: function () {
        return publicationCollection
            .find()
            .populate({
                path: 'comments',
                populate: {
                    path: 'author'
                }
            })
            .then(allPublications => {
                return allPublications;
            })
            .catch(err => {
                throw new Error(err);
            })
    },
    getPublicationByTitle: function (query) {
        return publicationCollection
            .find({
                title: query
            })
            .then(resultByTitle => {
                return resultByTitle;
            })
            .catch(err => {
                return err;
            })
    },
    getPublicationById: function (idPublication) {
        return publicationCollection
            .findOne({
                id: idPublication
            })
            .then(publication => {
                if (!publication) {
                    throw new Error('publication not found');
                }
                return publication
            })
            .catch(err => {
                throw new Error(err);
            });
    },
    deletePublicationById: function (query) {
        return publicationCollection
            .deleteOne({
                id: query
            })
            .then(publicationToDelete => {
                return publicationToDelete;
            })
            .catch(err => {
                return err;
            });
    },
    patchPublicationById: function (id, title, description, url, date, publicationImage) {
        return publicationCollection
            .updateOne({
                id: id
            }, {
                $set: {
                    title: title,
                    description: description,
                    url: url,
                    date: date,
                    publicationImage: publicationImage
                }
            })
            .then(updatedPublication => {
                return updatedPublication;
            })
            .catch(err => {
                return err;
            })
    },
    updateComments: function (id, comments) {
        return publicationCollection
            .findOneAndUpdate({
                id: id
            }, {
                $set: {
                    comments
                }
            }, {
                new: true
            })
            .populate({
                path: 'comments',
                populate: {
                    path: 'author'
                }
            })
            .then(publication => {
                return publication
            })
            .catch(err => {
                return err;
            })

    }

}


module.exports = {
    Publications
}