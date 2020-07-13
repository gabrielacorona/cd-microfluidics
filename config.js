exports.DATABASE_URL = process.env.DATABASE_URL || "mongodb://localhost/microfluidicsdb"
exports.JWT_KEY = process.env.JWT_KEY || 'secret'
exports.PORT = process.env.PORT || '8000';
exports.AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY || 'AKIA54QCHKBSEXRFFKFG'
exports.AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY || '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'
exports.REGION = process.env.REGION || 'us-east-2'
exports.Bucket = process.env.Bucket || 'cd-microfluidics'