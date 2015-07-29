// var sqlite3 = require('sqlite3').verbose();
// var db = new sqlite3.Database(':memory:');

// db.serialize(function() {

//   db.run('CREATE TABLE fermentator (id INTEGER, name TEXT, temp_mode INTEGER, temp_min REAL, temp_max REAL, run_mode INTEGER, recipe_id INTEGER)');

//   db.run('CREATE TABLE fermentator_config (fermentator_id INTEGER, ip TEXT, port TEXT, active INTEGER)');

//   db.run('CREATE TABLE recipe (id INTEGER, name TEXT)');

//   db.run('CREATE TABLE recipes_temptemplates (recipe_id INTEGER, temptemplate_id INTEGER)');

//   db.run('CREATE TABLE temp_template (id INTEGER, name TEXT, temp_min REAL, temp_max REAL, duration INTEGER)');


//   db.run('CREATE TABLE system_config (system_mode INTEGER, cron_time INTEGER)');

//   db.run('CREATE TABLE temp_log (fermentator_id INTEGER, recipe_id INTEGER, temp REAL, datetime INTEGER)');





//   var stmt = db.prepare('INSERT INTO fermentator VALUES (?,?,?,?,?,?,?)');


//   stmt.run(1, 'Ferm 1', 2, 17, 18, 1, 45);
//   stmt.run(2, 'Ferm 2', 1, 5, 6, 1, 999);
//   stmt.run(3, 'Ferm 3', 2, 19, 20, 1, 600);


//   stmt.finalize();

//   db.each('SELECT id, name, temp_mode, temp_min, temp_max, run_mode, recipe_id FROM fermentator WHERE id = 2', function(err, row) {
//     console.log('ID: ' + row.id + ' Name: ' + row.name + ' Temp Mode: ' + row.temp_mode + ' Temp Min: ' + row.temp_min + ' Temp Max: ' + row.temp_max  + ' Recipe ID: ' + row.recipe_id);
//   });
// });

// db.close();


var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');

db.serialize(function() {

	db.run('PRAGMA foreign_keys = ON')

	db.run('CREATE TABLE fermentator (id INTEGER PRIMARY KEY, name TEXT, temp_mode INTEGER, temp_min REAL, temp_max REAL, run_mode INTEGER, recipe_id INTEGER)');
	db.run('CREATE TABLE fermentator_config (fermentator_id INTEGER, ip TEXT, port TEXT, active INTEGER, FOREIGN KEY(fermentator_id) REFERENCES fermentator(id) ON DELETE CASCADE)');

	db.run('CREATE TABLE recipe (id INTEGER PRIMARY KEY, name TEXT)');

	db.run('CREATE TABLE recipes_temptemplates (recipe_id INTEGER, temptemplate_id INTEGER, FOREIGN KEY(recipe_id) REFERENCES recipe(id) ON DELETE CASCADE, FOREIGN KEY(temptemplate_id) REFERENCES temp_template(id) ON DELETE CASCADE)');

	db.run('CREATE TABLE temp_template (id INTEGER PRIMARY KEY, name TEXT, temp_min REAL, temp_max REAL, duration INTEGER)');


	var stmt = db.prepare('INSERT INTO fermentator VALUES (?,?,?,?,?,?,?)');

	stmt.run(null, 'Ferm 1', 2, 17, 18, 1, 45);
	stmt.run(null, 'Ferm 2', 1, 5, 6, 1, 999);
	stmt.run(null, 'Ferm 3', 2, 19, 20, 1, 600);

	stmt.finalize();

	var stmt = db.prepare('INSERT INTO fermentator_config VALUES (?,?,?,?)');

	stmt.run(1, '192.168.1.101', 8080, 0);
	stmt.run(2, '192.168.1.102', 8080, 1);
	stmt.run(3, '192.168.1.103', 8080, 0);

	stmt.finalize();

	db.each('SELECT id, name, temp_mode, temp_min, temp_max, run_mode, recipe_id, fermentator_id, ip, port, active FROM fermentator LEFT JOIN fermentator_config WHERE fermentator.id = fermentator_config.fermentator_id', function(err, row) {
		console.log('ID: ' + row.id + ' Name: ' + row.name + ' Temp Mode: ' + row.temp_mode + ' Temp Min: ' + row.temp_min + ' Temp Max: ' + row.temp_max  + ' Recipe ID: ' + row.recipe_id + ' FERM ID: ' + row.fermentator_id + ' IP: ' + row.ip + ' PORT: ' + row.port + ' ACTIVE: ' + row.active);
	});

});

module.exports = db;