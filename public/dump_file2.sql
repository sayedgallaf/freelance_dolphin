-- MySQL dump 10.13  Distrib 8.2.0, for Win64 (x86_64)
--
-- Host: localhost    Database: freelance_dolphin
-- ------------------------------------------------------
-- Server version	8.2.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `banneduser`
--

DROP TABLE IF EXISTS `banneduser`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `banneduser` (
  `BannedUserID` varchar(20) NOT NULL,
  `UserID` varchar(20) NOT NULL,
  `Timestamp` datetime DEFAULT NULL,
  `bannedUntil` datetime DEFAULT NULL,
  PRIMARY KEY (`BannedUserID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `banneduser_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `banneduser`
--

LOCK TABLES `banneduser` WRITE;
/*!40000 ALTER TABLE `banneduser` DISABLE KEYS */;
/*!40000 ALTER TABLE `banneduser` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact`
--

DROP TABLE IF EXISTS `contact`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact` (
  `ContactID` varchar(20) NOT NULL,
  `UserID` varchar(20) DEFAULT NULL,
  `ContactMethod` varchar(50) DEFAULT NULL,
  `ContactDetails` varchar(500) DEFAULT NULL,
  `Message` varchar(500) DEFAULT NULL,
  `Timestamp` datetime DEFAULT NULL,
  PRIMARY KEY (`ContactID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `contact_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact`
--

LOCK TABLES `contact` WRITE;
/*!40000 ALTER TABLE `contact` DISABLE KEYS */;
/*!40000 ALTER TABLE `contact` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contract`
--

DROP TABLE IF EXISTS `contract`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contract` (
  `ContractID` varchar(20) NOT NULL,
  `EscrowID` varchar(20) DEFAULT NULL,
  `JobID` varchar(20) DEFAULT NULL,
  `FreelancerID` varchar(20) DEFAULT NULL,
  `EmployerID` varchar(20) DEFAULT NULL,
  `Deadline` datetime DEFAULT NULL,
  `Timestamp` datetime DEFAULT NULL,
  PRIMARY KEY (`ContractID`),
  KEY `JobID` (`JobID`),
  KEY `FreelancerID` (`FreelancerID`),
  KEY `EmployerID` (`EmployerID`),
  CONSTRAINT `contract_ibfk_1` FOREIGN KEY (`JobID`) REFERENCES `job` (`JobID`) ON DELETE CASCADE,
  CONSTRAINT `contract_ibfk_2` FOREIGN KEY (`FreelancerID`) REFERENCES `user` (`UserID`),
  CONSTRAINT `contract_ibfk_3` FOREIGN KEY (`EmployerID`) REFERENCES `user` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contract`
--

LOCK TABLES `contract` WRITE;
/*!40000 ALTER TABLE `contract` DISABLE KEYS */;
/*!40000 ALTER TABLE `contract` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `discussion`
--

DROP TABLE IF EXISTS `discussion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `discussion` (
  `DiscussionID` varchar(20) NOT NULL,
  `JobID` varchar(20) NOT NULL,
  `Timestamp` datetime DEFAULT NULL,
  `Status` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`DiscussionID`),
  KEY `JobID` (`JobID`),
  CONSTRAINT `discussion_ibfk_1` FOREIGN KEY (`JobID`) REFERENCES `job` (`JobID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `discussion`
--

LOCK TABLES `discussion` WRITE;
/*!40000 ALTER TABLE `discussion` DISABLE KEYS */;
/*!40000 ALTER TABLE `discussion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `discussionuser`
--

DROP TABLE IF EXISTS `discussionuser`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `discussionuser` (
  `DiscussionUserID` varchar(20) NOT NULL,
  `DiscussionID` varchar(20) NOT NULL,
  `UserID` varchar(20) NOT NULL,
  PRIMARY KEY (`DiscussionUserID`),
  KEY `DiscussionID` (`DiscussionID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `discussionuser_ibfk_1` FOREIGN KEY (`DiscussionID`) REFERENCES `discussion` (`DiscussionID`) ON DELETE CASCADE,
  CONSTRAINT `discussionuser_ibfk_2` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `discussionuser`
--

LOCK TABLES `discussionuser` WRITE;
/*!40000 ALTER TABLE `discussionuser` DISABLE KEYS */;
/*!40000 ALTER TABLE `discussionuser` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dispute`
--

DROP TABLE IF EXISTS `dispute`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dispute` (
  `DisputeID` varchar(20) NOT NULL,
  `ContractID` varchar(20) NOT NULL,
  `JobID` varchar(20) NOT NULL,
  `UserID` varchar(20) NOT NULL,
  `Description` varchar(1000) DEFAULT NULL,
  `Status` varchar(50) DEFAULT NULL,
  `Timestamp` datetime DEFAULT NULL,
  PRIMARY KEY (`DisputeID`),
  KEY `JobID` (`JobID`),
  KEY `ContractID` (`ContractID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `dispute_ibfk_1` FOREIGN KEY (`JobID`) REFERENCES `job` (`JobID`) ON DELETE CASCADE,
  CONSTRAINT `dispute_ibfk_2` FOREIGN KEY (`ContractID`) REFERENCES `contract` (`ContractID`) ON DELETE CASCADE,
  CONSTRAINT `dispute_ibfk_3` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dispute`
--

LOCK TABLES `dispute` WRITE;
/*!40000 ALTER TABLE `dispute` DISABLE KEYS */;
/*!40000 ALTER TABLE `dispute` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `escrow`
--

DROP TABLE IF EXISTS `escrow`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `escrow` (
  `EscrowID` varchar(20) NOT NULL,
  `JobID` varchar(20) NOT NULL,
  `UserID` varchar(20) NOT NULL,
  `Amount` decimal(15,2) DEFAULT NULL,
  `Timestamp` datetime DEFAULT NULL,
  PRIMARY KEY (`EscrowID`),
  KEY `JobID` (`JobID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `escrow_ibfk_1` FOREIGN KEY (`JobID`) REFERENCES `job` (`JobID`) ON DELETE CASCADE,
  CONSTRAINT `escrow_ibfk_2` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `escrow`
--

LOCK TABLES `escrow` WRITE;
/*!40000 ALTER TABLE `escrow` DISABLE KEYS */;
/*!40000 ALTER TABLE `escrow` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `job`
--

DROP TABLE IF EXISTS `job`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `job` (
  `JobID` varchar(20) NOT NULL,
  `UserID` varchar(20) NOT NULL,
  `Title` varchar(100) DEFAULT NULL,
  `Description` varchar(5000) DEFAULT NULL,
  `Status` varchar(20) DEFAULT NULL,
  `Timestamp` datetime DEFAULT NULL,
  PRIMARY KEY (`JobID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `job_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `job`
--

LOCK TABLES `job` WRITE;
/*!40000 ALTER TABLE `job` DISABLE KEYS */;
/*!40000 ALTER TABLE `job` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobskill`
--

DROP TABLE IF EXISTS `jobskill`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `jobskill` (
  `JobSkillID` varchar(20) NOT NULL,
  `JobID` varchar(20) NOT NULL,
  `SkillID` varchar(20) NOT NULL,
  PRIMARY KEY (`JobSkillID`),
  KEY `JobID` (`JobID`),
  KEY `SkillID` (`SkillID`),
  CONSTRAINT `jobskill_ibfk_1` FOREIGN KEY (`JobID`) REFERENCES `job` (`JobID`) ON DELETE CASCADE,
  CONSTRAINT `jobskill_ibfk_2` FOREIGN KEY (`SkillID`) REFERENCES `skill` (`SkillID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobskill`
--

LOCK TABLES `jobskill` WRITE;
/*!40000 ALTER TABLE `jobskill` DISABLE KEYS */;
/*!40000 ALTER TABLE `jobskill` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `media`
--

DROP TABLE IF EXISTS `media`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `media` (
  `MediaID` varchar(20) NOT NULL,
  `DiscussionID` varchar(20) NOT NULL,
  `UserID` varchar(20) NOT NULL,
  `MediaType` varchar(500) DEFAULT NULL,
  `MediaURL` varchar(50) DEFAULT NULL,
  `Timestamp` datetime DEFAULT NULL,
  PRIMARY KEY (`MediaID`),
  KEY `DiscussionID` (`DiscussionID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `media_ibfk_1` FOREIGN KEY (`DiscussionID`) REFERENCES `discussion` (`DiscussionID`) ON DELETE CASCADE,
  CONSTRAINT `media_ibfk_2` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `media`
--

LOCK TABLES `media` WRITE;
/*!40000 ALTER TABLE `media` DISABLE KEYS */;
/*!40000 ALTER TABLE `media` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `message`
--

DROP TABLE IF EXISTS `message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `message` (
  `MessageID` varchar(20) NOT NULL,
  `DiscussionID` varchar(20) NOT NULL,
  `UserID` varchar(20) NOT NULL,
  `MessageContent` varchar(1000) DEFAULT NULL,
  `Timestamp` datetime DEFAULT NULL,
  PRIMARY KEY (`MessageID`),
  KEY `DiscussionID` (`DiscussionID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `message_ibfk_1` FOREIGN KEY (`DiscussionID`) REFERENCES `discussion` (`DiscussionID`) ON DELETE CASCADE,
  CONSTRAINT `message_ibfk_2` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `message`
--

LOCK TABLES `message` WRITE;
/*!40000 ALTER TABLE `message` DISABLE KEYS */;
/*!40000 ALTER TABLE `message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quote`
--

DROP TABLE IF EXISTS `quote`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quote` (
  `QuoteID` varchar(20) NOT NULL,
  `JobID` varchar(20) NOT NULL,
  `UserID` varchar(20) NOT NULL,
  `QuoteAmount` float DEFAULT NULL,
  `QuoteMessage` varchar(500) DEFAULT NULL,
  `Timestamp` datetime DEFAULT NULL,
  PRIMARY KEY (`QuoteID`),
  KEY `JobID` (`JobID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `quote_ibfk_1` FOREIGN KEY (`JobID`) REFERENCES `job` (`JobID`) ON DELETE CASCADE,
  CONSTRAINT `quote_ibfk_2` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quote`
--

LOCK TABLES `quote` WRITE;
/*!40000 ALTER TABLE `quote` DISABLE KEYS */;
/*!40000 ALTER TABLE `quote` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `report`
--

DROP TABLE IF EXISTS `report`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `report` (
  `ReportID` varchar(20) NOT NULL,
  `ReporterID` varchar(20) NOT NULL,
  `ReportType` varchar(50) DEFAULT NULL,
  `ReportDetails` varchar(500) DEFAULT NULL,
  `Timestamp` datetime DEFAULT NULL,
  PRIMARY KEY (`ReportID`),
  KEY `ReporterID` (`ReporterID`),
  CONSTRAINT `report_ibfk_1` FOREIGN KEY (`ReporterID`) REFERENCES `user` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `report`
--

LOCK TABLES `report` WRITE;
/*!40000 ALTER TABLE `report` DISABLE KEYS */;
/*!40000 ALTER TABLE `report` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `review`
--

DROP TABLE IF EXISTS `review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `review` (
  `ReviewID` varchar(20) NOT NULL,
  `JobID` varchar(20) NOT NULL,
  `ReviewerID` varchar(20) NOT NULL,
  `ReviewedID` varchar(20) NOT NULL,
  `Rating` float DEFAULT NULL,
  `Comment` varchar(500) DEFAULT NULL,
  `Timestamp` datetime DEFAULT NULL,
  PRIMARY KEY (`ReviewID`),
  KEY `JobID` (`JobID`),
  KEY `ReviewerID` (`ReviewerID`),
  KEY `ReviewedID` (`ReviewedID`),
  CONSTRAINT `review_ibfk_1` FOREIGN KEY (`JobID`) REFERENCES `job` (`JobID`) ON DELETE CASCADE,
  CONSTRAINT `review_ibfk_2` FOREIGN KEY (`ReviewerID`) REFERENCES `user` (`UserID`),
  CONSTRAINT `review_ibfk_3` FOREIGN KEY (`ReviewedID`) REFERENCES `user` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review`
--

LOCK TABLES `review` WRITE;
/*!40000 ALTER TABLE `review` DISABLE KEYS */;
/*!40000 ALTER TABLE `review` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `skill`
--

DROP TABLE IF EXISTS `skill`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `skill` (
  `SkillID` varchar(20) NOT NULL,
  `SkillName` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`SkillID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `skill`
--

LOCK TABLES `skill` WRITE;
/*!40000 ALTER TABLE `skill` DISABLE KEYS */;
/*!40000 ALTER TABLE `skill` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `social`
--

DROP TABLE IF EXISTS `social`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `social` (
  `SocialID` varchar(20) NOT NULL,
  `UserID` varchar(20) NOT NULL,
  `URL` varchar(500) DEFAULT NULL,
  `SocialType` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`SocialID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `social_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `social`
--

LOCK TABLES `social` WRITE;
/*!40000 ALTER TABLE `social` DISABLE KEYS */;
/*!40000 ALTER TABLE `social` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transaction`
--

DROP TABLE IF EXISTS `transaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transaction` (
  `TransactionID` varchar(20) NOT NULL,
  `UserID` varchar(20) NOT NULL,
  `TransactionType` varchar(50) DEFAULT NULL,
  `Description` varchar(500) DEFAULT NULL,
  `Amount` float DEFAULT NULL,
  `Timestamp` datetime DEFAULT NULL,
  PRIMARY KEY (`TransactionID`),
  KEY `UserID` (`UserID`),
  CONSTRAINT `transaction_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transaction`
--

LOCK TABLES `transaction` WRITE;
/*!40000 ALTER TABLE `transaction` DISABLE KEYS */;
/*!40000 ALTER TABLE `transaction` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `UserID` varchar(20) NOT NULL,
  `UserType` varchar(20) DEFAULT NULL,
  `FullName` varchar(50) DEFAULT NULL,
  `Email` varchar(50) DEFAULT NULL,
  `Password` varchar(100) DEFAULT NULL,
  `ProfilePicURL` varchar(100) DEFAULT NULL,
  `Balance` decimal(15,2) DEFAULT '0.00',
  `Bio` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`UserID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES ('adgewf2432ds','admin','Admin','sayedgallaf@gmail.com','$2b$10$sq9YeW0UewRFRrMXpUfDCeLqtxHW4G/aQ1Ujg7ORD0jgm3Zhyw6yK','/assets/pfp.png',10000.00,'I am an Admin');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userskill`
--

DROP TABLE IF EXISTS `userskill`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userskill` (
  `UserSkillID` varchar(20) NOT NULL,
  `UserID` varchar(20) NOT NULL,
  `SkillID` varchar(20) NOT NULL,
  PRIMARY KEY (`UserSkillID`),
  KEY `UserID` (`UserID`),
  KEY `SkillID` (`SkillID`),
  CONSTRAINT `userskill_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`),
  CONSTRAINT `userskill_ibfk_2` FOREIGN KEY (`SkillID`) REFERENCES `skill` (`SkillID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userskill`
--

LOCK TABLES `userskill` WRITE;
/*!40000 ALTER TABLE `userskill` DISABLE KEYS */;
/*!40000 ALTER TABLE `userskill` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-12-30 17:48:16
