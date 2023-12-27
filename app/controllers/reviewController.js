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
            const { JobID, ReviewedID, Rating, Comment } = req.body;

            const ReviewID = random.nanoid(15);
            const Timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
            const ReviewerID = req.session.authData ? req.session.authData.UserID : null
            if(!JobID || !ReviewedID || !Rating || !Comment){
                return res.status(400).json({ message: 'All fields are required' });
            }
            if(Rating > 5){
                return res.status(400).json({ message: 'Rating must be 5 or less' });

            }
            const review = {
                ReviewID,
                Timestamp,
                ReviewerID,
                ReviewedID,
                JobID,
                Rating,
                Comment
            }
            await Review.addReview(review);

            res.status(201).json({ message: 'Review added successfully'});
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
            const { JobID, UserID } = req.body;
            const reviews = await Review.getReviewByJobID(JobID,UserID);

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
