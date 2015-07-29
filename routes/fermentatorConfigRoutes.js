var express = require('express');
var router = express();
var FERMCONFIG = require('../models/fermentatorConfig');


//Ferm resources
router.route('/ferm/:id([0-9]+)/config')
	.get(function(req, res) {
    	
		FERMCONFIG.getConfiguration(req.params.id, function(error, data) {

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

		var fermConfig = {
			fermId: req.params.id,
			ip: req.body.ip,
			port: req.body.port,
			active: req.body.active
		};

  		FERMCONFIG.editConfiguration(fermConfig, function(error) {

  			if(error == null){
				res.send('OK');
			} else {
				res.json({errorcode: error});
			}
  		});
	})

	.delete(function(req, res){
		res.json({errorcode: 'Invalid Method'});
	});

module.exports = router;