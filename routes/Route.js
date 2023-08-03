const { Router } = require('express')
const { Register, Login, Verify } = require('../controller/Controller.js');

const router = Router();
router.post('/reg',Register);
router.post('/log',Login)
router.get('/verify/:id',Verify)
module.exports = router