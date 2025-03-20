const express = require('express');
const router = express.Router();

const { getAllAdmins, createAdmin, updateAdmin, getAdminById, deleteAdmin, loginAdmin } = require('../controllers/adminController');
const { verifySuperAdmin } = require('../middleware/authMiddleware');

router.get('/', (req, res) => {
  res.send('Welcome to the Admin Routes');
});
router.post('/login', loginAdmin);
router.get('/admins', verifySuperAdmin, getAllAdmins);
router.post('/create', verifySuperAdmin, createAdmin);
router.put('/update/:adminId', verifySuperAdmin,updateAdmin);
router.get('/getAdminById/:adminId', verifySuperAdmin, getAdminById);
router.delete('/delete/:adminId', verifySuperAdmin, deleteAdmin);

module.exports = router;
