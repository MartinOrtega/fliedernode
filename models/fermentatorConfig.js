var db = require('../database');

FERMCONFIG = {};

FERMCONFIG.getConfiguration = function(userId, callback)
{
	var stmt = db.prepare("SELECT * FROM fermentator_config WHERE fermentator_id=?");
	stmt.bind(userId);

    stmt.get(function(error, row) {
    	if(error) {
            throw error;
        } else {
        	//retornamos la fila con los datos del usuario
            if(row) {
                callback(null, row);
            } else {
            	callback('La configuracion para el fermentador no existe', null);
            	console.log('La configuracion para el fermentador no existe');
            }
        }
    });
    stmt.finalize();
}

FERMCONFIG.newConfiguration = function(fermConfig, callback)
{
	var stmt = db.prepare("INSERT INTO fermentator_config VALUES (?,?,?,?)");
	stmt.bind([fermConfig.fermId, fermConfig.ip, fermConfig.port, 0]);
	stmt.run(function(error){
		if(error) {
            throw error;
        } else {
            if(this.lastID > 0) {
                callback(null, 'Nueva configuracion del fermentador - ID: ' + fermConfig.fermId);
                console.log('Nueva configuracion del fermentador - ID: ' + fermConfig.fermId);
            } else {
            	callback('No se pudo crear la configuracion para el fermentador', null);
            	console.log("No se pudo crear la configuracion para el fermentador");
            }
        }
	});
	stmt.finalize();
}

FERMCONFIG.editConfiguration = function(fermConfig, callback)
{

	var query = 'UPDATE fermentator_config SET ';
	var data = [];

	if(fermConfig.ip){
		query += 'ip=?,';
		data.push(fermConfig.ip);
	}
	if(fermConfig.port){
		query += 'port=?,';
		data.push(fermConfig.port);
	}
	if(fermConfig.active){
		query += 'active=?,';
		data.push(ferm.active);
	}

	query = query.slice(0,-1) + ' WHERE fermentator_id = ?';
	data.push(fermConfig.fermId);

	var stmt = db.prepare(query);
	stmt.bind(data);
	stmt.run(function(error){
		if(error) {
            throw error;
        } else {
			if (this.changes > 0) {
	    		callback(null);
	    	} else {
	    		callback('No se pudo editar la configuracion del fermentador');
	    		console.log("No se pudo editar la configuracion del fermentador");
	    	}
        }
	});
	stmt.finalize();
}

FERMCONFIG.deleteConfiguration = function(userId, callback)
{
	var stmt = db.prepare("DELETE FROM fermentator WHERE fermentator_id=?");
	stmt.bind(userId);
    stmt.run(function(error){
    	if(error) {
            throw error;
        } else {
	    	if (this.changes > 0) {
	    		callback(null);
	    	} else {
	    		callback('No se pudo borrar la configuracion del fermentador');
	    		console.log("No se pudo borrar la configuracion del fermentador");
	    	}
	    }
	});
	stmt.finalize();
}


module.exports = FERMCONFIG;