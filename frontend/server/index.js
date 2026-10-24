const express = require('express');
const connectDB = require('./config/database');
require('dotenv').config();
const cors = require('cors')
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const semesterRoutes = require('./routes/semesterRoutes');
const subjectRoutes = require('./routes/subjectRoutes');
const noteRoutes = require('./routes/noteRoutes');
const savedNoteRoutes = require('./routes/savedNoteRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
})); 
app.use(express.json());  
app.use(cookieParser());
connectDB();
// Route registration
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/semesters', semesterRoutes);
app.use('/api/subjects', subjectRoutes); 
app.use('/api/notes', noteRoutes);
app.use('/api/saved-notes', savedNoteRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/', (req, res) => {
  res.send('Server is running');
});

 
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
 
