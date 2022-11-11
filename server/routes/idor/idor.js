const router = require('express').Router();
const { errHandling, encode64, decode64 } = require('../../utils/utils'); //modificado
const cookieParser = require('cookie-parser');
const { query } = require('express');
const { getNotasByUserId } = require('../../service/service');

router.use(cookieParser());

const renderData = {};

router.get(
	'/idor',
	errHandling(async (req, res) => {
		const cookieString = req.cookies;
		const user_id  = decode64(cookieString.user_id); //modificado
		const usuarioNaoAutenticado = user_id == undefined; 

		if (usuarioNaoAutenticado) {
			res.redirect('/user-not-authenticated');
		} else {
			res.redirect(`idor/notas/${encode64(user_id)}`);  //modificado
		}
	})
);



router.get(
	'/idor/notas/*',
	errHandling(async (req, res) => {
		const user_id = req.originalUrl.split('/')[3];

		if (!isNaN(parseInt(decode64(user_id)))) {  //modificado
			const { rows } = await getNotasByUserId(decode64(user_id)); //modificado
			renderData.posts = rows;
			res.render('idor', renderData);
		} else {
			res.redirect('/user-not-authenticated');
		}
	})
);

module.exports = router;
