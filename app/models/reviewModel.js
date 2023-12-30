const db = require('../config/db');

const Review = {
    async getAllReviews() {
        try {
            const [rows] = await db.query('SELECT * FROM Review');
            return rows;
        } catch (error) {
            throw new Error(`Error fetching all reviews: ${error.message}`);
        }
    },

    async getReviewById(reviewId) {
        try {
            const [rows] = await db.query('SELECT * FROM Review WHERE ReviewID = ?', [reviewId]);
            return rows[0];
        } catch (error) {
            throw new Error(`Error fetching review: ${error.message}`);
        }
    },
    async getReviewByJobID(jobID, UserID) {
        try {
            const sql = `SELECT Review.*, User.UserID, User.FullName, User.Email, User.UserType, User.ProfilePicURL
            FROM Review
            INNER JOIN User ON Review.ReviewerID = User.UserID
            WHERE Review.JobID = ? AND Review.ReviewedID = ?`;
            const [rows] = await db.query(sql, [jobID,UserID]);
            return rows;
        } catch (error) {
            throw new Error(`Error fetching reviews by JobID: ${error.message}`);
        }
    },

    async addReview(review) {
        const { ReviewID, JobID, ReviewerID, ReviewedID, Rating, Comment, Timestamp } = review;
        try {
            const sql = 'INSERT INTO Review (ReviewID, JobID, ReviewerID, ReviewedID, Rating, Comment, Timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)';
            const [result] = await db.query(sql, [ReviewID, JobID, ReviewerID, ReviewedID, Rating, Comment, Timestamp]);
            return result.insertId;
        } catch (error) {
            throw new Error(`Error adding review: ${error.message}`);
        }
    },

    async deleteReview(reviewId) {
        try {
            const sql = 'DELETE FROM Review WHERE ReviewID = ?';
            const [result] = await db.query(sql, [reviewId]);
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error(`Error deleting review: ${error.message}`);
        }
    },

    async updateReview(reviewId, updatedReviewData) {
        const { Rating, Comment, Timestamp } = updatedReviewData;
        try {
            const sql = 'UPDATE Review SET Rating = ?, Comment = ?, Timestamp = ? WHERE ReviewID = ?';
            const [result] = await db.query(sql, [Rating, Comment, Timestamp, reviewId]);
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error(`Error updating review: ${error.message}`);
        }
    }

    // Other methods for Review CRUD operations
};

module.exports = Review;
