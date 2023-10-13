var express = require('express');
var router = express.Router();

let indexController = require('../controllers/index');

/* GET home page. */
router.get('/', indexController.home);

router.get('/products', indexController.getProducts);

router.get('/products/:id', indexController.prd);

router.post('/products', indexController.Add);

router.put('/products/:id', indexController.update);

router.delete('/products/:id', indexController.remove);

module.exports = router;
