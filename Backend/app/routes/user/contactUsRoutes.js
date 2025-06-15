const router = require("express").Router()
const { addContactUs , getAllContactUsFrom } = require('../../controllers/users/contactUsController')

router.post("/addContactUs", addContactUs);
router.post("/getAllContactUsFrom", getAllContactUsFrom);



 

module.exports = router;