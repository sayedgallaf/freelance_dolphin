const db = require('../config/db');
const User = require('../models/userModel');
const bcrypt = require("bcrypt");
(async () => {
    /* const sqlAdmin = 'INSERT INTO User (UserID, UserType, FullName, Email, Password, ProfilePicURL, Balance, Bio) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    await db.query(sqlAdmin, ['adgewf2432ds', 'admin', 'Admin', 'admin@example.com', await bcrypt.hash("adminpass123", 10), '/assets/pfp.png', 10000, 'I am an Admin']); */
    /* console.log(await User.getAllUsers()) */
    /* return; */

/*     await db.query(`SELECT *
    INTO OUTFILE '/path/to/output/file.txt'
    FIELDS TERMINATED BY ','
    LINES TERMINATED BY '\n'
    FROM your_table_name;`);
    return */

    await db.query(`DROP DATABASE freelance_dolphin`);
    await db.query(`CREATE DATABASE freelance_dolphin`);
    console.log("DONE")
    return
    const sqlStatements = [
        `CREATE TABLE User (
          UserID VARCHAR(20) PRIMARY KEY,
          UserType VARCHAR(20),
          FullName VARCHAR(50),
          Email VARCHAR(50),
          Password VARCHAR(100),
          ProfilePicURL VARCHAR(100),
          Balance DECIMAL(15, 2) DEFAULT 0.00,
          Bio VARCHAR(500)
        );`,

        `CREATE TABLE Job (
          JobID VARCHAR(20) PRIMARY KEY,
          UserID VARCHAR(20) NOT NULL,
          Title VARCHAR(100),
          Description VARCHAR(5000),
          Status VARCHAR(20),
          Timestamp DATETIME,
          FOREIGN KEY (UserID) REFERENCES User(UserID)
        );`,

        `CREATE TABLE Skill (
          SkillID VARCHAR(20) PRIMARY KEY,
          SkillName VARCHAR(50)
        );`,

        `CREATE TABLE UserSkill (
          UserSkillID VARCHAR(20) PRIMARY KEY,
          UserID VARCHAR(20) NOT NULL,
          SkillID VARCHAR(20) NOT NULL,
          FOREIGN KEY (UserID) REFERENCES User(UserID),
          FOREIGN KEY (SkillID) REFERENCES Skill(SkillID)
        );`,

        `CREATE TABLE Transaction (
          TransactionID VARCHAR(20) PRIMARY KEY,
          UserID VARCHAR(20) NOT NULL,
          TransactionType VARCHAR(50),
          Description VARCHAR(500),
          Amount FLOAT,
          Timestamp DATETIME,
          FOREIGN KEY (UserID) REFERENCES User(UserID)
        );`,

        `CREATE TABLE Social (
          SocialID VARCHAR(20) PRIMARY KEY,
          UserID VARCHAR(20) NOT NULL,
          URL VARCHAR(500),
          SocialType VARCHAR(50),
          FOREIGN KEY (UserID) REFERENCES User(UserID)
        );`,

        `CREATE TABLE Quote (
          QuoteID VARCHAR(20) PRIMARY KEY,
          JobID VARCHAR(20) NOT NULL,
          UserID VARCHAR(20) NOT NULL,
          DiscussionID VARCHAR(20) NOT NULL,
          QuoteAmount FLOAT,
          QuoteMessage VARCHAR(500),
          Timestamp DATETIME,
          FOREIGN KEY (JobID) REFERENCES Job(JobID) ON DELETE CASCADE,
          FOREIGN KEY (DiscussionID) REFERENCES Discussion(DiscussionID) ON DELETE CASCADE,
          FOREIGN KEY (UserID) REFERENCES User(UserID)
        );`,

        `CREATE TABLE Discussion (
            DiscussionID VARCHAR(20) PRIMARY KEY,
            JobID VARCHAR(20) NOT NULL,
            Timestamp DATETIME,
            Status VARCHAR(50),
            FOREIGN KEY (JobID) REFERENCES Job(JobID) ON DELETE CASCADE
        );`,

        `CREATE TABLE Message (
          MessageID VARCHAR(20) PRIMARY KEY,
          DiscussionID VARCHAR(20) NOT NULL,
          UserID VARCHAR(20) NOT NULL,
          MessageContent VARCHAR(1000),
          Timestamp DATETIME,
          FOREIGN KEY (DiscussionID) REFERENCES Discussion(DiscussionID) ON DELETE CASCADE,
          FOREIGN KEY (UserID) REFERENCES User(UserID)
        );`,

        `CREATE TABLE DiscussionUser (
          DiscussionUserID VARCHAR(20) PRIMARY KEY,
          DiscussionID VARCHAR(20) NOT NULL,
          UserID VARCHAR(20) NOT NULL,
          FOREIGN KEY (DiscussionID) REFERENCES Discussion(DiscussionID) ON DELETE CASCADE,
          FOREIGN KEY (UserID) REFERENCES User(UserID)
        );`,

        `CREATE TABLE Media (
          MediaID VARCHAR(20) PRIMARY KEY,
          DiscussionID VARCHAR(20) NOT NULL,
          UserID VARCHAR(20) NOT NULL,
          MediaType VARCHAR(500),
          MediaURL VARCHAR(50),
          Timestamp DATETIME,
          FOREIGN KEY (DiscussionID) REFERENCES Discussion(DiscussionID) ON DELETE CASCADE,
          FOREIGN KEY (UserID) REFERENCES User(UserID)
        );`,

        `CREATE TABLE Report (
          ReportID VARCHAR(20) PRIMARY KEY,
          ReporterID VARCHAR(20) NOT NULL,
          ReportType VARCHAR(50),
          ReportDetails VARCHAR(500),
          Timestamp DATETIME,
          FOREIGN KEY (ReporterID) REFERENCES User(UserID)
        );`,

        `CREATE TABLE Review (
          ReviewID VARCHAR(20) PRIMARY KEY,
          JobID VARCHAR(20) NOT NULL,
          ReviewerID VARCHAR(20) NOT NULL,
          ReviewedID VARCHAR(20) NOT NULL,
          Rating FLOAT,
          Comment VARCHAR(500),
          Timestamp DATETIME,
          FOREIGN KEY (JobID) REFERENCES Job(JobID) ON DELETE CASCADE,
          FOREIGN KEY (ReviewerID) REFERENCES User(UserID),
          FOREIGN KEY (ReviewedID) REFERENCES User(UserID)
        );`,

        `CREATE TABLE Contact (
          ContactID VARCHAR(20) PRIMARY KEY,
          UserID VARCHAR(20),
          ContactMethod VARCHAR(50),
          ContactDetails VARCHAR(500),
          Message VARCHAR(500),
          Timestamp DATETIME,
          FOREIGN KEY (UserID) REFERENCES User(UserID)
        );`,

        `CREATE TABLE JobSkill (
          JobSkillID VARCHAR(20) PRIMARY KEY,
          JobID VARCHAR(20) NOT NULL,
          SkillID VARCHAR(20) NOT NULL,
          FOREIGN KEY (JobID) REFERENCES Job(JobID) ON DELETE CASCADE,
          FOREIGN KEY (SkillID) REFERENCES Skill(SkillID)
        );`,

        `CREATE TABLE BannedUser (
            BannedUserID VARCHAR(20) PRIMARY KEY,
            UserID VARCHAR(20) NOT NULL,
            Timestamp DATETIME,
            bannedUntil DATETIME,
            FOREIGN KEY (UserID) REFERENCES User(UserID)
        );`,
        `CREATE TABLE Escrow (
          EscrowID VARCHAR(20) PRIMARY KEY,
          JobID VARCHAR(20) NOT NULL,
          UserID VARCHAR(20) NOT NULL,
          Amount DECIMAL(15, 2),
          Timestamp DATETIME,
          FOREIGN KEY (JobID) REFERENCES Job(JobID) ON DELETE CASCADE,
          FOREIGN KEY (UserID) REFERENCES User(UserID)
      );`,
      `CREATE TABLE Contract (
        ContractID VARCHAR(20) PRIMARY KEY,
        EscrowID VARCHAR(20),
        JobID VARCHAR(20),
        FreelancerID VARCHAR(20),
        EmployerID VARCHAR(20),
        Deadline DATETIME,
        Timestamp DATETIME,
        FOREIGN KEY (JobID) REFERENCES Job(JobID) ON DELETE CASCADE,
        FOREIGN KEY (FreelancerID) REFERENCES User(UserID),
        FOREIGN KEY (EmployerID) REFERENCES User(UserID)
      );`,
      `CREATE TABLE Dispute (
        DisputeID VARCHAR(20) PRIMARY KEY,
        ContractID VARCHAR(20) NOT NULL,
        JobID VARCHAR(20) NOT NULL,
        UserID VARCHAR(20) NOT NULL,
        Description VARCHAR(1000),
        Status VARCHAR(50),
        Timestamp DATETIME,
        FOREIGN KEY (JobID) REFERENCES Job(JobID) ON DELETE CASCADE,
        FOREIGN KEY (ContractID) REFERENCES Contract(ContractID) ON DELETE CASCADE,
        FOREIGN KEY (UserID) REFERENCES User(UserID)
      );`,

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
    for(let a =0; a < sqlStatements.length; a++){
      await db.query(sqlStatements[a]);
    }

    const sqlAdmin = 'INSERT INTO User (UserID, UserType, FullName, Email, Password, ProfilePicURL, Balance, Bio) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    await db.query(sqlAdmin, ['adgewf2432ds', 'admin', 'Admin', 'sayedgallaf@gmail.com', await bcrypt.hash("adminpass123", 10), '/assets/pfp.png', 10000, 'I am an Admin']);


    console.log(await db.query('SHOW TABLES'))

})();