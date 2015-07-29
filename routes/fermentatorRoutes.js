var express = require('express');
var router = express();
var FERM = require('../models/fermentator');
var FERMCONFIG = require('../models/fermentatorConfig');


//Ferm resources
router.route('/ferm/:id([0-9]+)')
	.get(function(req, res) {
    	
		FERM.getFermentator(req.params.id, function(error, data) {

			if(error == null) {
				res.json(data);
			} else {
				res.json({errorcode: error});
			}
		});
  	})

  	.post(function(req, res) {
    	res.json({errorcode: 'Invalid Method'});
  	})

	.put(function(req, res) {

		var ferm = {
			id: req.params.id,
			name: req.body.name,
			tempMode: req.body.temp_mode,
			tempMin: req.body.temp_min,
			tempMax: req.body.temp_max,
			runMode: req.body.run_mode,
			recipeId: req.body.recipe_id
		};

  		FERM.editFermentator(ferm, function(error) {

  			if(error == null){
				res.send('OK');
			} else {
				res.json({errorcode: error});
			}
  		});
	})

	.delete(function(req, res){

		FERM.deleteFermentator(req.params.id, function(error) {

			if(error == null){
				res.send('OK');
			} else {
				res.json({errorcode: error});
			}
		});
	});
	
//Ferms resources
router.route('/ferms')
	.get(function(req, res) {

		FERM.getFermentators(function(error, data) {

			if(error == null){
				res.json(data);
			} else {
				res.json({errorcode: error});
			}
		});
  	})

  	.post(function(req, res) {

  		var ferm = {
			name: req.body.name,
			tempMode: req.body.temp_mode,
			tempMin: req.body.temp_min,
			tempMax: req.body.temp_max,
			runMode: req.body.run_mode,
			recipeId: req.body.recipe_id
		};

		var fermConfig = {
			ip: req.body.ip,
			port: req.body.port
		}

		if(ferm.name && ferm.tempMode && ferm.tempMin && ferm.tempMax && ferm.runMode && ferm.recipeId && fermConfig.ip && fermConfig.port) {

	  		FERM.newFermentator(ferm, function(error, newFermId) {

	  			if(error == null){

	  				fermConfig['fermId'] = newFermId;

	  				FERMCONFIG.newConfiguration(fermConfig, function(error) {

	  					if(error == null){
	  						res.json({'newFermId': newFermId});
	  					} else {
							res.json({errorcode: error});
						}
	  				});

				} else {
					res.json({errorcode: error});
				}
	  		});
  		} else {
  			res.json({errorcode: 'Faltan datos'});
  		}
		
  	})

	.put(function(req, res) {
		res.json({errorcode: 'Invalid Method'});
	})

	.delete(function(req, res){
		res.json({errorcode: 'Invalid Method'})
	});

module.exports = router;