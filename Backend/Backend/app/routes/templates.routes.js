const router = require("express").Router()
const { addTemplates , getAllTemplates, updateTemplate , deleteTemplate  } = require('../controllers/admin/TempletControllers')

router.post("/addTemplates", addTemplates);
router.post("/getAllTemplates", getAllTemplates);
router.post("/updateTemplate", updateTemplate);
router.post("/deleteTemplate", deleteTemplate);



module.exports = router;