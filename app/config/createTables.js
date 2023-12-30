const db = require('../config/db');
const User = require('../models/userModel');
const bcrypt = require("bcrypt");
(async () => {
    const sqlAdmin = 'INSERT INTO User (UserID, UserType, FullName, Email, Password, ProfilePicURL, Balance, Bio) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    await db.query(sqlAdmin, ['adgewf2432ds', 'admin', 'Admin', 'admin@example.com', await bcrypt.hash("adminpass123", 10), '/assets/pfp.png', 10000, 'I am an Admin']);
    /* console.log(await User.getAllUsers()) */
    return;
/*     await db.query(`DROP DATABASE freelance_dolphin`);
    await db.query(`CREATE DATABASE freelance_dolphin`);
    console.log("DONE")
    return */
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
          QuoteAmount FLOAT,
          QuoteMessage VARCHAR(500),
          Timestamp DATETIME,
          FOREIGN KEY (JobID) REFERENCES Job(JobID) ON DELETE CASCADE,
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

    const newTables = [

    ]
    const description1 = `Join our dynamic team as a Full Stack Developer at Acme Innovations Inc. We are a forward-thinking organization at the forefront of innovation in healthcare technology, committed to delivering cutting-edge solutions that redefine industry standards. As we continue to expand our horizons, we are seeking an experienced and versatile Full Stack Developer to contribute to our ambitious projects and collaborate with our cross-functional teams.

Role Overview:

As a Full Stack Developer at Acme Innovations Inc., you will play a pivotal role in the design, development, and implementation of scalable software solutions. We are seeking a candidate with a solid foundation in JavaScript frameworks, encompassing proficiency in both front-end and back-end development. Your responsibilities will revolve around leveraging your expertise in technologies such as React.js, Node.js, and database management to create innovative, user-centric applications.

Key Responsibilities:

Design and implement intuitive and visually appealing user interfaces using React.js.
Develop robust server-side applications leveraging Node.js to ensure seamless functionality.
Manage and optimize databases to ensure efficient data storage, retrieval, and organization.
Collaborate closely with cross-functional teams, including designers and product managers, to translate concepts into functional applications.
Contribute to the continual improvement of software development processes through innovative ideas and solutions.
Stay updated with emerging technologies, industry trends, and best practices to drive innovation within the team.
Qualifications and Skills:

Proven experience as a Full Stack Developer or similar role, demonstrating proficiency in JavaScript frameworks.
Strong understanding and hands-on experience with React.js and Node.js.
Proficiency in database management, ensuring efficient data handling and organization.
Ability to work collaboratively in a team environment, communicate effectively, and contribute to innovative solutions.
An eye for detail and a commitment to delivering high-quality, user-friendly applications.
Adaptability and a proactive approach to learning new technologies and methodologies.
Why Join Us:

At Acme Innovations Inc., you'll have the opportunity to work in a stimulating environment that fosters creativity, innovation, and professional growth. We offer competitive compensation packages, opportunities for career advancement, and a collaborative culture that values diverse perspectives and contributions.

How to Apply:

If you're passionate about leveraging your skills to drive impactful solutions and thrive in a collaborative, fast-paced environment, we'd love to hear from you! Please submit your resume and a cover letter outlining your relevant experience and why you're excited about joining Acme Innovations Inc. to careers@acmeinnovations.com.

Acme Innovations Inc. is an equal opportunity employer. We celebrate diversity and are committed to creating an inclusive environment for all employees.`

    const description2 = `Join our vibrant team as a Full Stack Engineer at Spectrum Solutions Ltd. We are an innovative company pioneering advancements in the renewable energy sector, dedicated to delivering cutting-edge solutions that redefine industry benchmarks. As we expand our horizons, we're in search of an experienced and adaptable Full Stack Engineer to contribute to our ambitious projects and collaborate with multidisciplinary teams.

Role Overview:

As a Full Stack Engineer at Spectrum Solutions Ltd., you'll play a pivotal role in designing, developing, and deploying scalable software solutions. We're seeking a candidate with a strong foundation in JavaScript frameworks, excelling in both front-end and back-end development. Your responsibilities will center around utilizing expertise in technologies like Angular, Node.js, and database management to create innovative, user-centric applications.

Key Responsibilities:

Design and implement intuitive and visually appealing user interfaces using Angular.
Develop robust server-side applications leveraging Node.js to ensure seamless functionality.
Manage and optimize databases to ensure efficient data storage, retrieval, and organization.
Collaborate closely with cross-functional teams, including UX designers and product managers, to translate concepts into functional applications.
Contribute to the continuous enhancement of software development processes through inventive ideas and solutions.
Keep abreast of emerging technologies, industry trends, and best practices to drive innovation within the team.
Qualifications and Skills:

Demonstrated experience as a Full Stack Engineer or in a similar role, showcasing proficiency in JavaScript frameworks.
Solid understanding and hands-on experience with Angular and Node.js.
Proficiency in database management, ensuring efficient data handling and organization.
Ability to collaborate effectively within a team, communicate well, and contribute innovative solutions.
Attention to detail and a commitment to delivering high-quality, user-friendly applications.
Adaptability and a proactive approach to learning new technologies and methodologies.
Why Join Us:

At Spectrum Solutions Ltd., you'll work in an environment that nurtures creativity, innovation, and professional growth. We offer competitive compensation packages, opportunities for career progression, and a collaborative culture valuing diverse perspectives and contributions.

How to Apply:

If you're passionate about utilizing your skills to create impactful solutions and thrive in a collaborative, fast-paced environment, we'd love to hear from you! Please send your resume and a cover letter detailing your relevant experience and enthusiasm for joining Spectrum Solutions Ltd. to careers@spectrumsolutions.com.

Spectrum Solutions Ltd. is an equal opportunity employer committed to fostering diversity and creating an inclusive workplace for all employees.`
    const jobInserts = [
      "INSERT INTO Job (JobID, UserID, Title, Description, Status, Timestamp) VALUES ('job1', '123123123', 'Full Stack Developer', ?, 'Active', '2023-01-15')",
      "INSERT INTO Job (JobID, UserID, Title, Description, Status, Timestamp) VALUES ('job2', '123123123', 'Data Analyst', ?, 'Active', '2023-02-20')",
      "INSERT INTO Job (JobID, UserID, Title, Description, Status, Timestamp) VALUES ('job3', '123123123', 'Marketing Manager', ?, 'Archived', '2023-03-10')",
      "INSERT INTO Job (JobID, UserID, Title, Description, Status, Timestamp) VALUES ('job4', '123123123', 'Software Engineer', ?, 'Active', '2023-04-05')",
      "INSERT INTO Job (JobID, UserID, Title, Description, Status, Timestamp) VALUES ('job5', '123123123', 'Financial Analyst', ?, 'Archived', '2023-05-18')",
      "INSERT INTO Job (JobID, UserID, Title, Description, Status, Timestamp) VALUES ('job6', '123123123', 'UI/UX Designer', ?, 'Active', '2023-06-22')",
      "INSERT INTO Job (JobID, UserID, Title, Description, Status, Timestamp) VALUES ('job7', '123123123', 'Product Manager', ?, 'Archived', '2023-07-30')",
      "INSERT INTO Job (JobID, UserID, Title, Description, Status, Timestamp) VALUES ('job8', '123123123', 'Human Resources Specialist', ?, 'Active', '2023-08-12')",
      "INSERT INTO Job (JobID, UserID, Title, Description, Status, Timestamp) VALUES ('job9', '123123123', 'Systems Administrator', ?, 'Active', '2023-09-25')",
      "INSERT INTO Job (JobID, UserID, Title, Description, Status, Timestamp) VALUES ('job10', '123123123', 'Content Writer', ?, 'Archived', '2023-10-14')"
    ];
const skillInserts = [`INSERT INTO Skill (SkillID, SkillName) VALUES ('1001', 'Web Development');`,
`INSERT INTO Skill (SkillID, SkillName) VALUES ('1002', 'Graphic Design');`,
`INSERT INTO Skill (SkillID, SkillName) VALUES ('1003', 'Copywriting');`,
`INSERT INTO Skill (SkillID, SkillName) VALUES ('1004', 'Digital Marketing');`,
`INSERT INTO Skill (SkillID, SkillName) VALUES ('1005', 'Mobile App Development');`]
const jobSkillInserts = [
  // For Job 'Software Engineer' (job4)
  "INSERT INTO JobSkill (JobSkillID, JobID, SkillID) VALUES ('job4_skill1', 'job4', '1001');", // Web Development
  "INSERT INTO JobSkill (JobSkillID, JobID, SkillID) VALUES ('job4_skill2', 'job4', '1004');", // Digital Marketing

  // For Job 'Financial Analyst' (job5)
  "INSERT INTO JobSkill (JobSkillID, JobID, SkillID) VALUES ('job5_skill1', 'job5', '1003');", // Copywriting
  "INSERT INTO JobSkill (JobSkillID, JobID, SkillID) VALUES ('job5_skill2', 'job5', '1004');", // Digital Marketing

  // For Job 'UI/UX Designer' (job6)
  "INSERT INTO JobSkill (JobSkillID, JobID, SkillID) VALUES ('job6_skill1', 'job6', '1001');", // Web Development
  "INSERT INTO JobSkill (JobSkillID, JobID, SkillID) VALUES ('job6_skill2', 'job6', '1002');", // Graphic Design

  // For Job 'Product Manager' (job7)
  "INSERT INTO JobSkill (JobSkillID, JobID, SkillID) VALUES ('job7_skill1', 'job7', '1002');", // Graphic Design
  "INSERT INTO JobSkill (JobSkillID, JobID, SkillID) VALUES ('job7_skill2', 'job7', '1005');"  // Mobile App Development
];

const UserSkillInserts = [
  // For Job 'Software Engineer' (job4)
  "INSERT INTO UserSkill (UserSkillID, UserID, SkillID) VALUES ('123123123_skill1', '123123123', '1001');",
  "INSERT INTO UserSkill (UserSkillID, UserID, SkillID) VALUES ('123123123_skill2', '123123123', '1004');"
];

const escrowSQLStatements = [
  `INSERT INTO Escrow (EscrowID, JobID, UserID, Amount, Timestamp)
  VALUES ('escrow1', 'job1', '123123123', 1500.00, '2023-10-05');`,
  `INSERT INTO Escrow (EscrowID, JobID, UserID, Amount, Timestamp)
  VALUES ('escrow2', 'job2', '123123123', 2000.00, '2023-09-20');`,
  `INSERT INTO Escrow (EscrowID, JobID, UserID, Amount, Timestamp)
  VALUES ('escrow3', 'job3', '123123123', 1800.00, '2023-08-15');`
];

const contractSQLStatements = [
  `INSERT INTO Contract (ContractID, EscrowID, JobID, FreelancerID, EmployerID, Deadline, Timestamp)
  VALUES ('contract1', 'escrow1', 'job1', '123123124', '123123123', '2023-12-30', '2023-10-01');`,
  
  `INSERT INTO Contract (ContractID, EscrowID, JobID, FreelancerID, EmployerID, Deadline, Timestamp)
  VALUES ('contract2', 'escrow2', 'job2', '123123124', '123123123', '2023-12-25', '2023-09-15');`,
  
  `INSERT INTO Contract (ContractID, EscrowID, JobID, FreelancerID, EmployerID, Deadline, Timestamp)
  VALUES ('contract3', 'escrow3', 'job3', '123123124', '123123123', '2023-12-20', '2023-08-28');`
];

const fakeReviewsSQL = [
  `INSERT INTO Review (ReviewID, JobID, ReviewerID, ReviewedID, Rating, Comment, Timestamp) 
  VALUES ('review1_job1', 'job3', '123123124', '123123123', 4.5, 'Great work!', '2023-12-15')`,
  
  `INSERT INTO Review (ReviewID, JobID, ReviewerID, ReviewedID, Rating, Comment, Timestamp) 
  VALUES ('review1_job2', 'job5', '123123124', '123123123', 3.8, 'Satisfactory work.', '2023-12-17')`,
  
  `INSERT INTO Review (ReviewID, JobID, ReviewerID, ReviewedID, Rating, Comment, Timestamp) 
  VALUES ('review1_job4', 'job7', '123123124', '123123123', 4.7, 'Exceeded expectations!', '2023-12-19')`
];


    for(let a =0; a < sqlStatements.length; a++){
      await db.query(sqlStatements[a]);
    }

    const sqlStatement = `INSERT INTO User (UserID, UserType, FullName, Email, Password, ProfilePicURL, Bio)
    VALUES ('123123123', 'employer', 'John Smith', 'john@example.com', '${await bcrypt.hash("password", 10)}','/assets/pfp.png', 'I am John.')`

    const sqlStatement2 = `INSERT INTO User (UserID, UserType, FullName, Email, Password, ProfilePicURL, Bio)
    VALUES ('123123124', 'freelancer', 'Ali Ahmed', 'ahmed@example.com', '${await bcrypt.hash("password", 10)}','/assets/pfp.png', 'I am Ahmed.')`

    const sqlStatement3 = `INSERT INTO User (UserID, UserType, FullName, Email, Password, ProfilePicURL, Bio)
    VALUES ('123123125', 'admin', 'Mohammned Ali', 'mohd@example.com', '${await bcrypt.hash("adminPass123321", 10)}','/assets/pfp.png', 'I am an Admin.')`
    
/*     await db.query(sqlStatement)
    await db.query(sqlStatement2)
    await db.query(sqlStatement3)

    for(let a =0; a < jobInserts.length; a++){
        await db.query(jobInserts[a],[a%2 == 0 ? description2 : description1]);
    }

    for(let a =0; a < skillInserts.length; a++){
      await db.query(skillInserts[a]);
    }

    for(let a =0; a < jobSkillInserts.length; a++){
      await db.query(jobSkillInserts[a]);
    }
    for(let a =0; a < UserSkillInserts.length; a++){
      await db.query(UserSkillInserts[a]);
    }
    
    for(let a =0; a < escrowSQLStatements.length; a++){
      await db.query(escrowSQLStatements[a]);
    } */

/*     for(let a =0; a < contractSQLStatements.length; a++){
      await db.query(contractSQLStatements[a]);
    } */

/*     for(let a =0; a < fakeReviewsSQL.length; a++){
      await db.query(fakeReviewsSQL[a]);
    } */

    console.log(await db.query('SHOW TABLES'))
})();