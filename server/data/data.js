const dataBase = require('../config/database').pool;

exports.getUserById = async user_id => {
	return await dataBase.query(
		`SELECT * FROM user_data WHERE id_user = ${user_id}`
	);
};

exports.updateUsername = async (username, user_id) => {
	return await dataBase.query(
		`
    UPDATE 
        user_data 
    SET 
        USERNAME = $1 
    WHERE 
	id_user = $2

    RETURNING USERNAME
    `,
		[username, user_id]
	);
};

exports.getUserByName = async nome => {
	const values = [`%${nome.toLowerCase()}%`]
	const query = `SELECT id_user, nome, username FROM user_data WHERE LOWER(nome) LIKE $1`;
	try {
		return await dataBase.query(query, values);
	} catch (e) {
		throw new Error();
	}
};

exports.getNotasByUserId = async user_id => {
    try{
        return await dataBase.query(
            'select USER_NOTAS.*, user_data.username from USER_NOTAS inner join user_data on user_data.id_user = USER_NOTAS.id_user where user_data.id_user = $1',
            [user_id]
        );
    }catch (e) {
        throw new Error();
    }
};

