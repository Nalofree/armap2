-- MySQL dump 10.13  Distrib 5.5.23, for Win32 (x86)
--
-- Host: localhost    Database: armap2_db
-- ------------------------------------------------------
-- Server version	5.5.23

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `images`
--

DROP TABLE IF EXISTS `images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `images` (
  `image_id` int(11) NOT NULL AUTO_INCREMENT,
  `image_filename` varchar(255) DEFAULT NULL,
  `image_office` int(11) DEFAULT NULL,
  `image_min` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`image_id`)
) ENGINE=InnoDB AUTO_INCREMENT=168 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `images`
--

LOCK TABLES `images` WRITE;
/*!40000 ALTER TABLE `images` DISABLE KEYS */;
INSERT INTO `images` VALUES (1,'upload-1476097395911.jpg',NULL,NULL),(2,'upload-1476097442597.png',NULL,NULL),(3,'upload-1476097492067.jpg',NULL,NULL),(4,'upload-1476098100350.png',NULL,NULL),(5,'upload-1476098132953.jpg',NULL,NULL),(7,'upload-1476099710988.png',NULL,NULL),(8,'upload-1476099721349.jpg',NULL,NULL),(9,'upload-1476099721351.png',NULL,NULL),(10,'upload-1476099721353.jpg',NULL,NULL),(11,'upload-1476099849873.jpg',NULL,NULL),(12,'upload-1476099849888.png',NULL,NULL),(13,'upload-1476099849891.jpg',NULL,NULL),(14,'upload-1476100417465.png',NULL,NULL),(15,'upload-1476100491900.jpg',NULL,NULL),(16,'upload-1476100526283.jpg',NULL,NULL),(20,'upload-1476101400653.jpg',NULL,NULL),(21,'upload-1476101400687.png',NULL,NULL),(22,'upload-1476101400688.jpg',NULL,NULL),(23,'upload-1476101620164.jpg',NULL,NULL),(25,'upload-1476101620180.jpg',NULL,NULL),(34,'upload-1476102274435.png',NULL,NULL),(42,'upload-1476103031789.png',NULL,NULL),(43,'upload-1476103031791.png',NULL,NULL),(44,'upload-1476103031808.png',NULL,NULL),(46,'upload-1476103656704.jpg',NULL,NULL),(47,'upload-1476103994666.jpg',NULL,NULL),(48,'upload-1476104002707.png',NULL,NULL),(49,'upload-1476104024152.png',NULL,NULL),(50,'upload-1476104038090.png',NULL,NULL),(51,'upload-1476104455623.jpg',NULL,NULL),(52,'upload-1476180545573.jpg',NULL,NULL),(53,'upload-1476180545577.png',NULL,NULL),(54,'upload-1476180545585.jpg',NULL,NULL),(56,'upload-1476271180069.png',NULL,NULL),(57,'upload-1476271180074.png',NULL,NULL),(58,'upload-1476272129784.jpg',NULL,NULL),(59,'upload-1476272242405.png',NULL,NULL),(60,'upload-1476272352280.png',NULL,NULL),(61,'upload-1476272437279.png',NULL,NULL),(62,'upload-1476272862888.png',NULL,NULL),(63,'upload-1476434279719.jpg',NULL,NULL),(64,'upload-1476434279723.png',NULL,NULL),(65,'upload-1476434279724.png',NULL,NULL),(66,'upload-1476435220767.png',NULL,NULL),(67,'upload-1476435251807.png',NULL,NULL),(68,'upload-1476435338770.png',NULL,NULL),(69,'upload-1476440393859.png',NULL,NULL),(70,'upload-1476440571000.png',NULL,NULL),(71,'upload-1476442478623.png',NULL,NULL),(72,'upload-1476442700563.jpg',NULL,NULL),(73,'upload-1476442700566.png',NULL,NULL),(74,'upload-1476442700570.jpg',NULL,NULL),(75,'upload-1476442700587.png',NULL,NULL),(76,'upload-1476442933140.jpg',NULL,NULL),(77,'upload-1476442933146.png',NULL,NULL),(78,'upload-1476442933149.jpg',NULL,NULL),(79,'upload-1476443039393.png',NULL,NULL),(80,'upload-1476443039399.png',NULL,NULL),(81,'upload-1476443039406.png',NULL,NULL),(82,'upload-1476443346696.jpg',NULL,NULL),(83,'upload-1476443346698.png',NULL,NULL),(84,'upload-1476443346701.png',NULL,NULL),(85,'upload-1476444375682.jpg',NULL,NULL),(86,'upload-1476444375685.png',NULL,NULL),(87,'upload-1476444375692.jpg',NULL,NULL),(88,'upload-1476444448423.jpg',NULL,NULL),(89,'upload-1476444448425.png',NULL,NULL),(90,'upload-1476444619340.jpg',NULL,NULL),(91,'upload-1476444619341.png',NULL,NULL),(92,'upload-1476444713584.jpg',NULL,NULL),(93,'upload-1476444713591.png',NULL,NULL),(94,'upload-1476445162011.png',NULL,NULL),(95,'upload-1476445630140.jpg',NULL,NULL),(96,'upload-1476445630142.png',NULL,NULL),(97,'upload-1476445815518.png',NULL,NULL),(98,'upload-1476445853473.png',NULL,NULL),(99,'upload-1476448358040.png',NULL,NULL),(100,'upload-1476448358045.png',NULL,NULL),(101,'upload-1476448483821.jpg',NULL,NULL),(102,'upload-1476448483823.png',NULL,NULL),(103,'upload-1476448560044.jpg',NULL,NULL),(104,'upload-1476448560047.png',NULL,NULL),(105,'upload-1476448702210.png',NULL,NULL),(106,'upload-1476448735050.png',NULL,NULL),(107,'upload-1476584335060.png',NULL,NULL),(108,'upload-1476584541253.png',NULL,NULL),(109,'upload-1476585013462.png',NULL,NULL),(110,'upload-1476586497621.png',NULL,NULL),(111,'upload-1476586837803.jpg',NULL,NULL),(112,'upload-1476587272631.jpg',NULL,NULL),(113,'upload-1476587610547.jpg',NULL,NULL),(114,'upload-1476587814702.png',NULL,NULL),(115,'upload-1476596941034.jpg',NULL,NULL),(116,'upload-1476597066731.png',NULL,NULL),(117,'upload-1476598284795.jpg',NULL,NULL),(118,'upload-1476598939341.png',NULL,NULL),(119,'upload-1476599292823.jpg',NULL,NULL),(120,'upload-1476599552227.png',NULL,NULL),(122,'upload-1476599883929.png',NULL,NULL),(123,'upload-1476599966904.jpg',NULL,NULL),(124,'upload-1476600035892.png',NULL,NULL),(125,'upload-1476600203356.png',NULL,NULL),(126,'upload-1476601111701.jpg',NULL,NULL),(128,'upload-1476601259059.png',NULL,NULL),(129,'upload-1476601332248.jpg',NULL,NULL),(130,'upload-1476601391030.png',NULL,NULL),(131,'upload-1476602043409.png',NULL,NULL),(132,'upload-1476602126159.png',NULL,NULL),(133,'upload-1476602271535.png',NULL,NULL),(135,'upload-1476602454934.png',NULL,NULL),(136,'upload-1476602570632.png',NULL,NULL),(137,'upload-1476602634314.png',NULL,NULL),(138,'upload-1476602684959.jpg',NULL,NULL),(139,'upload-1476605090844.png',NULL,NULL),(140,'upload-1476605206916.jpg',NULL,NULL),(141,'upload-1476605384463.png',NULL,NULL),(142,'upload-1476606157397.png',NULL,NULL),(143,'upload-1476606239720.png',NULL,NULL),(144,'upload-1476606481240.png',NULL,NULL),(145,'upload-1476606481278.jpg',NULL,NULL),(146,'upload-1476607341307.jpg',NULL,NULL),(147,'upload-1476607341314.png',NULL,NULL),(148,'upload-1476607341317.png',NULL,NULL),(149,'upload-1476609348752.png',45,NULL),(150,'upload-1476609348780.jpg',45,NULL),(151,'upload-1476609348813.png',45,NULL),(152,'upload-1476609348815.jpg',45,NULL),(157,'upload-1476612848847.jpg',NULL,NULL),(158,'upload-1476613444787.jpg',NULL,NULL),(163,'upload-1476761053474.jpg',53,NULL),(164,'upload-1476761053486.jpg',53,NULL),(165,'upload-1476761150384.png',54,NULL),(166,'upload-1476761150386.jpg',54,NULL),(167,'upload-1476872958594.png',55,NULL);
/*!40000 ALTER TABLE `images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `objects`
--

DROP TABLE IF EXISTS `objects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `objects` (
  `object_id` int(11) NOT NULL AUTO_INCREMENT,
  `object_name` varchar(60) DEFAULT NULL,
  `object_create` datetime DEFAULT NULL,
  `object_author` int(11) DEFAULT NULL,
  `object_coords` varchar(40) DEFAULT NULL,
  `object_adres` varchar(255) DEFAULT NULL,
  `object_publish` int(2) DEFAULT NULL,
  `object_show` int(2) DEFAULT NULL,
  `object_type` int(11) DEFAULT NULL,
  `object_cover` int(11) DEFAULT NULL,
  PRIMARY KEY (`object_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `objects`
--

LOCK TABLES `objects` WRITE;
/*!40000 ALTER TABLE `objects` DISABLE KEYS */;
INSERT INTO `objects` VALUES (14,'╨Ы╨╡╤А╨╝╨╛╨╜╤В╨╛╨뿯▽','2016-10-17 11:33:40',19,'52.263012,104.25928','%D0%A0%D0%BE%D1%81%D1%81%D0%B8%D1%8F,%20%D0%98%D1%80%D0%BA%D1%83%D1%82%D1%81%D0%BA,%20%D1%83%D0%BB%D0%B8%D1%86%D0%B0%20%D0%9B%D0%B5%D1%80%D0%BC%D0%BE%D0%BD%D1%82%D0%BE%D0%B2%D0%B0,%2090/1',0,1,5,NULL),(15,'╨Ш╤А╨У╨г╨Я╨б','2016-10-18 11:22:39',19,'52.270711,104.261194','%D0%A0%D0%BE%D1%81%D1%81%D0%B8%D1%8F,%20%D0%98%D1%80%D0%BA%D1%83%D1%82%D1%81%D0%BA,%20%D1%83%D0%BB%D0%B8%D1%86%D0%B0%20%D0%A7%D0%B5%D1%80%D0%BD%D1%8B%D1%88%D0%B5%D0%B2%D1%81%D0%BA%D0%BE%D0%B3%D0%BE,%2015',0,1,5,NULL);
/*!40000 ALTER TABLE `objects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `objtypes`
--

DROP TABLE IF EXISTS `objtypes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `objtypes` (
  `objtype_id` int(11) NOT NULL AUTO_INCREMENT,
  `objtype_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`objtype_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `objtypes`
--

LOCK TABLES `objtypes` WRITE;
/*!40000 ALTER TABLE `objtypes` DISABLE KEYS */;
INSERT INTO `objtypes` VALUES (1,'%D0%A2%D0%BE%D1%80%D0%B3%D0%BE%D0%B2%D1%8B%D0%B9+%D1%86%D0%B5%D0%BD%D1%82%D1%80'),(2,'%D0%A1%D0%B0%D0%BC%D0%BE%D1%81%D1%82%D0%BE%D1%8F%D1%82%D0%B5%D0%BB%D1%8C%D0%BD%D0%BE%D0%B5+%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D0%B5'),(3,'%D0%A2%D0%BE%D1%80%D0%B3%D0%BE%D0%B2%D0%BE-%D1%80%D0%B0%D0%B7%D0%B2%D0%BB%D0%B5%D0%BA%D0%B0%D1%82%D0%B5%D0%BB%D1%8C%D0%BD%D1%8B%D0%B9+%D1%86%D0%B5%D0%BD%D1%82%D1%80'),(4,'%D0%96%D0%B8%D0%BB%D0%BE%D0%B9+%D0%B4%D0%BE%D0%BC'),(5,'%D0%91%D0%B8%D0%B7%D0%BD%D0%B5%D1%81-%D1%86%D0%B5%D0%BD%D1%82%D1%80');
/*!40000 ALTER TABLE `objtypes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `offices`
--

DROP TABLE IF EXISTS `offices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `offices` (
  `office_id` int(11) NOT NULL AUTO_INCREMENT,
  `office_name` varchar(255) DEFAULT NULL,
  `office_create` datetime DEFAULT NULL,
  `office_author` int(11) DEFAULT NULL,
  `office_description` varchar(255) DEFAULT NULL,
  `office_area` varchar(11) DEFAULT NULL,
  `office_height` varchar(11) DEFAULT NULL,
  `office_subprice` varchar(11) DEFAULT NULL,
  `office_totalptice` varchar(11) DEFAULT NULL,
  `office_tacked` int(11) DEFAULT NULL,
  `office_cover` int(11) DEFAULT NULL,
  `office_publish` int(2) DEFAULT NULL,
  `office_object` int(11) DEFAULT NULL,
  `office_show` int(2) DEFAULT NULL,
  `office_phone` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`office_id`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `offices`
--

LOCK TABLES `offices` WRITE;
/*!40000 ALTER TABLE `offices` DISABLE KEYS */;
INSERT INTO `offices` VALUES (53,'╨Р404','2016-10-18 11:24:23',19,NULL,'30','2.5','500',NULL,0,163,0,15,1,'+7 (111) 111-1111'),(54,'╨Р402','2016-10-18 11:25:53',19,NULL,'40','2.5','600',NULL,0,165,0,15,1,'+7 (222) 222-2222'),(55,'%D0%90524','2016-10-19 18:29:20',19,NULL,'10','2.5','700',NULL,0,167,0,15,1,'+7 (111) 111-1111');
/*!40000 ALTER TABLE `offices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `options`
--

DROP TABLE IF EXISTS `options`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `options` (
  `option_id` int(11) NOT NULL AUTO_INCREMENT,
  `option_name` varchar(255) DEFAULT NULL,
  `option_author` int(11) DEFAULT NULL,
  `option_create` datetime DEFAULT NULL,
  `option_publish` int(2) DEFAULT NULL,
  `option_type` int(11) DEFAULT NULL,
  PRIMARY KEY (`option_id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `options`
--

LOCK TABLES `options` WRITE;
/*!40000 ALTER TABLE `options` DISABLE KEYS */;
INSERT INTO `options` VALUES (1,'%D0%9C%D0%B0%D0%B3%D0%B0%D0%B7%D0%B8%D0%BD',NULL,NULL,NULL,1),(2,'%D0%A1%D0%B2%D0%BE%D0%B1%D0%BE%D0%B4%D0%BD%D0%BE%D0%B3%D0%BE%20%D0%BD%D0%B0%D0%B7%D0%BD%D0%B0%D1%87%D0%B5%D0%BD%D0%B8%D1%8F',NULL,NULL,NULL,1),(3,'%D0%A1%D0%BA%D0%BB%D0%B0%D0%B4',NULL,NULL,NULL,1),(4,'%D0%A2%D0%BE%D1%80%D0%B3%D0%BE%D0%B2%D1%8B%D0%B9%20%D0%BF%D0%B0%D0%B2%D0%B8%D0%BB%D1%8C%D0%BE%D0%BD',NULL,NULL,NULL,1),(5,'%D0%9E%D1%84%D0%B8%D1%81',NULL,NULL,NULL,1),(6,'%D0%92%D1%8B%D0%B2%D0%BE%D0%B7%20%D0%A2%D0%91%D0%9E',NULL,NULL,NULL,2),(7,'%D0%9A%D0%BE%D0%BC%D0%BC%D1%83%D0%BD%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B5%20%D1%83%D1%81%D0%BB%D1%83%D0%B3%D0%B8',NULL,NULL,NULL,2),(8,'%D0%AD%D0%BB%D0%B5%D0%BA%D1%82%D1%80%D0%BE%D1%8D%D0%BD%D0%B5%D1%80%D0%B3%D0%B8%D1%8F',NULL,NULL,NULL,2),(9,'%D0%9E%D1%85%D1%80%D0%B0%D0%BD%D0%B0%20%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D1%8F',NULL,NULL,NULL,2),(10,'%D0%A3%D0%B1%D0%BE%D1%80%D0%BA%D0%B0%20%D0%BF%D0%BB%D0%BE%D1%89%D0%B0%D0%B4%D0%B5%D0%B9%20%D0%BE%D0%B1%D1%89%D0%B5%D0%B3%D0%BE%20%D0%BF%D0%BE%D0%BB%D1%8C%D0%B7%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F',NULL,NULL,NULL,2),(11,'%D0%AD%D1%81%D0%BA%D0%B0%D0%BB%D0%B0%D1%82%D0%BE%D1%80',NULL,NULL,NULL,2),(12,'%D0%9B%D0%B8%D1%84%D1%82',NULL,NULL,NULL,2),(13,'%D0%A0%D0%B5%D0%BC%D0%BE%D0%BD%D1%82%20%D0%B2%20%D1%81%D1%87%D1%91%D1%82%20%D0%B0%D1%80%D0%B5%D0%BD%D0%B4%D1%8B',NULL,NULL,NULL,3),(14,'%D0%90%D1%80%D0%B5%D0%BD%D0%B4%D0%BD%D1%8B%D0%B5%20%D0%BA%D0%B0%D0%BD%D0%B8%D0%BA%D1%83%D0%BB%D1%8B',NULL,NULL,NULL,3),(15,'%D0%9A%D1%80%D1%83%D0%B3%D0%BB%D0%BE%D1%81%D1%83%D1%82%D0%BE%D1%87%D0%BD%D1%8B%D0%B9%20%D0%B4%D0%BE%D1%81%D1%82%D1%83%D0%BF%20%D0%B2%20%D0%B7%D0%B4%D0%B0%D0%BD%D0%B8%D0%B5',NULL,NULL,NULL,3),(16,'%D0%A3%D0%B1%D0%BE%D1%80%D0%BA%D0%B0%20%D0%BE%D1%84%D0%B8%D1%81%D0%B0',NULL,NULL,NULL,3),(17,'Irknet%20Telecom',NULL,NULL,NULL,4),(18,'%D0%90%D0%B9%D1%81%D1%82%D1%80%D0%B8%D0%BC',NULL,NULL,NULL,4),(19,'%D0%91%D0%B0%D0%B9%D0%BA%D0%B0%D0%BB%20%D0%A2%D0%B5%D0%BB%D0%B5%D0%BF%D0%BE%D1%80%D1%82',NULL,NULL,NULL,4),(20,'%D0%91%D0%B0%D0%B9%D0%BA%D0%B0%D0%BB%20%D0%A2%D1%80%D0%B0%D0%BD%D1%81%20%D0%A2%D0%B5%D0%BB%D0%B5%D0%BA%D0%BE%D0%BC',NULL,NULL,NULL,4),(21,'%D0%91%D0%B8%D0%BB%D0%B0%D0%B9%D0%BD',NULL,NULL,NULL,4),(22,'%D0%94%D0%B5%D0%BB%D0%BE%D0%B2%D0%B0%D1%8F%20%D1%81%D0%B5%D1%82%D1%8C',NULL,NULL,NULL,4),(23,'%D0%94%D0%BE%D0%BC.%D1%80%D1%83',NULL,NULL,NULL,4),(24,'%D0%9C%D0%B5%D0%B3%D0%B0%D0%BF%D0%BE%D0%BB%D0%B8%D1%81%20%D0%A2%D0%B5%D0%BB%D0%B5%D0%BA%D0%BE%D0%BC',NULL,NULL,NULL,4),(25,'%D0%9C%D0%A2%D0%A1',NULL,NULL,NULL,4),(26,'%D0%9E%D1%80%D0%B8%D0%B5%D0%BD%D1%82-%D0%A2%D0%B5%D0%BB%D0%B5%D0%BA%D0%BE%D0%BC',NULL,NULL,NULL,4),(27,'%D0%A0%D0%BE%D1%81%D1%82%D0%B5%D0%BB%D0%B5%D0%BA%D0%BE%D0%BC',NULL,NULL,NULL,4),(28,'%D0%A1%D0%B2%D1%8F%D0%B7%D1%8C%D1%82%D1%80%D0%B0%D0%BD%D0%B7%D0%B8%D1%82',NULL,NULL,NULL,4),(29,'%D0%A1%D0%B5%D1%82%D0%B5%D0%B2%D0%BE%D0%B5%20%D0%B0%D1%82%D0%B5%D0%BB%D1%8C%D0%B5',NULL,NULL,NULL,4),(30,'%D0%A1%D0%BA%D0%B0%D0%B9%20%D0%A1%D0%B8%D1%81%D1%82%D0%B5%D0%BC%D1%81',NULL,NULL,NULL,4),(31,'%D0%A2%D0%B0%D0%BA%D1%81%D0%BE%D1%84%D0%BE%D0%BD',NULL,NULL,NULL,4),(32,'%D0%A2%D0%B5%D0%BB%D0%B52',NULL,NULL,NULL,4),(33,'%D0%AD%D0%A0%20%D0%A2%D0%B5%D0%BB%D0%B5%D0%BA%D0%BE%D0%BC%20%D0%A5%D0%BE%D0%BB%D0%B4%D0%B8%D0%BD%D0%B3',NULL,NULL,NULL,4);
/*!40000 ALTER TABLE `options` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `options_offices`
--

DROP TABLE IF EXISTS `options_offices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `options_offices` (
  `link_id` int(11) NOT NULL AUTO_INCREMENT,
  `link_office` int(11) DEFAULT NULL,
  `link_option` int(11) DEFAULT NULL,
  PRIMARY KEY (`link_id`)
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `options_offices`
--

LOCK TABLES `options_offices` WRITE;
/*!40000 ALTER TABLE `options_offices` DISABLE KEYS */;
INSERT INTO `options_offices` VALUES (1,35,1),(2,35,6),(3,35,13),(4,35,17),(5,43,1),(6,43,6),(7,43,13),(8,43,17),(9,44,1),(10,44,6),(11,44,13),(12,44,17),(13,45,1),(14,45,6),(15,45,13),(16,45,17),(50,53,5),(51,53,8),(52,53,9),(53,53,10),(54,53,12),(55,53,13),(56,53,16),(57,53,22),(58,53,25),(59,54,5),(60,54,8),(61,54,9),(62,54,10),(63,54,12),(64,54,13),(65,54,16),(66,54,22),(67,55,5),(68,55,6),(69,55,13),(70,55,17);
/*!40000 ALTER TABLE `options_offices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `opttypes`
--

DROP TABLE IF EXISTS `opttypes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `opttypes` (
  `opttype_id` int(11) NOT NULL AUTO_INCREMENT,
  `opttype_name` varchar(60) DEFAULT NULL,
  PRIMARY KEY (`opttype_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `opttypes`
--

LOCK TABLES `opttypes` WRITE;
/*!40000 ALTER TABLE `opttypes` DISABLE KEYS */;
INSERT INTO `opttypes` VALUES (1,'meaning'),(2,'included'),(3,'advanced'),(4,'providers');
/*!40000 ALTER TABLE `opttypes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `roles` (
  `role_id` int(11) NOT NULL AUTO_INCREMENT,
  `role_name` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'user'),(2,'admin'),(3,'moder');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_email` varchar(60) DEFAULT NULL,
  `user_pass` varchar(128) DEFAULT NULL,
  `user_role` int(11) DEFAULT NULL,
  `user_firstname` varchar(128) DEFAULT NULL,
  `user_lastname` varchar(128) DEFAULT NULL,
  `user_mobile` varchar(15) DEFAULT NULL,
  `user_ban` int(2) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (19,'nalofree@gmail.com','250a0912d73ce0b08a2c3306dc071a48d002caff59c5c014525dcf5b3e66593f',1,'%D0%90%D0%BB%D0%B5%D0%BA%D1%81%D0%B5%D0%B9','%D0%A7%D0%B5%D1%80%D0%B5%D0%BF%D0%B0%D0%BD%D0%BE%D0%B2',NULL,0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-10-26 23:50:54