const mongoose = require('mongoose');

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
    }
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
    }

}


module.exports = {
    Publications
}