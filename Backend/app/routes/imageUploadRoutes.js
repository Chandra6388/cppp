const router = require("express").Router();
const multer = require("multer");
const ImgUploader = require("../ImageUploader/upload");

const upload = multer({ storage: multer.memoryStorage() });

router.post("/uploadImg", upload.single("image"), ImgUploader.uploadImg);

module.exports = router;
