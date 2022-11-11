const router = require('express').Router();
const { errHandling, encode64, decode64 } = require('../../utils/utils');//modificado
const cookieParser = require('cookie-parser');
const { updateUsername, getUserById } = require('../../service/service');


router.use(cookieParser());

const renderData = {};

router.get(
	'/broken_autentication',
	errHandling(async (req, res) => {
		const cookieString = req.cookies;
		const user_id  = decode64(cookieString.user_id);//modificado
		const usuarioNaoAutenticado = user_id == undefined;

		if (usuarioNaoAutenticado) {
			res.render('user-not-authenticated');
		} else {
			const { rows } = await getUserById(user_id);
			renderData.username = rows[0].username;
			renderData.user_id = encode64(user_id); //modificado
			res.render('broken_autentication', renderData);
		}
	})
);

router.get(
	'/broken_autentication/alterarusername',
	errHandling(async (req, res) => {
		//CRIA A VARIAVEI COM BASE NO QUE VEIO NA URL
		const { id: user_id_encoded, novo_username } = req.query;
		
		const user_id = decode64(user_id_encoded) //decodado na hora 
		renderData.user_id = user_id;
		//BUSCA NO BANCO DE DADOS SE O USUARIO EXISTE
		const { rows } = await getUserById(user_id);
		const userExiste = rows.length == 1;
		if (userExiste) {
			const { rows } = await updateUsername(novo_username, user_id);
			renderData.username = rows[0].username;
			res.render('broken_autentication', renderData);
		} else {
			renderData.username = 'User_id_not_found';
			res.render('broken_autentication', renderData);
		}
	})
);

module.exports = router;
