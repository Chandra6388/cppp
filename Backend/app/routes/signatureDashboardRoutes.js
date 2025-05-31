const router = require("express").Router()
const { dashboardSummary, btnClickedGraphData , audienceOverviewGraphData, signatureSendGraphData, sigantureUseAnalytics, viewOpratingSystem , signatureCreatedAnalytics} = require('../controllers/users/userDashboardController')

router.post("/dashboardSummary", dashboardSummary);
router.post("/btnClickedGraphData", btnClickedGraphData);
router.post("/audienceOverviewGraphData", audienceOverviewGraphData);
router.post("/signatureSendGraphData", signatureSendGraphData);
router.post("/sigantureUseAnalytics", sigantureUseAnalytics);
router.post("/viewOpratingSystem", viewOpratingSystem);
router.post("/signatureCreatedAnalytics", signatureCreatedAnalytics);








module.exports = router;