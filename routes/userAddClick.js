const express = require("express");
const { NoOfAddsByUser ,getAllNoOfAddsByUser } = require("../controllers/userAddClick");

const router = express.Router();

router.post("/addclick", NoOfAddsByUser);
router.get("/addclicks", getAllNoOfAddsByUser);


module.exports = router;