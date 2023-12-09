const db = require('../config/db');
const User = require('../models/userModel');

(async () => {
    console.log(await User.getAllUsers())
    return;
    /* await db.query(`DROP DATABASE freelance_dolphin`);
    await db.query(`CREATE DATABASE freelance_dolphin`);
    console.log("DONE")
    return; */
    const sqlStatements = [
        `CREATE TABLE User (
          UserID VARCHAR(20) PRIMARY KEY,
          UserType VARCHAR(20),
          FullName VARCHAR(50),
          Email VARCHAR(50),
          Password VARCHAR(100),
          Bio VARCHAR(500)
        );`,

        `CREATE TABLE Job (
          JobID VARCHAR(20) PRIMARY KEY,
          UserID VARCHAR(20),
          Title VARCHAR(100),
          Description VARCHAR(5000),
          FOREIGN KEY (UserID) REFERENCES User(UserID)
        );`,

        `CREATE TABLE Skill (
          SkillID VARCHAR(20) PRIMARY KEY,
          SkillName VARCHAR(50)
        );`,

        `CREATE TABLE UserSkill (
          UserSkillID VARCHAR(20) PRIMARY KEY,
          UserID VARCHAR(20),
          SkillID VARCHAR(20),
          FOREIGN KEY (UserID) REFERENCES User(UserID),
          FOREIGN KEY (SkillID) REFERENCES Skill(SkillID)
        );`,

        `CREATE TABLE Transaction (
          TransactionID VARCHAR(20) PRIMARY KEY,
          UserID VARCHAR(20),
          TransactionType VARCHAR(50),
          Description VARCHAR(500),
          Amount FLOAT,
          Timestamp DATE,
          FOREIGN KEY (UserID) REFERENCES User(UserID)
        );`,

        `CREATE TABLE Quote (
          QuoteID VARCHAR(20) PRIMARY KEY,
          JobID VARCHAR(20),
          UserID VARCHAR(20),
          QuoteAmount FLOAT,
          QuoteMessage VARCHAR(500),
          Timestamp DATE,
          FOREIGN KEY (JobID) REFERENCES Job(JobID),
          FOREIGN KEY (UserID) REFERENCES User(UserID)
        );`,

        `CREATE TABLE Discussion (
            DiscussionID VARCHAR(20) PRIMARY KEY,
            JobID VARCHAR(20),
            Status VARCHAR(50),
            FOREIGN KEY (JobID) REFERENCES Job(JobID)
        );`,

        `CREATE TABLE Message (
          MessageID VARCHAR(20) PRIMARY KEY,
          DiscussionID VARCHAR(20),
          UserID VARCHAR(20),
          MessageContent VARCHAR(1000),
          Timestamp DATE,
          FOREIGN KEY (DiscussionID) REFERENCES Discussion(DiscussionID),
          FOREIGN KEY (UserID) REFERENCES User(UserID)
        );`,

        `CREATE TABLE DiscussionUser (
          DiscussionUserID VARCHAR(20) PRIMARY KEY,
          DiscussionID VARCHAR(20),
          UserID VARCHAR(20),
          FOREIGN KEY (DiscussionID) REFERENCES Discussion(DiscussionID),
          FOREIGN KEY (UserID) REFERENCES User(UserID)
        );`,

        `CREATE TABLE Media (
          MediaID VARCHAR(20) PRIMARY KEY,
          DiscussionID VARCHAR(20),
          UserID VARCHAR(20),
          MediaType VARCHAR(50),
          MediaURL VARCHAR(50),
          Description VARCHAR(500),
          Timestamp DATE,
          FOREIGN KEY (DiscussionID) REFERENCES Discussion(DiscussionID),
          FOREIGN KEY (UserID) REFERENCES User(UserID)
        );`,

        `CREATE TABLE Dispute (
          DisputeID VARCHAR(20) PRIMARY KEY,
          JobID VARCHAR(20),
          UserID VARCHAR(20),
          Description VARCHAR(1000),
          Status VARCHAR(50),
          ResolutionDetails VARCHAR(500),
          FOREIGN KEY (JobID) REFERENCES Job(JobID),
          FOREIGN KEY (UserID) REFERENCES User(UserID)
        );`,

        `CREATE TABLE Report (
          ReportID VARCHAR(20) PRIMARY KEY,
          ReporterID VARCHAR(20),
          ReportType VARCHAR(50),
          ReportDetails VARCHAR(500),
          Timestamp DATE,
          FOREIGN KEY (ReporterID) REFERENCES User(UserID)
        );`,

        `CREATE TABLE Review (
          ReviewID VARCHAR(20) PRIMARY KEY,
          JobID VARCHAR(20),
          ReviewerID VARCHAR(20),
          Rating FLOAT,
          Comment VARCHAR(500),
          Timestamp DATE,
          FOREIGN KEY (JobID) REFERENCES Job(JobID),
          FOREIGN KEY (ReviewerID) REFERENCES User(UserID)
        );`,

        `CREATE TABLE Contact (
          ContactID VARCHAR(20) PRIMARY KEY,
          UserID VARCHAR(20),
          ContactMethod VARCHAR(50),
          ContactDetails VARCHAR(500),
          Message VARCHAR(500),
          Timestamp DATE,
          FOREIGN KEY (UserID) REFERENCES User(UserID)
        );`,

        `CREATE TABLE JobSkill (
          JobSkillID VARCHAR(20) PRIMARY KEY,
          JobID VARCHAR(20),
          SkillID VARCHAR(20),
          FOREIGN KEY (JobID) REFERENCES Job(JobID),
          FOREIGN KEY (SkillID) REFERENCES Skill(SkillID)
        );`,

        `CREATE TABLE BannedUser (
            BannedUserID VARCHAR(20) PRIMARY KEY,
            UserID VARCHAR(20),
            Timestamp DATE,
            bannedUntil DATE,
            FOREIGN KEY (UserID) REFERENCES User(UserID)
        );`

/*         `ALTER TABLE User
          ADD FOREIGN KEY (UserID) REFERENCES Job(UserID),
          ADD FOREIGN KEY (UserID) REFERENCES UserSkill(UserID),
          ADD FOREIGN KEY (UserID) REFERENCES Transaction(UserID),
          ADD FOREIGN KEY (UserID) REFERENCES Quote(UserID),
          ADD FOREIGN KEY (UserID) REFERENCES DiscussionUser(UserID),
          ADD FOREIGN KEY (UserID) REFERENCES Media(UserID),
          ADD FOREIGN KEY (UserID) REFERENCES Dispute(UserID),
          ADD FOREIGN KEY (UserID) REFERENCES Report(ReporterID),
          ADD FOREIGN KEY (UserID) REFERENCES Review(ReviewerID),
          ADD FOREIGN KEY (UserID) REFERENCES Contact(UserID),
          ADD FOREIGN KEY (UserID) REFERENCES Message(UserID),
          ADD FOREIGN KEY (UserID) REFERENCES BannedUser(UserID);`,

        `ALTER TABLE Job
          ADD FOREIGN KEY (JobID) REFERENCES Quote(JobID),
          ADD FOREIGN KEY (JobID) REFERENCES Discussion(JobID),
          ADD FOREIGN KEY (JobID) REFERENCES Dispute(JobID),
          ADD FOREIGN KEY (JobID) REFERENCES Review(JobID);`,

        `ALTER TABLE Skill
          ADD FOREIGN KEY (SkillID) REFERENCES UserSkill(SkillID);`,

        `ALTER TABLE Discussion
          ADD FOREIGN KEY (DiscussionID) REFERENCES Message(DiscussionID),
          ADD FOREIGN KEY (DiscussionID) REFERENCES DiscussionUser(DiscussionID);` */
    ];

    const newTables = [

    ]

    for(let a =0; a < sqlStatements.length; a++){
        await db.query(sqlStatements[a]);
    }

    console.log(await db.query('SHOW TABLES'))
})();