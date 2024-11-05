const Employee = require('../models/Employee');
const path = require('path');

// Validation functions
const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
const validateNumeric = (number) => /^\d+$/.test(number);

const createEmployee = async (req, res) => {
    const { name, email, mobile, designation, gender } = req.body;

    // Accessing courses correctly
    const courses = req.body['courses'] || [];

    // Server-side validation
    if (!name || !email || !mobile || !designation || !gender) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    if (!validateEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }
    if (!validateNumeric(mobile)) {
        return res.status(400).json({ error: 'Mobile number should be numeric' });
    }

    // Check for duplicate email
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
        return res.status(400).json({ error: 'Email already exists' });
    }

    // Check for valid file type (JPG/PNG)
    if (!req.file) {
        return res.status(400).json({ error: 'Image file is required' });
    }

    const newEmployee = new Employee({
        name,
        email,
        mobile,
        designation,
        gender,
        courses: courses,
        image: req.file.filename,
    });

    try {
        const emp = await newEmployee.save();
        res.status(201).json({ message: 'Employee created successfully', employee: emp });
    } catch (err) {
        console.error("Error saving employee:", err);
        res.status(500).json({ error: 'Error saving employee' });
    }
};


const getEmployeeById = async (req, res) => {
    try {
        console.log("Entered")
        const { id } = req.params;
        const employee = await Employee.findById(id);
        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.status(200).json(employee);
    } catch (err) {
        console.error('Error fetching employee:', err);
        res.status(500).json({ error: 'Error fetching employee' });
    }
};

// Update an employee by ID
const updateEmployeeById = async (req, res) => {
    const { id } = req.params;
    const { name, email, mobile, designation, gender, courses } = req.body;

    if (!name || !email || !mobile || !designation || !gender) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    if (!validateEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }
    if (!validateNumeric(mobile)) {
        return res.status(400).json({ error: 'Mobile number should be numeric' });
    }

    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee && existingEmployee._id.toString() !== id) {
        return res.status(400).json({ error: 'Email already exists' });
    }

    try {
        const updatedData = {
            name,
            email,
            mobile,
            designation,
            gender,
            courses: Array.isArray(courses) ? courses : [courses],
            ...(req.file && { image: req.file.filename }),
        };

        const updatedEmployee = await Employee.findByIdAndUpdate(id, updatedData, { new: true });
        if (!updatedEmployee) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.status(200).json({ message: 'Employee updated successfully', employee: updatedEmployee });
    } catch (err) {
        console.error('Error updating employee:', err);
        res.status(500).json({ error: 'Error updating employee' });
    }
};

const deleteEmployee = async (req, res) => {
    const { id } = req.params;

    try {
        const employee = await Employee.findByIdAndDelete(id);

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.status(200).json({ message: 'Employee deleted successfully', employee });
    } catch (error) {
        console.error('Error deleting employee:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
module.exports = {
    createEmployee,
    getEmployeeById,
    updateEmployeeById,
    deleteEmployee

};
