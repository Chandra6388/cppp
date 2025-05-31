const router = require("express").Router()
const { login , register , getAllUser , updateProfileImg, getUserById, forgotPassword, googleLogin , AddNewUser, resetPassword, updateUserStatus, deleteUserByAdmin, getAllEmployee, userCreateAnalytics} = require('../controllers/auth/authControllers')

router.post("/login", login);
router.post("/register", register);
router.post("/getAllUser", getAllUser);
router.post("/updateProfileImg", updateProfileImg);
router.post("/getUserById", getUserById);
router.post("/forgotPassword", forgotPassword);
router.post("/googleLogin", googleLogin);
router.post("/AddNewUser", AddNewUser);
router.post("/resetPassword", resetPassword);
router.post("/updateUserStatus", updateUserStatus);
router.post("/deleteUserByAdmin", deleteUserByAdmin);
router.post("/getAllEmployee", getAllEmployee);
router.post("/userCreateAnalytics", userCreateAnalytics);


 

module.exports = router;