const router = require('express').Router();
const { errHandling } = require('../../utils/utils');
const { encode64, decode64 } = require('../../utils/utils'); //modificado
const cookieParser = require('cookie-parser');
const { getUserById } = require('../../service/service');
const helmet = require('helmet');

router.use(cookieParser());

router.use(helmet.frameguard({ action: "deny" }));


const renderData = {};
const vulnType = [
	{ titulo: 'CSRF-GET', link: 'csrf-get' },
	{ titulo: 'CSRF-POST', link: 'csrf-post' },
	{ titulo: 'SQLI', link: 'sqli' },
	{ titulo: 'XSS Refletido', link: 'xss_refletido' },
	{ titulo: 'XSS Armazenado', link: 'xss_armazenado' },
	{ titulo: 'Broken Autentication', link: 'broken_autentication' },
	{ titulo: 'Cookie Manipulation', link: 'cookie_manipulation' },
	{ titulo: 'IDOR', link: 'idor' },
];

//RENDERIZA A PÁGINA inicial
router.get(
	'/',
	errHandling(async (req, res) => {
		const { user_id } = req.cookies;
		const usuarioAutenticado = user_id != undefined;
		renderData.vulnType = vulnType;

		if (usuarioAutenticado) {
			renderData.hasUsers = 'true';
		} else {
			renderData.hasUsers = 'false';
		}
		res.render('initial_page', renderData);
	})
);

// const cookies = { sameSite: 'none', secure: false, httpOnly: false };
const cookies = { sameSite: 'lax', secure: true, httpOnly: true };
// const cookies = { sameSite: 'strict', secure: false, httpOnly: false };
// const cookies = { sameSite: 'strict', secure: true, httpOnly: true };
// const cookies = { sameSite: 'lax', secure: false, httpOnly: false };

//REALIZA O LOGIN - SET COOKIES
router.get(
	'/login',
	errHandling(async (req, res) => {		
		const user_id = encode64('1'); //modificado
		const { rows } = await getUserById(decode64(user_id)); //modificado
		renderData.username = rows[0].username;
		renderData.vulnType = vulnType;
		renderData.hasUsers = 'true';
		res.cookie('user_id', user_id, cookies).render( //usado
			'initial_page',
			renderData
		);
	})
);

//REALIZA O LOGOUT - CLEAR COOKIES
router.get(
	'/logout',
	errHandling(async (req, res) => {
		renderData.vulnType = vulnType;
		renderData.hasUsers = 'false';
		res.clearCookie('user_id').render('initial_page', renderData);
	})
);

router.get(
	'/user-not-authenticated',
	errHandling(async (req, res) => {
		res.render('user-not-authenticated', renderData);
	})
);

module.exports = router;
