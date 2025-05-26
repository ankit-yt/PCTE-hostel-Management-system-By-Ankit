// routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Room = require('../models/Room'); // Import the Room model
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const uploads = require('../config/multer');
const multer = require('multer');

// Create a new user
router.post('/', uploads.single("img"), async (req, res) => {
    const {
        username,
        password,
        role,
        rollNumber,
        hostel,
        roomNumber,
        name,
        email,
        phone,
        age,
    } = req.body;

    

    try {
        // Validate common required fields
        if (!username || !password || !role || !email || !phone || !age) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Validate image file
        if (!req.file) {
            return res.status(400).json({ message: "Profile image is required" });
        }

        // Convert image buffer to base64 Data URI
        const base64Image = req.file.buffer.toString("base64");
        const mimeType = req.file.mimetype;
        const dataUri = `data:${mimeType};base64,${base64Image}`;

        // Prepare base user data
        let userData = {
            username,
            password,
            role,
            email,
            phone,
            age,
            imageData: dataUri
        };

        // Additional student-specific fields
        if (role === "student") {
            if (!rollNumber || !hostel || !roomNumber ) {
                return res.status(400).json({ message: "Missing student-specific fields" });
            }

            const room = await Room.findOneAndUpdate(
                { roomNumber, hostel },
                { $inc: { occupied: 1 } },
                { new: true }
            );

            if (!room) {
                return res.status(404).json({ message: "Room not found" });
            }

            userData = {
                ...userData,
                rollNumber,
                hostel,
                roomNumber,
                roomId: room._id 
               
            };

            // Update room occupancy
          
        }

        // Save user
        const user = new User(userData);
        await user.save();

        res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        console.error("❌ User creation failed:", error);
        res.status(500).json({ message: "Error creating user", error: error.message });
    }
});

router.put("/", uploads.single("img"), async (req, res) => { 
    const {
        id,
        username,
        password,
        role,
        rollNumber,
        hostel,
        roomNumber,
        name,
        email,
        phone,
        age,
    } = req.body;
    console.log("✅ Route hit: Updating user");
    console.log(id)
    let dataUri = null;

    try {

        
        
        if (req.file) {
            const base64Image = req.file.buffer.toString("base64");
            const mimeType = req.file.mimetype;
            dataUri = `data:${mimeType};base64,${base64Image}`;
        }
        const oldUser = await User.findById(id);
        oldUser.username = username || oldUser.username;
        if (password) { 
            oldUser.password = password; 
        }
        oldUser.role = role || oldUser.role;
       if (role === "student") {
            oldUser.rollNumber = rollNumber || oldUser.rollNumber;
            oldUser.hostel = hostel || oldUser.hostel;
            oldUser.roomNumber = roomNumber || oldUser.roomNumber;
        }
        
        oldUser.email = email || oldUser.email;
        oldUser.phone = phone || oldUser.phone;
        oldUser.age = age || oldUser.age;
        oldUser.imageData = dataUri || oldUser.imageData; 
        if (oldUser.roomNumber === !roomNumber) {
            const room = await Room.findOneAndUpdate(
                { roomNumber: oldUser.roomNumber, hostel: oldUser.hostel },
                { $inc: { occupied: -1 } },
                { new: true }
            );
            const newroom = await Room.findOneAndUpdate(
                { roomNumber, hostel },
                { $inc: { occupied: 1 } },
                { new: true }
            );

            
        }
        await oldUser.save();
        
        res.status(200).json({ message: "User updated successfully", user: oldUser });


    }
    catch (e) {
        console.error(e);
        res.status(500).json({ message: "Error updating user" });
    }
})

router.get("/StudentAccToRoom/:roomId", async (req, res) => {
    console.log("✅ Route hit: Fetching students by room ID");
    const { roomId } = req.params;
    try {
        const students = await User.find({ roomId: roomId})
        if (students.length === 0) {
            return res.status(404).json({ message: "No students found for this room" });
        }
        res.status(200).json(students);
    }
    catch (e) {
        console.error(e);
        res.status(500).json({ message: "Error fetching students" });
    }
})



// Get all users
router.get('/', async (req, res) => {
    
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
});

// Get a single user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
});

// Update a user
router.put('/:id', async (req, res) => {
    const { username, password, role } = req.body;

    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.username = username || user.username;
        user.role = role || user.role;

        if (password) {
            user.password = password; // Consider hashing the password
        }

        await user.save();
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: 'Error updating user', error: error.message });
    }
});

// Delete a user
router.delete('/:id', async (req, res) => {
    console.log("✅ Route hit: Deleting user");
    try {
        // Step 1: Find and delete the user
        let user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        console.log(user)
        // Step 2: If student and roomId exists, decrement room occupancy
        if (user.roomId) {
            const room = await Room.findByIdAndUpdate(
                user.roomId,
                { $inc: { occupied: -1 } },
                { new: true }
            );

            if (!room) {
                return res.status(404).json({ message: 'User deleted, but room not found' });
            }
        }

        
         user = await User.findByIdAndDelete(req.params.id);

        // Step 3: Respond success
        res.status(200).json({ message: 'User deleted successfully' });

    } catch (error) {
        console.error('❌ Error deleting user:', error);
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
});




// Login a user with role validation
router.post('/login', async (req, res) => {
    const { username, password, role } = req.body;

    try {
        // Find user in the database
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Check if the password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Check if the user role matches
        if (user.role !== role) {
            return res.status(403).json({ error: 'Role conflict: You are not authorized to log in as this role' });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({ token, studentId: user._id }); // Include studentId in the response
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

// Get a single user by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User  not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
});

module.exports = router;