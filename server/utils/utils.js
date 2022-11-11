const axios = require('axios');
const jwt = require('jsonwebtoken');

exports.errHandling = fn => (req, res, next) =>
	Promise.resolve(fn(req, res, next)).catch(next);

exports.request = async (endPoint, method, data) => {
	const porta = process.env.PORT || 3000;
	const URL_PADRAO = 'http://localhost:' + porta;
	const url = `${URL_PADRAO}${endPoint}`;

	const { headers, data: res } = await axios({
		url,
		method,
		data,
		validateStatus: false,
	});

	return { headers, res };
};
//
// criação do encode e decode
exports.encode64 = (string) => {
	//return Buffer.from(string, 'utf8').toString('base64').slice(0,2);
	return jwt.sign(string, process.env.TOKENSECRET);
};

exports.decode64 = (string) => {
	//return Buffer.from(string, 'base64').toString('utf8')
	return jwt.verify(string, process.env.TOKENSECRET);
};

