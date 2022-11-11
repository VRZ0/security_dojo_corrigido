const router = require('express').Router();
const { errHandling, decode64 } = require('../../utils/utils');//modificado
const cookieParser = require('cookie-parser');
const { getUserById, updateUsername } = require('../../service/service');

const csrf = require('csurf')
var bodyParser = require('body-parser')

var csrfProtection = csrf({cookie: true})
var parseForm = bodyParser.urlencoded({ extended: false })

router.use(cookieParser());

const renderData = {};

router.get(
	'/csrf-get', parseForm, csrfProtection,
	errHandling(async (req, res) => {
		const cookieString = req.cookies;
		const user_id  = decode64(cookieString.user_id);//modificado
		const usuarioNaoAutenticado = user_id == undefined;
		if (usuarioNaoAutenticado) {
			res.render('user-not-authenticated');
		} else {
			const { rows } = await getUserById(user_id);
			renderData.username = rows[0].username;
			renderData.csrfToken = req.csrfToken();
			res.render('csrf-get', renderData);
		}
	})
);

router.post(
	'/csrf-get/alterarusername', parseForm, csrfProtection,
	errHandling(async (req, res) => {
		//CRIA A VARIAVEI COM BASE NO QUE VEIO NA URL
		const { novo_username } = req.body;
		//CRIA A VARIAVEL COM BASE NO QUE ESTA NOS COOKIES
		const cookieString = req.cookies;
		const user_id  = decode64(cookieString.user_id);
		console.log(user_id)
		//BUSCA NO BANCO DE DADOS SE O USUARIO EXISTE
		const { rows } = await getUserById(user_id);
		const userExiste = rows.length == 1;
		if (userExiste) {
			const { rows } = await updateUsername(novo_username, user_id);
			renderData.username = rows[0].username;
			res.render('csrf-get', renderData);
		} else {
			renderData.username = 'User_id_not_found';
			res.render('csrf-get', renderData);
		}
	})
);

module.exports = router;
