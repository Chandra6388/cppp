const router = require("express").Router()
const { getAllNotification } = require('../../controllers/users/notificationControllers')

router.post("/getAllNotification", getAllNotification);


 

module.exports = router;