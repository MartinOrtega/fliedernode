var db = require('../database');

FERM = {};

FERM.getFermentators = function(callback)
{
	db.all("SELECT * FROM fermentator", function(error, rows) {
		if(error)	{
			throw error;
		} else {
			callback(null, rows);
		}
	});
}

FERM.getFermentator = function(userId, callback)
{
	var stmt = db.prepare("SELECT * FROM fermentator WHERE id=?");
	stmt.bind(userId);

    stmt.get(function(error, row) {
    	if(error) {
            throw error;
        } else {
        	//retornamos la fila con los datos del usuario
            if(row) {
                callback(null, row);
            } else {
            	callback('El fermentador no existe', null)
            	console.log("El fermentador no existe");
            }
        }
    });
    stmt.finalize();
}

FERM.newFermentator = function(ferm, callback)
{
	var stmt = db.prepare("INSERT INTO fermentator VALUES (?,?,?,?,?,?,?)");
	stmt.bind([null, ferm.name, ferm.tempMode, ferm.tempMin, ferm.tempMax, ferm.runMode, ferm.recipeId]);
	stmt.run(function(error){
		if(error) {
            throw error;
        } else {
            if(this.lastID > 0) {
                callback(null, this.lastID);
                console.log('Nuevo fermentador - ID: ' + this.lastID);
            } else {
            	callback('No se pudo crear el fermentador', null)
            	console.log("No se pudo crear el fermentador");
            }
        }
	});
	stmt.finalize();
}

FERM.editFermentator = function(ferm, callback)
{

	var query = 'UPDATE fermentator SET ';
	var data = [];

	if(ferm.name){
		query += 'name=?,';
		data.push(ferm.name);
	}
	if(ferm.tempMode){
		query += 'temp_mode=?,';
		data.push(ferm.tempMode);
	}
	if(ferm.tempMin){
		query += 'temp_min=?,';
		data.push(ferm.tempMin);
	}
	if(ferm.tempMax){
		query += 'temp_max=?,';
		data.push(ferm.tempMin);
	}
	if(ferm.runMode){
		query += 'run_mode=?,';
		data.push(ferm.runMode);
	}
	if(ferm.recipeId){
		query += 'recipe_id=?,';
		data.push(ferm.recipeId);
	}

	query = query.slice(0,-1) + ' WHERE id = ?';
	data.push(ferm.id);

	var stmt = db.prepare(query);
	stmt.bind(data);
	stmt.run(function(error){
		if(error) {
            throw error;
        } else {
			if (this.changes > 0) {
	    		callback(null);
	    	} else {
	    		callback('No se pudo editar el fermentador');
	    		console.log("No se pudo editar el fermentador");
	    	}
        }
	});
	stmt.finalize();
}

FERM.deleteFermentator = function(userId, callback)
{
	var stmt = db.prepare("DELETE FROM fermentator WHERE id=?");
	stmt.bind(userId);
    stmt.run(function(error){
    	if(error) {
            throw error;
        } else {
	    	if (this.changes > 0) {
	    		callback(null);
	    	} else {
	    		callback('No se pudo borrar el fermentador');
	    		console.log("No se pudo borrar el fermentador");
	    	}
	    }
	});
	stmt.finalize();
}


module.exports = FERM;