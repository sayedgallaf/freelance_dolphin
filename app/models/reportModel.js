const db = require('../config/db');

const Report = {
    async createReport(report) {
        const { ReportID, ReporterID, ReportType, ReportDetails, Timestamp } = report;
        try {
            const sql = 'INSERT INTO Report (ReportID, ReporterID, ReportType, ReportDetails, Timestamp) VALUES (?, ?, ?, ?, ?)';
            const [result] = await db.query(sql, [ReportID, ReporterID, ReportType, ReportDetails, Timestamp]);

            return result.insertId; // Return the ID of the newly created report
        } catch (error) {
            throw new Error(`Error creating report: ${error.message}`);
        }
    },

    async deleteReport(reportID) {
        try {
            const sql = 'DELETE FROM Report WHERE ReportID = ?';
            const [result] = await db.query(sql, [reportID]);

            return result.affectedRows > 0; // Return true if the report was deleted successfully
        } catch (error) {
            throw new Error(`Error deleting report: ${error.message}`);
        }
    },

    async updateReport(reportID, updatedReportData) {
        const { ReportType, ReportDetails, Timestamp } = updatedReportData;
        try {
            let updateFields = '';
            const updateValues = [];

            if (ReportType) {
                updateFields += 'ReportType = ?, ';
                updateValues.push(ReportType);
            }
            if (ReportDetails) {
                updateFields += 'ReportDetails = ?, ';
                updateValues.push(ReportDetails);
            }
            if (Timestamp) {
                updateFields += 'Timestamp = ?, ';
                updateValues.push(Timestamp);
            }

            // Remove trailing comma and space from updateFields
            updateFields = updateFields.replace(/,\s*$/, '');

            if (updateFields) {
                updateValues.push(reportID); // Push the report ID to the end for WHERE clause

                const sql = `UPDATE Report SET ${updateFields} WHERE ReportID = ?`;
                const [result] = await db.query(sql, updateValues);

                return result.affectedRows > 0; // Return true if the report was updated successfully
            } else {
                throw new Error('No fields to update');
            }
        } catch (error) {
            throw new Error(`Error updating report: ${error.message}`);
        }
    },

    async getReport(reportID) {
        try {
            const [rows] = await db.query('SELECT * FROM Report WHERE ReportID = ?', [reportID]);
            return rows.length > 0 ? rows[0] : null; // Return the report object or null if not found
        } catch (error) {
            throw new Error(`Error fetching report: ${error.message}`);
        }
    },

    async getAllReports() {
        try {
            const [rows] = await db.query('SELECT * FROM Report');
            return rows;
        } catch (error) {
            throw new Error(`Error fetching all reports: ${error.message}`);
        }
    }

    // Other methods for reports
};

module.exports = Report;
