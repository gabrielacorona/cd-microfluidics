const {
	AWS_ACCESS_KEY,
	AWS_SECRET_ACCESS_KEY,
	REGION,
	Bucket
} = require('../config');

const env = {
	AWS_ACCESS_KEY: AWS_ACCESS_KEY,
	AWS_SECRET_ACCESS_KEY: AWS_SECRET_ACCESS_KEY,
	REGION: REGION,
	Bucket: Bucket
};

module.exports = env;