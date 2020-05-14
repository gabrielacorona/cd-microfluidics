const mongoose = require('mongoose');

const projectsSchema = mongoose.Schema({
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
    }
});


const projectsCollection = mongoose.model('projects', projectsSchema);

const Projects = {
    createProject: function (newProject) {
        return projectsCollection
            .create(newProject)
            .then(createdProject => {
                return createdProject;
            })
            .catch(err => {
                throw new Error(err);
            });
    },
    getProjects: function () {
        return projectsCollection
            .find()
            .then(allProjects => {
                return allProjects;
            })
            .catch(err => {
                throw new Error(err);
            })
    },
    getProjectByTitle: function (query) {
        return projectsCollection
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
    getProjectById: function (idProject) {
        return projectsCollection
            .findOne({
                id: idProject
            })
            .then(project => {
                if (!project) {
                    throw new Error('Project not found');
                }
                return project
            })
            .catch(err => {
                throw new Error(err);
            });
    },
    deleteProjectById: function (query) {
        return projectsCollection
            .deleteOne({
                id: query
            })
            .then(proectToDelete => {
                return proectToDelete;
            })
            .catch(err => {
                return err;
            });
    },
    patchProjectById: function (id, title, description, url, date) {
        return projectsCollection
            .updateOne({
                id: id
            }, {
                $set: {
                    title: title,
                    description: description,
                    url: url,
                    date: date
                }
            })
            .then(updatedProject => {
                return updatedProject;
            })
            .catch(err => {
                return err;
            })
    }

}


module.exports = {
    Projects
}