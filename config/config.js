const config = {};

config.port = process.env.PORT || 5000;
config.dbURL = process.env.DATABASEURL || "mongodb://localhost:27017/minicord";

module.exports = config;
