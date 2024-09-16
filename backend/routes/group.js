const express = require('express');
const router = express.Router();
const { createGroup, deleteGroup, addMember, removeMember, updateGroup, getUserGroups, searchGroups } = require('../controllers/group');
const { verifyUser } = require('../middlewares/auth');

router.post('/', verifyUser, createGroup);
router.delete('/:id', verifyUser, deleteGroup);
router.post('/add-member', verifyUser, addMember);
router.post('/remove-member', verifyUser, removeMember);
router.put('/:id', verifyUser, updateGroup);
router.get('/', verifyUser, getUserGroups);
router.get('/search', verifyUser, searchGroups);

module.exports = router;
