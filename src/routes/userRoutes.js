//const express = require("express");
//const router = express.Router();
//const userController = require("../controllers/userController");

//router.post("/", userController.createUser);
//router.get("/", userController.getUsers);
//router.get("/:id", userController.getUser);
//router.put("/:id", userController.updateUser);
//router.delete("/:id", userController.deleteUser);

//module.exports = router;


const express = require("express");
const multer = require("multer");
const router = express.Router();
const userController = require("../controllers/userController");

// Multer setup (store in memory for direct upload to S3)
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", upload.single("image"), userController.createUser);
router.get("/", userController.getUsers);
router.get("/:id", userController.getUser);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;

