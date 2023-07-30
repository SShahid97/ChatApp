const express = require('express');
 const {registerUser, authUser, allUsers, updateUser} = require('../controllers/userControllers');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();


router.route('/').post(registerUser).get(protect, allUsers)
router.patch('/:_id',protect,updateUser)
router.post('/login', authUser)



module.exports = router;