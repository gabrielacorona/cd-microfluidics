const mongoose = require('mongoose');

const markerSchema = mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    lat: {
        type: Number,
        required: true
    },
    long: {
        type: Number,
        required: true
    },
    content: {
        type: String,
        required: true
    }
});
const markerCollection = mongoose.model('markers', markerSchema);

const Markers = {
    createMarker: function (newMarker) {
        return markerCollection
            .create(newMarker)
            .then(createdMarker => {
                return createdMarker;
            })
            .catch(err => {
                throw new Error(err);
            });
    },
    getMarkers: function () {
        return markerCollection
            .find()
            .then(allMarkers => {
                return allMarkers;
            })
            .catch(err => {
                throw new Error(err);
            })
    },
    getMarkerById: function (idMarker) {
        return markerCollection
            .findOne({
                id: idMarker
            })
            .then(marker => {
                if (!marker) {
                    throw new Error('Marker not found');
                }
                return marker
            })
            .catch(err => {
                throw new Error(err);
            });
    },
    deleteMarkerById: function (query) {
        return markerCollection
            .deleteOne({
                id: query
            })
            .then(markerToDelete => {
                return markerToDelete;
            })
            .catch(err => {
                return err;
            });
    }
}

module.exports = {
    Markers
};