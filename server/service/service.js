const sanitize = require('sanitize-html')

const {
	getUserByName,
	getUserById,
	updateUsername,
	getNotasByUserId,
} = require('../data/data');

exports.getUserByName = async nome => {
	var sanitizedName = (sanitize(nome, {allowedTags:[]}))
	return await getUserByName(sanitizedName);
};

exports.updateUsername = async (novo_username, user_id) => {
	var sanitizedUsername = (sanitize(novo_username, {allowedTags:[]}))
	return await updateUsername(sanitizedUsername, user_id);
};

exports.getUserById = async user_id => {
	return await getUserById(user_id);
};

exports.getNotasByUserId = async user_id => {
	return await getNotasByUserId(user_id);
};
