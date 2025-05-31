const router = require("express").Router()
const { getAllTicket, getChatHistory } = require('../../controllers/employee/ticketControllers');

router.post("/getAllTicket", getAllTicket);
router.post("/getChatHistory", getChatHistory);





module.exports = router;