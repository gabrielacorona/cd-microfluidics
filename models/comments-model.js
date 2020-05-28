const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        required: true,
        type: mongoose.Schema.Types.String,
        ref: 'users'
    },
    idPost: {
        required: true,
        type: mongoose.Schema.Types.String,
        ref: 'publications'
    }
});
const commentCollection = mongoose.model('comments', commentSchema);

const Comments = {
    createComment: function (newComment) {
        return commentCollection
            .create(newComment)
            .then(createdComment => {
                return createdComment;
            })
            .catch(err => {
                throw new Error(err);
            });
    },
    getAllComments: function () {
        return commentCollection
            .find()
            .populate('author', ['firstName', 'lastName'])
            .then(allComments => {
                return allComments;
            })
            .catch(err => {
                console.log(err)
                throw new Error(err);
            });
    },
    getCommentsByAuthorId: function (authorObjectId) {
        return commentCollection
            .find({
                author: authorObjectId
            })
            .populate('author', ['firstName', 'lastName'])
            .then(allComments => {
                return allComments;
            })
            .catch(err => {
                throw new Error(err);
            });
    },
    getCommentByID: function (idComm) {
        return commentCollection
            .findOne({
                _id: idComm
            })
            .then(comment => {
                if (!comment) {
                    throw new Error('Comment not found');
                }
                return comment
            })
            .catch(err => {
                throw new Error(err);

            });
    },
    deleteCommentById: function (id) {
        return commentCollection
            .deleteOne({
                _id: id
            })
            .then(commentToDelete => {
                return commentToDelete;
            })
            .catch(err => {
                return err;
            })
    }
}

module.exports = {
    Comments
};