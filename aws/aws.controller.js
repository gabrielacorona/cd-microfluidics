var stream = require('stream');

const s3 = require('./s3.config');
const uuid = require('uuid');
const {
	Pictures
} = require('../models/pictures-model');

const {
	People
} = require('../models/people-model');


const {
	Publications
} = require('../models/publications-model');

const {
	Projects
} = require('../models/projects-model');

exports.doUpload = (req, res) => {
	const s3Client = s3.s3Client;
	const params = s3.uploadParams;

	params.Key = req.files[0].originalname;
	params.Body = req.files[0].buffer;

	s3Client.upload(params, (err, data) => {
		if (err) {
			res.status(500).json({
				error: "Error -> " + err
			});
		}

		let id = uuid.v4();
		let image = data.Location
		let description = req.body.description;

		let newPicture = {
			id,
			description,
			image
		};
		Pictures
			.createImage(newPicture)
			.then(result => {
				return res.status(201).json(result);
			})
			.catch(err => {
				console.log(err)
				res.statusMessage = "Something went wrong with the DB. Try again later.";
				return res.status(500).end();
			})

	});
}

exports.createPerson = (req, res) => {
	const s3Client = s3.s3Client;
	const params = s3.uploadParams;

	params.Key = req.files[0].originalname;
	params.Body = req.files[0].buffer;

	s3Client.upload(params, (err, data) => {
		if (err) {
			res.status(500).json({
				error: "Error -> " + err
			});
		}

		const {
			firstName,
			lastName,
			description,
			major
		} = req.body;
		let id = uuid.v4();
		let personImage = data.Location
		if (!firstName || !lastName || !description || !major) {
			res.statusMessage = "missing param";
			return res.status(406).end(); //not accept status
		}

		let newPerson = {
			id,
			firstName,
			lastName,
			description,
			major,
			personImage
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
	})
}

exports.createPublication = (req, res) => {
	const s3Client = s3.s3Client;
	const params = s3.uploadParams;

	params.Key = req.files[0].originalname;
	params.Body = req.files[0].buffer;

	s3Client.upload(params, (err, data) => {
		if (err) {
			res.status(500).json({
				error: "Error -> " + err
			});
		}

		const {
			title,
			description,
			url,
			date
		} = req.body;

		let id = uuid.v4();
		let publicationImage = data.Location
		if (!title || !description || !url || !date) {
			res.statusMessage = "missing param";
			console.log(req.body.title);
			return res.status(406).end(); //not accept status
		}


		let newPublication = {
			id,
			title,
			description,
			url,
			date,
			publicationImage,
			comments: []
		};

		Publications
			.createPublication(newPublication)
			.then(result => {
				return res.status(201).json(result);
			})
			.catch(err => {
				res.statusMessage = "Something went wrong with the DB. Try again later.";
				return res.status(500).end();
			})
	})
}

exports.createProject = (req, res) => {
	const s3Client = s3.s3Client;
	const params = s3.uploadParams;

	params.Key = req.files[0].originalname;
	params.Body = req.files[0].buffer;

	s3Client.upload(params, (err, data) => {
		if (err) {
			res.status(500).json({
				error: "Error -> " + err
			});
		}

		const {
			title,
			description,
			url,
			date
		} = req.body;

		let id = uuid.v4();
		let projectImage = data.Location
		if (!title || !description || !url || !date) {
			res.statusMessage = "missing param";
			console.log(req.body.title);
			return res.status(406).end(); //not accept status
		}

		let newProject = {
			id,
			title,
			description,
			url,
			date,
			projectImage
		};

		Projects
			.createProject(newProject)
			.then(result => {
				return res.status(201).json(result);
			})
			.catch(err => {
				res.statusMessage = "Something went wrong with the DB. Try again later.";
				return res.status(500).end();
			})
	})
}