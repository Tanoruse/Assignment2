var express = require('express');
var router = express.Router();

let usersController = require('../controllers/users');

router.get('/list', usersController.list);
router.post('/create', usersController.create);
router.get('/get/:userID', usersController.userByID, usersController.read);
router.put('/edit/:userID', usersController.update);
router.delete('/delete/:userID', usersController.remove);

module.exports = router;
