const db = require('../config/db');
const User = require('../models/userModel');

(async () => {
/*     console.log(await User.getAllUsers())
    return; */
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
          ProfilePicURL VARCHAR(100),
          Bio VARCHAR(500)
        );`,

        `CREATE TABLE Job (
          JobID VARCHAR(20) PRIMARY KEY,
          UserID VARCHAR(20) NOT NULL,
          Title VARCHAR(100),
          Description VARCHAR(5000),
          Timestamp DATE,
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
          Timestamp DATE,
          FOREIGN KEY (UserID) REFERENCES User(UserID)
        );`,

        `CREATE TABLE Quote (
          QuoteID VARCHAR(20) PRIMARY KEY,
          JobID VARCHAR(20) NOT NULL,
          UserID VARCHAR(20) NOT NULL,
          QuoteAmount FLOAT,
          QuoteMessage VARCHAR(500),
          Timestamp DATE,
          FOREIGN KEY (JobID) REFERENCES Job(JobID),
          FOREIGN KEY (UserID) REFERENCES User(UserID)
        );`,

        `CREATE TABLE Discussion (
            DiscussionID VARCHAR(20) PRIMARY KEY,
            JobID VARCHAR(20) NOT NULL,
            Status VARCHAR(50),
            FOREIGN KEY (JobID) REFERENCES Job(JobID)
        );`,

        `CREATE TABLE Message (
          MessageID VARCHAR(20) PRIMARY KEY,
          DiscussionID VARCHAR(20) NOT NULL,
          UserID VARCHAR(20) NOT NULL,
          MessageContent VARCHAR(1000),
          Timestamp DATE,
          FOREIGN KEY (DiscussionID) REFERENCES Discussion(DiscussionID),
          FOREIGN KEY (UserID) REFERENCES User(UserID)
        );`,

        `CREATE TABLE DiscussionUser (
          DiscussionUserID VARCHAR(20) PRIMARY KEY,
          DiscussionID VARCHAR(20) NOT NULL,
          UserID VARCHAR(20) NOT NULL,
          FOREIGN KEY (DiscussionID) REFERENCES Discussion(DiscussionID),
          FOREIGN KEY (UserID) REFERENCES User(UserID)
        );`,

        `CREATE TABLE Media (
          MediaID VARCHAR(20) PRIMARY KEY,
          DiscussionID VARCHAR(20) NOT NULL,
          UserID VARCHAR(20) NOT NULL,
          MediaType VARCHAR(50),
          MediaURL VARCHAR(50),
          Description VARCHAR(500),
          Timestamp DATE,
          FOREIGN KEY (DiscussionID) REFERENCES Discussion(DiscussionID),
          FOREIGN KEY (UserID) REFERENCES User(UserID)
        );`,

        `CREATE TABLE Dispute (
          DisputeID VARCHAR(20) PRIMARY KEY,
          JobID VARCHAR(20) NOT NULL,
          UserID VARCHAR(20) NOT NULL,
          Description VARCHAR(1000),
          Status VARCHAR(50),
          ResolutionDetails VARCHAR(500),
          FOREIGN KEY (JobID) REFERENCES Job(JobID),
          FOREIGN KEY (UserID) REFERENCES User(UserID)
        );`,

        `CREATE TABLE Report (
          ReportID VARCHAR(20) PRIMARY KEY,
          ReporterID VARCHAR(20) NOT NULL,
          ReportType VARCHAR(50),
          ReportDetails VARCHAR(500),
          Timestamp DATE,
          FOREIGN KEY (ReporterID) REFERENCES User(UserID)
        );`,

        `CREATE TABLE Review (
          ReviewID VARCHAR(20) PRIMARY KEY,
          JobID VARCHAR(20) NOT NULL,
          ReviewerID VARCHAR(20) NOT NULL,
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
          JobID VARCHAR(20) NOT NULL,
          SkillID VARCHAR(20) NOT NULL,
          FOREIGN KEY (JobID) REFERENCES Job(JobID),
          FOREIGN KEY (SkillID) REFERENCES Skill(SkillID)
        );`,

        `CREATE TABLE BannedUser (
            BannedUserID VARCHAR(20) PRIMARY KEY,
            UserID VARCHAR(20) NOT NULL,
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
      "INSERT INTO Job (JobID, UserID, Title, Description, Timestamp) VALUES ('job1', '123123123', 'Full Stack Developer', ?, '2023-01-15')",
      "INSERT INTO Job (JobID, UserID, Title, Description, Timestamp) VALUES ('job2', '123123123', 'Data Analyst', ?, '2023-02-20')",
      "INSERT INTO Job (JobID, UserID, Title, Description, Timestamp) VALUES ('job3', '123123123', 'Marketing Manager', ?, '2023-03-10')",
      "INSERT INTO Job (JobID, UserID, Title, Description, Timestamp) VALUES ('job4', '123123123', 'Software Engineer', ?, '2023-04-05')",
      "INSERT INTO Job (JobID, UserID, Title, Description, Timestamp) VALUES ('job5', '123123123', 'Financial Analyst', ?, '2023-05-18')",
      "INSERT INTO Job (JobID, UserID, Title, Description, Timestamp) VALUES ('job6', '123123123', 'UI/UX Designer', ?, '2023-06-22')",
      "INSERT INTO Job (JobID, UserID, Title, Description, Timestamp) VALUES ('job7', '123123123', 'Product Manager', ?, '2023-07-30')",
      "INSERT INTO Job (JobID, UserID, Title, Description, Timestamp) VALUES ('job8', '123123123', 'Human Resources Specialist', ?, '2023-08-12')",
      "INSERT INTO Job (JobID, UserID, Title, Description, Timestamp) VALUES ('job9', '123123123', 'Systems Administrator', ?, '2023-09-25')",
      "INSERT INTO Job (JobID, UserID, Title, Description, Timestamp) VALUES ('job10', '123123123', 'Content Writer', ?, '2023-10-14')"
    ];
    
    for(let a =0; a < sqlStatements.length; a++){
      await db.query(sqlStatements[a]);
    }

    const sqlStatement = `INSERT INTO User (UserID, UserType, FullName, Email, Password, Bio)
    VALUES ('123123123', 'regular', 'John Smith', 'john@example.com', 'hashedPassword', 'I am a new user.')`
    
    await db.query(sqlStatement)

    for(let a =0; a < jobInserts.length; a++){
        await db.query(jobInserts[a],[a%2 == 0 ? description2 : description1]);
    }

    console.log(await db.query('SHOW TABLES'))
})();