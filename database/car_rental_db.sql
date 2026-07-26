-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: car_rental_db
-- ------------------------------------------------------
-- Server version	8.0.46

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
-- Table structure for table `bookings`
--

DROP TABLE IF EXISTS `bookings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bookings` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `end_date` date NOT NULL,
  `start_date` date NOT NULL,
  `status` enum('PENDING','CONFIRMED','ONGOING','COMPLETED','CANCELLED','REJECTED') NOT NULL,
  `total_price` decimal(38,2) NOT NULL,
  `car_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKj1y19nc7wf0rdp24pyhomn7ck` (`car_id`),
  KEY `FKeyog2oic85xg7hsu2je2lx3s6` (`user_id`),
  CONSTRAINT `FKeyog2oic85xg7hsu2je2lx3s6` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKj1y19nc7wf0rdp24pyhomn7ck` FOREIGN KEY (`car_id`) REFERENCES `cars` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookings`
--

LOCK TABLES `bookings` WRITE;
/*!40000 ALTER TABLE `bookings` DISABLE KEYS */;
INSERT INTO `bookings` VALUES (1,'2026-07-23 05:56:46.008113','2026-07-23 05:57:01.167681','2026-07-27','2026-07-25','CANCELLED',90.00,1,1),(2,'2026-07-23 05:57:18.830661','2026-07-23 05:57:26.456127','2026-07-30','2026-07-24','CANCELLED',270.00,1,1),(3,'2026-07-23 10:17:40.917157','2026-07-23 10:48:42.453676','2026-07-31','2026-07-30','CANCELLED',10000.00,4,1),(4,'2026-07-23 10:48:58.301713','2026-07-23 11:58:09.698701','2026-07-25','2026-07-24','CANCELLED',7000.00,3,1),(5,'2026-07-23 10:58:23.583255','2026-07-23 11:21:07.017778','2026-07-28','2026-07-25','CONFIRMED',10500.00,5,1),(6,'2026-07-23 11:53:45.521860','2026-07-23 11:56:07.867731','2026-07-31','2026-07-24','CONFIRMED',42000.00,1,1),(7,'2026-07-23 11:56:43.767338','2026-07-23 11:57:09.634731','2026-07-27','2026-07-26','CONFIRMED',7000.00,3,2),(8,'2026-07-23 12:10:16.166282','2026-07-23 13:05:12.825243','2026-07-24','2026-07-23','REJECTED',5000.00,2,1),(9,'2026-07-24 10:15:04.163169','2026-07-24 10:15:16.316284','2026-07-31','2026-07-30','CANCELLED',7000.00,3,3),(10,'2026-07-24 10:15:30.876758','2026-07-24 10:16:06.099546','2026-07-26','2026-07-25','CONFIRMED',5000.00,2,3),(11,'2026-07-24 10:32:25.612346','2026-07-24 10:32:34.580691','2026-07-30','2026-07-28','CANCELLED',14000.00,3,4),(12,'2026-07-24 10:32:52.821994','2026-07-24 10:33:38.490807','2026-07-30','2026-07-29','CONFIRMED',5000.00,2,4);
/*!40000 ALTER TABLE `bookings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cars`
--

DROP TABLE IF EXISTS `cars`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cars` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `brand` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL,
  `image_url` varchar(1000) DEFAULT NULL,
  `model` varchar(255) NOT NULL,
  `price_per_day` decimal(38,2) NOT NULL,
  `seats` int NOT NULL,
  `status` enum('AVAILABLE','BOOKED','UNDER_MAINTENANCE') NOT NULL,
  `transmission` varchar(255) DEFAULT NULL,
  `year` int NOT NULL,
  `contact_number` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cars`
--

LOCK TABLES `cars` WRITE;
/*!40000 ALTER TABLE `cars` DISABLE KEYS */;
INSERT INTO `cars` VALUES (1,'2026-07-23 05:46:51.398317','2026-07-23 10:51:32.223100','Toyota','Sedan','https://th.bing.com/th/id/OIP.HK3hMutLP4Vl7tGOhr2HSAHaDf?w=408&h=165&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3','Corolla',6000.00,5,'AVAILABLE','Automatic',2023,'0774444444'),(2,'2026-07-23 09:37:46.470308','2026-07-23 10:51:46.262702','Toyota','Sedan','https://th.bing.com/th/id/OIP.z0j_grisbMTpkfJh_2w8GAHaFj?w=233&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3','vitz',5000.00,4,'AVAILABLE','Automatic',2019,'0774444444'),(3,'2026-07-23 09:44:24.127325','2026-07-23 10:51:25.018728','Toyota','SUV','https://th.bing.com/th/id/OIP.Plx6eHo2M2PoQ-7e8fhAcQHaEK?w=322&h=181&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3','chr',7000.00,5,'AVAILABLE','Automatic',2023,'0774444444'),(4,'2026-07-23 10:11:48.988479','2026-07-23 11:06:12.198020','Toyota','Van','https://th.bing.com/th/id/OIP.EvqAjSQAvxDMwM5Ami5dJwHaEo?w=297&h=185&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3','kdh',10000.00,12,'AVAILABLE','Manual',2019,'0774444444'),(5,'2026-07-23 10:16:02.813825','2026-07-23 10:51:56.305807','Suzuki','Sedan','https://th.bing.com/th/id/OIP.3FqXNpVRsDPEC76xExoVWAHaE6?w=243&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3','alto',3500.00,4,'AVAILABLE','Manual',2020,'0774444444'),(6,'2026-07-23 16:37:31.550914','2026-07-23 16:37:31.550990','Suzuki','Sedan','https://th.bing.com/th/id/OIP.dqek-ZiytGICsWDOhirpCwHaEk?w=258&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3','wagonr',4500.00,4,'AVAILABLE','Automatic',2020,'0774444444'),(10,'2026-07-24 10:41:12.940984','2026-07-24 10:41:12.940984','Toyota','Luxury','https://th.bing.com/th/id/OIP.jH9-HjOruLGpezr091MbyAHaE8?w=239&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3','prado 150',45000.00,5,'AVAILABLE','Manual',2024,'0774444444');
/*!40000 ALTER TABLE `cars` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `role` enum('ADMIN','CUSTOMER') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'2026-07-23 05:55:31.472408','2026-07-23 05:55:31.473406','rashmikasachintha02@gmail.com','Rashmika Sachintha','$2a$10$3f/rtbRipZD52WqPQUF/oOxC2qnVo2g.JK0b5lBwx9ZUepyYvGBBq','0761828411','CUSTOMER'),(2,'2026-07-23 09:31:27.167281','2026-07-23 09:31:27.167281','admin@drivenow.com','System Administrator','$2a$10$hsp1a3B2IzFdj0OP3NSReuvcNAV7Rg9pPZ1.2lMRQvlBRl.k5G8GO',NULL,'ADMIN'),(3,'2026-07-24 10:13:49.199080','2026-07-24 10:13:49.200058','piniduamanda@gmail.com','pinidu amanda','$2a$10$WipjXsxYNj9YNVPVpb0B9.44e057g3LO4Xw0qkzY9E95hxxqcsHnO','0779014398','CUSTOMER'),(4,'2026-07-24 10:31:12.475517','2026-07-24 10:31:12.475517','dinethekanayake@gmail.com','dineth ekanayake','$2a$10$/z57WzEGmlUE8Bbl1OicYuUQx4qsGC1/64mo0Y/.FWBqAWNQN.6j6','0779014398','CUSTOMER');
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

-- Dump completed on 2026-07-26 18:55:48
