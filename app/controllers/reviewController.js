const Review = require('../models/reviewModel');
const random = require('nanoid');

const ReviewController = {
    async getReviewById(req, res) {
        try {
            const { ReviewID } = req.body;
            const review = await Review.getReviewById(ReviewID);

            if (!review) {
                return res.status(404).json({ message: 'Review not found' });
            }

            res.status(200).json({ review });
        } catch (error) {
            res.status(500).json({ message: `Error: ${error.message}` });
        }
    },

    async addReview(req, res) {
        try {
            const reviewData = req.body;

            reviewData.ReviewID = random.nanoid(15);
            reviewData.Timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');

            const createdReviewID = await Review.addReview(reviewData);

            res.status(201).json({ message: 'Review added successfully', ReviewID: createdReviewID });
        } catch (error) {
            res.status(500).json({ message: `Error: ${error.message}` });
        }
    },

    async updateReview(req, res) {
        try {
            const { ReviewID } = req.body;
            const updatedReviewData = req.body;
            const reviewUpdated = await Review.updateReview(ReviewID, updatedReviewData);

            if (!reviewUpdated) {
                return res.status(404).json({ message: 'Review not found or could not be updated' });
            }

            res.status(200).json({ message: 'Review updated successfully' });
        } catch (error) {
            res.status(500).json({ message: `Error: ${error.message}` });
        }
    },

    async deleteReview(req, res) {
        try {
            const { ReviewID } = req.body;
            const reviewDeleted = await Review.deleteReview(ReviewID);

            if (!reviewDeleted) {
                return res.status(404).json({ message: 'Review not found or could not be deleted' });
            }

            res.status(200).json({ message: 'Review deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: `Error: ${error.message}` });
        }
    },
    async getReviewByJobID(req, res) {
        try {
            const { JobID } = req.body;
            const reviews = await Review.getReviewByJobID(JobID);

            if (!reviews || reviews.length === 0) {
                return res.status(404).json({ message: 'No reviews found for the specified JobID' });
            }
            
            res.status(200).json({ reviews });
        } catch (error) {
            res.status(500).json({ message: `Error: ${error.message}` });
        }
    }
};

module.exports = ReviewController;
