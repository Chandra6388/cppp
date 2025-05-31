const router = require("express").Router()
 
const { createSupportTicket, getAllSupportTicket } = require('../controllers/users/supportControllers')
const { allTickets, assigneToSupport , changeStatus, getAllEmployees} = require('../controllers/admin/supportTicketController')
const { getChatMessage} = require('../controllers/users/SupportChatControllers')

 
router.post("/createSupportTicket", createSupportTicket);
router.post("/allTickets", allTickets);
router.post("/getAllEmployees", getAllEmployees);

router.post("/assigneToSupport", assigneToSupport);
router.post("/changeStatus", changeStatus);
router.post("/getChatMessage", getChatMessage);
router.post("/getAllSupportTicket", getAllSupportTicket);




 
module.exports = router;