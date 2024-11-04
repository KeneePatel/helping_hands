const express = require("express");
const { createRequest, getRequestsByUserId, deleteRequestById, getRequestByItemAndUser } = require("../controllers/RequestController");
const router = express.Router();

router.get('/:userId', getRequestsByUserId);
router.get('/:itemId/:userId', getRequestByItemAndUser);
router.post("/", createRequest);
router.delete('/:id', deleteRequestById);

module.exports = router;
