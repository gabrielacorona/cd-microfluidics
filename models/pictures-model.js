const mongoose = require('mongoose');

const pictureSchema = mongoose.Schema({
    id: {
        type: String,
        unique: true,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    //the image is stored as the path to the uploads folder, not as an object
    image: {
        type: String,
        required: true
    }

});

const pictureCollection = mongoose.model('pictures', pictureSchema);

const Pictures = {
    createImage: function (newPicture) {
        return pictureCollection
            .create(newPicture)
            .then(createdImage => {
                return createdImage;
            })
            .catch(err => {
                throw new Error(err);
            });
    },
    //get all pictures
    getPictures: function () {
        return pictureCollection
            .find()
            .then(pictures => {
                return pictures;
            })
            .catch(err => {
                throw new Error(err);
            })
    },
    getPictureByID: function (idPicture) {
        return pictureCollection
            .findOne({
                id: idPicture
            })
            .then(picture => {
                if (!picture) {
                    throw new Error('picture not found');
                }
                return picture
            })
            .catch(err => {
                throw new Error(err);
            });
    },
    deletePictureByID: function (query) {
        return pictureCollection
            .deleteOne({
                id: query
            })
            .then(pictureToDelete => {
                return pictureToDelete;
            })
            .catch(err => {
                return err;
            });
    },
    patchPictureByID: function (id, description, image) {
        return pictureCollection
            .updateOne({
                id: id
            }, {
                $set: {
                    description: description,
                    image: image
                }
            })
            .then(updatedPicture => {
                return updatedPicture;
            })
            .catch(err => {
                return err;
            })
    }
}

module.exports = {
    Pictures
}