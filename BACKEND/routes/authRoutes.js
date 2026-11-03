const express = require('express');

const { protect } = require('../middleware/authMiddleware');

const { registerUser,
     loginUser, 
     getUserInfo,
     updateUserProfile,
     updateProfileImage,
     } = require('../controllers/authController');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.post('/register', registerUser);


router.post('/login', loginUser);


 router.get('/getUser',protect,getUserInfo);

 router.put('/profile', protect, updateUserProfile);

 router.post('/upload-image', protect, upload.single('image'), updateProfileImage);


 


module.exports = router;
