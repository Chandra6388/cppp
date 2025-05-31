const router = require("express").Router()
const { getEmailNotificationSettings, getWhatsappNotificationSettings } = require('../../controllers/users/userSettingControllers')

router.post("/getEmailNotificationSettings", getEmailNotificationSettings);
router.post("/getWhatsappNotificationSettings", getWhatsappNotificationSettings);


 

module.exports = router;