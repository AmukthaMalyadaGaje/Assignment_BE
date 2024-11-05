
const express = require('express');
const router = express.Router();
const { createEmployee, getEmployeeById, updateEmployeeById, deleteEmployee } = require('../controllers/employeeController');
const multer = require('multer');
const path = require('path');
const Employee = require('../models/Employee');

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/');
        },
        filename: function (req, file, cb) {
            cb(null, Date.now() + path.extname(file.originalname));
        },
    }),
    fileFilter: function (req, file, cb) {
        const ext = path.extname(file.originalname).toLowerCase();
        if (ext !== '.jpg' && ext !== '.png') {
            return cb(new Error('Only JPG and PNG files are allowed'));
        }
        cb(null, true);
    },
});

router.get('/:id', getEmployeeById);
router.delete('/:id', deleteEmployee);


router.put('/:id', upload.single('image'), updateEmployeeById);

router.post('/create', upload.single('image'), createEmployee);
router.get('/', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
module.exports = router;
