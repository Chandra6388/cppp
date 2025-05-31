const router = require("express").Router()
const { getDashboardData } = require('../../controllers/employee/dashboardController');

router.post("/getDashboardData", getDashboardData);





module.exports = router;