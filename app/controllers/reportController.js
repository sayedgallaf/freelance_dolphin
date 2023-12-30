const Report = require('../models/reportModel');
const random = require("nanoid")
const {sendToAdmins} = require('../config/email');

const ReportController = {
    async createReport(req, res) {
        try {
            const ReportID = random.nanoid(15);
            const Timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
            const ReporterID = req.session.authData ? req.session.authData.UserID : null
            const { ReportType, ReportDetails } = req.body;

            if (!ReporterID || !ReportType || !ReportDetails || !Timestamp) {
                return res.status(400).json({ message: 'All fields are required' });
            }

            const newReport = {
                ReportID,
                ReporterID,
                ReportType,
                ReportDetails,
                Timestamp
            };
            sendToAdmins("Freelance Dolphin: Report Created", `Report: ${ReportType}\nInformation: ${ReportDetails}`)

            const createdReportId = await Report.createReport(newReport);

            res.status(201).json({ message: 'Report created successfully', createdReportId });
        } catch (error) {
            res.status(500).json({ message: `Error: ${error.message}` });
        }
    },

    async deleteReport(req, res) {
        try {
            const { reportID } = req.params;

            const deleted = await Report.deleteReport(reportID);

            if (deleted) {
                res.status(200).json({ message: 'Report deleted successfully' });
            } else {
                res.status(404).json({ message: 'Report not found' });
            }
        } catch (error) {
            res.status(500).json({ message: `Error: ${error.message}` });
        }
    },

    async updateReport(req, res) {
        try {
            const { reportID } = req.params;
            const updatedReportData = req.body;

            const updated = await Report.updateReport(reportID, updatedReportData);

            if (updated) {
                res.status(200).json({ message: 'Report updated successfully' });
            } else {
                res.status(404).json({ message: 'Report not found or no fields to update' });
            }
        } catch (error) {
            res.status(500).json({ message: `Error: ${error.message}` });
        }
    },

    async getReport(req, res) {
        try {
            const { reportID } = req.params;

            const report = await Report.getReport(reportID);

            if (report) {
                res.status(200).json({ report });
            } else {
                res.status(404).json({ message: 'Report not found' });
            }
        } catch (error) {
            res.status(500).json({ message: `Error: ${error.message}` });
        }
    },

    async getAllReports(req, res) {
        try {
            const reports = await Report.getAllReports();
            res.status(200).json({ reports });
        } catch (error) {
            res.status(500).json({ message: `Error: ${error.message}` });
        }
    }

    // Other methods for handling reports
};

module.exports = ReportController;
