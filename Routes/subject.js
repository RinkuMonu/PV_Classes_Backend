const express = require('express');
const router = express.Router();
const subjectController = require('../Controllers/SubjectController'); 

router.post('/', subjectController.createSubject);
router.get('/', subjectController.getAllSubjects);

router.get('/by-batch/:batchId', subjectController.getSubjectsByBatch);


router.get('/:slug', subjectController.getSingleSubject);

router.put('/:id', subjectController.updateSubject);

router.delete('/:id', subjectController.deleteSubject);

module.exports = router;