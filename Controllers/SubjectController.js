const Subject = require('../Models/subject'); 
const slugify = require('slugify'); 

exports.createSubject = async (req, res) => {
    try {
        const { title, description, status, course } = req.body;

        // Title से slug generate करना
        // unique: true constraint के कारण यह आवश्यक है
        const slug = slugify(title, { lower: true, strict: true });

        const newSubject = new Subject({
            title,
            slug,
            description,
            status,
            course
        });

        const savedSubject = await newSubject.save();

        res.status(201).json({
            success: true,
            data: savedSubject
        });
    } catch (error) {
        // Handle unique constraint violation (title/slug already exists)
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'A subject with this title already exists.'
            });
        }
        res.status(400).json({
            success: false,
            message: 'Subject creation failed',
            error: error.message
        });
    }
};

exports.getAllSubjects = async (req, res) => {
    try {
        const { course, status } = req.query;
        let query = {};

        // Course ID के आधार पर फ़िल्टर करना
        if (course) query.course = course;
        if (status) query.status = status;
        
        const subjects = await Subject.find(query)
            .sort({ title: 1 }) 
            // Optional: Related Course details populate करना
            .populate('course', 'title slug'); 

        res.status(200).json({
            success: true,
            count: subjects.length,
            data: subjects
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Could not fetch subjects',
            error: error.message
        });
    }
};

exports.getSingleSubject = async (req, res) => {
    try {
        const subject = await Subject.findOne({ slug: req.params.slug })
             // Course details populate करना
            .populate('course', 'title slug');

        if (!subject) {
            return res.status(404).json({
                success: false,
                message: 'Subject not found'
            });
        }

        res.status(200).json({
            success: true,
            data: subject
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Could not fetch subject',
            error: error.message
        });
    }
};

exports.updateSubject = async (req, res) => {
    try {
        let updateData = req.body;
        
        // Agar title update ho raha hai toh naya slug bhi generate karna
        if (updateData.title) {
            updateData.slug = slugify(updateData.title, { lower: true, strict: true });
        }

        const updatedSubject = await Subject.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true } // New document return karna aur validation run karna
        );

        if (!updatedSubject) {
            return res.status(404).json({
                success: false,
                message: 'Subject not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Subject updated successfully',
            data: updatedSubject
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Subject update failed',
            error: error.message
        });
    }
};

exports.deleteSubject = async (req, res) => {
    try {
        const deletedSubject = await Subject.findByIdAndDelete(req.params.id);

        if (!deletedSubject) {
            return res.status(404).json({
                success: false,
                message: 'Subject not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Subject deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Could not delete subject',
            error: error.message
        });
    }
};