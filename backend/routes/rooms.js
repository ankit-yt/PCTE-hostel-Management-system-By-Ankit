// /server/routes/rooms.js
const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const User = require('../models/User'); 

// Route to create a new room
router.post('/', async (req, res) => {
    const { roomNumber, capacity, hostel } = req.body;
    try {
        const newRoom = new Room({ roomNumber, capacity, hostel });
        await newRoom.save();
        res.status(201).json(newRoom);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating room' });
    }
});

// Route to fetch all rooms
router.get('/', async (req, res) => {
    try {
        const rooms = await Room.find();
        res.json(rooms);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching rooms' });
    }
});

router.get("/availableRoom", async (req, res) => {
    console.log("✅ Route hit: Fetching available rooms");

    try {
        const rooms = await Room.aggregate([
            {
              $match: {
                $expr: { $lt: ["$occupied", "$capacity"] }
              }
            }
          ]);
          

        if (!rooms || rooms.length === 0) {
            return res.status(404).json({ message: 'No available rooms found' });
        }

        res.status(200).json(rooms); 
        console.log("✅ Available rooms fetched successfully:", rooms);
      
    } catch (error) {
        console.error(" Error fetching rooms:", error);
        res.status(500).json({ message: 'Error fetching available rooms', error: error.message });
    }
});


router.get('/available', async (req, res) => {
    try {
        const availableRooms = await Room.find({ occupied: { $lt: '$capacity' } });
        res.json(availableRooms);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching available rooms' });
    }
});

router.put("/UpdateStuRoom/:roomId/student/:studentId", async (req, res) => { 
    const { roomId, studentId } = req.params;
    console.log(`roomid: ${roomId}, studentId: ${studentId}`);
    console.log("Updating student room assignment...");
    try {
        const user = await User.findById(studentId);
        if (user.roomId === roomId) {
            return res.status(400).json({ message: 'Student already in this room' });
        }
        const room = await Room.findByIdAndUpdate(
            user.roomId,
            { $inc: { occupied: -1 } },
            { new: true }
          );
          
        
        const updatedUser = await User.findByIdAndUpdate(studentId, { roomId: roomId }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const updatedRoom = await Room.findByIdAndUpdate(updatedUser.roomId, { $inc: { occupied: 1 } }, { new: true });
        if (!updatedRoom) {
            return res.status(404).json({ message: 'Room not found' });
        }
        res.status(200).json({ message: 'Student room updated successfully', student: updatedUser, room: updatedRoom });


        
    }
    catch (error) { 
        console.error(error);
        res.status(500).json({ message: 'Error updating student room' });
    }

})

// Route to update an existing room
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { roomNumber, capacity, hostel } = req.body;
    try {
        const updatedRoom = await Room.findByIdAndUpdate(id, { roomNumber, capacity, hostel }, { new: true });
        if (!updatedRoom) {
            return res.status(404).json({ message: 'Room not found' });
        }
        res.json(updatedRoom);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating room' });
    }
});

// Route to delete a room
router.delete('/:id', async (req, res) => {
    console.log("Deleting room...");
    const { id } = req.params;
    try {
        const room = await Room.findById(id);
        if (room.occupied > 0) {
            return res.status(400).json({ message: 'Cannot delete room with students assigned' });
        } 
        const deletedRoom = await Room.findByIdAndDelete(id);
        if (!deletedRoom) {
            return res.status(404).json({ message: 'Room not found' });
        }
        res.json({ message: 'Room deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting room' });
    }
});

// Route to delete a student from a room
router.delete('/:id/students/:studentId', async (req, res) => {
    const { id, studentId } = req.params;
    try {
        const room = await Room.findById(id);
        room.students = room.students.filter(student => student._id.toString() !== studentId);
        room.occupied = room.students.length; // Update the occupied count
        await room.save();
        res.json(room);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting student' });
    }
});



// Route to get students in a specific room
router.get('/:id/students', async (req, res) => {
    const { id } = req.params;
    try {
        const room = await Room.findById(id);
        res.json(room.students);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching students' });
    }
});

// Route to add a student to a room
router.post('/:id/students', async (req, res) => {
    const { id } = req.params;
    const { rollNumber, name } = req.body;
    try {
        const room = await Room.findById(id);
        if (room) {
            // Check if room is full
            if (room.occupied < room.capacity) {
                room.students.push({ rollNumber, name });
                room.occupied += 1; // Increment occupied count
                await room.save();
                res.status(201).json(room);
            } else {
                res.status(400).json({ message: 'Room is full' });
            }
        } else {
            res.status(404).json({ message: 'Room not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding student' });
    }
});




module.exports = router;