const express = require('express');
const router = express.Router();
const {
    createPosting,
    getPostings,
    updatePosting,
    deletePosting
} = require('./internship-posting.controller');
const { protect, authorize } = require('../../middleware/auth');

// ✅ Public - all students can browse faculty-posted opportunities
router.get('/', getPostings);

// 🔒 Protected - only faculty & admin can manage postings
router.post('/', protect, authorize('admin', 'faculty'), createPosting);
router.put('/:id', protect, authorize('admin', 'faculty'), updatePosting);
router.delete('/:id', protect, authorize('admin', 'faculty'), deletePosting);

module.exports = router;
