var stream = require('stream');

const s3 = require('./s3.config.js');
const uuid = require('uuid');
const {
	Pictures
} = require('./models/pictures-model');


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