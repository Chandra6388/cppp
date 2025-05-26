const router = require("express").Router()
 
const { createSupportTicket } = require('../controllers/users/supportControllers')
const { allTickets, assigneToSupport , changeStatus} = require('../controllers/admin/supportTicketController')
const { getChatMessage} = require('../controllers/users/SupportChatControllers')




 
router.post("/createSupportTicket", createSupportTicket);
router.post("/allTickets", allTickets);
router.post("/assigneToSupport", assigneToSupport);
router.post("/changeStatus", changeStatus);
router.post("/getChatMessage", getChatMessage);




 
module.exports = router;