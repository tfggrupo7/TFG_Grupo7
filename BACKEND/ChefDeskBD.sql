CREATE DATABASE  IF NOT EXISTS "restaurante" /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `restaurante`;
-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: mysql-346c90ee-appchefdesk.f.aivencloud.com    Database: restaurante
-- ------------------------------------------------------
-- Server version	8.0.35

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `contraseña` varchar(255) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `apellidos` varchar(255) NOT NULL,
  `reset_password_token` varchar(255) DEFAULT NULL,
  `reset_password_expires` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (6,'waltra@gmail.com','$2b$10$w5Jq5NrmLsYMPDDols.4juw81fRvEj0SbF.wtAZENH2PJTz52hLR.','David','Perez',NULL,NULL),(7,'pedro@mail.com','$2b$10$ZcnTSMDWpGfZz.NMyxYs7.WlApAgeAM3lg7b3hh3Tls8Z0U/M1noG','pedro','picapiedra',NULL,NULL),(8,'prueba@prueba.com','$2b$10$n9CpKGo46rGZTKYMlOFwNOY3A1nWUBII.i0VqAy54oauWn5CPdU3W','prueba','prueba',NULL,NULL),(9,'pruebaf@email.com','$2b$10$tD9LPIGBXh41kNTPBgS1U.yGTzvNHGDKU05RpoYX67S0.tgIlhpLq','Francisco','Gonzalez',NULL,NULL),(10,'usuarioTest@email.com','$2b$10$/8Oa5dSqCguVRlMAEq0/4eoGZGgVpydGCSIwFDXAVJyySOb34Mamm','usuario','nuevo',NULL,NULL),(11,'arna@email.com','$2b$10$2kBpSRcxRidaBo0eZH71t.kfp4KhQfIx/3KYgnlFNVCH780GpKSvC','Arnau','Matín',NULL,NULL),(12,'hr@email.com','$2b$10$7fQSGhni/P2J5UDyKtQKueLqplwGBuZw6rlI0vnbQkdGLXRKFTTBO','himar','rodr',NULL,NULL);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-29  8:57:51
CREATE DATABASE  IF NOT EXISTS "restaurante" /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `restaurante`;
-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: mysql-346c90ee-appchefdesk.f.aivencloud.com    Database: restaurante
-- ------------------------------------------------------
-- Server version	8.0.35

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--


-- Table structure for table `empleados`
--

DROP TABLE IF EXISTS `empleados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `empleados` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `rol_id` int NOT NULL,
  `salario` decimal(10,0) NOT NULL,
  `status` enum('ACTIVO','INACTIVO') DEFAULT NULL,
  `fecha_inicio` date DEFAULT NULL,
  `usuario_id` int DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `reset_password_token` varchar(255) DEFAULT NULL,
  `reset_password_expires` varchar(255) DEFAULT NULL,
  `apellidos` varchar(255) NOT NULL,
  `activo` enum('ACTIVO','INACTIVO','VACACIONES') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `fk_empleados_roles` (`rol_id`),
  KEY `fk_usuario_id` (`usuario_id`),
  CONSTRAINT `fk_usuario_id` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `roles_id` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `empleados`
--

LOCK TABLES `empleados` WRITE;
/*!40000 ALTER TABLE `empleados` DISABLE KEYS */;
INSERT INTO `empleados` VALUES (2,'David ','waltra@gmail.com','654789321',2,2500,NULL,'2025-06-12',6,'$2b$10$oEbI/aEJhaECOVK8Ajrgp.n.LBuBue6iuDPNFdezDDgwnRhdMDJ7a','$2b$10$CNX3FFhzCZQ3EXVgECU3XeGJwCEGhg6at0JXAtFhgLKbu.yf3yary','2025-06-06 18:02:21.256','Martin','ACTIVO'),(10,'hicham zahir','hicham@mail.com','00124567',1,2000,NULL,'2025-06-29',6,'',NULL,NULL,'garcia','VACACIONES'),(21,'rodirigo','rodrigosendinosanz@gmail.com','56545645456',3,1500,NULL,'2025-06-10',6,NULL,NULL,NULL,'sendino','INACTIVO'),(22,'Daniela','mariadelcarmen.herreravillanueva@peticiones.online','00124567',2,1250,NULL,'2025-06-11',6,NULL,NULL,NULL,'Griego Solorio','ACTIVO'),(23,'David','david.donoso393@comunidadunir.net','564564544564',2,2000,NULL,'2025-06-18',6,'$2b$10$VXKoUO/5uHcGY4xhKYcTc.G4OBCJzD35328o/YEs3T8NCWfrpJ1aS',NULL,NULL,'Donoso','ACTIVO'),(25,'Marcos','c38r90eynb@jkotypc.com','666444555',3,2000,NULL,'2025-06-24',8,'$2b$10$DxL4bZ9zK4uzRn5KTaUY0eseq4vSOthUawWvChTYLZZDL30vufvtO',NULL,NULL,'González','ACTIVO'),(26,'Fran','franciscogonzalezparra0@gmail.com','678909876',2,1345,NULL,'2025-06-27',10,'$2b$10$Bau5K.L.nnwGfA1pe2IjneCBpukfuFUph8.Jes2Mk7DkFksU3mep.',NULL,NULL,'prueba','ACTIVO'),(27,'Federico','63eba69nru@zudpck.com','652879632',3,1800,NULL,'2025-06-30',6,'$2b$10$3fgjryNFLufhEZ75h7UySO4OuZe6f2AYRqlptSpEiRxQH.ZCJXbAa',NULL,NULL,'Perez Lopez','ACTIVO');
/*!40000 ALTER TABLE `empleados` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-29  8:57:45
CREATE DATABASE  IF NOT EXISTS "restaurante" /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `restaurante`;
-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: mysql-346c90ee-appchefdesk.f.aivencloud.com    Database: restaurante
-- ------------------------------------------------------
-- Server version	8.0.35

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'jefe cocina'),(2,'encargado'),(3,'empleado');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-29  8:57:50
CREATE DATABASE  IF NOT EXISTS "restaurante" /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `restaurante`;
-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: mysql-346c90ee-appchefdesk.f.aivencloud.com    Database: restaurante
-- ------------------------------------------------------
-- Server version	8.0.35

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--


-- Table structure for table `turnos`
--

DROP TABLE IF EXISTS `turnos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `turnos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `dia` varchar(20) NOT NULL,
  `hora` int NOT NULL,
  `duracion` decimal(10,0) NOT NULL,
  `titulo` varchar(100) DEFAULT NULL,
  `empleado_id` int NOT NULL,
  `fecha` date NOT NULL,
  `estado` varchar(20) NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fin` time NOT NULL,
  `color` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `empleado_id` (`empleado_id`),
  CONSTRAINT `turnos_ibfk_1` FOREIGN KEY (`empleado_id`) REFERENCES `empleados` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `turnos`
--

LOCK TABLES `turnos` WRITE;
/*!40000 ALTER TABLE `turnos` DISABLE KEYS */;
INSERT INTO `turnos` VALUES (5,'Sábado',10,1,'',10,'2025-06-21','pendiente','10:00:00','11:00:00','bg-[#D4AF37]/90'),(6,'Sábado',3,1,'',21,'2025-06-21','completado','03:00:00','04:00:00','bg-[#D4AF37]/90'),(7,'Sábado',22,1,'',2,'2025-06-21','pendiente','22:00:00','23:00:00','bg-[#D4AF37]/90'),(8,'Domingo',8,1,'',2,'2025-06-22','pendiente','08:00:00','09:00:00','bg-[#D4AF37]/90'),(13,'Martes',2,7,'',2,'2025-06-24','completado','02:00:00','09:00:00','bg-[#D4AF37]/90'),(15,'Martes',9,4,'',25,'2025-06-24','confirmado','09:00:00','13:00:00','bg-[#D4AF37]/90'),(30,'Domingo',7,1,'',2,'2025-06-29','pendiente','07:00:00','08:00:00','bg-[#D4AF37]/90'),(38,'Jueves',7,1,'',25,'2025-06-26','pendiente','07:00:00','08:00:00','bg-[#D4AF37]/90'),(39,'Viernes',10,1,'',2,'2025-06-27','pendiente','10:00:00','11:00:00','bg-[#D4AF37]/90'),(40,'Miércoles',11,1,'',2,'2025-06-25','pendiente','11:00:00','12:30:00','bg-[#D4AF37]/90'),(42,'Viernes',11,1,'',2,'2025-06-26','completado','11:30:00','12:30:00','bg-[#D4AF37]/90'),(43,'Sábado',15,4,'',2,'2025-06-28','pendiente','15:30:00','19:30:00','bg-[#D4AF37]/90'),(45,'Sábado',4,6,'',2,'2025-06-25','confirmado','04:00:00','10:00:00','bg-[#D4AF37]/90'),(46,'Jueves',9,1,'',2,'2025-06-26','pendiente','09:00:00','10:00:00','bg-[#D4AF37]/90'),(47,'Jueves',6,1,'',23,'2025-06-27','pendiente','06:00:00','07:00:00','bg-[#D4AF37]/90'),(48,'Sábado',5,1,'',2,'2025-06-28','completado','05:00:00','06:00:00','bg-[#D4AF37]/90'),(49,'Sábado',3,1,'',21,'2025-06-27','pendiente','03:30:00','04:30:00','bg-[#D4AF37]/90'),(50,'Sábado',7,1,'',25,'2025-06-28','confirmado','07:00:00','08:00:00','bg-[#D4AF37]/90'),(51,'Sábado',16,0,'',2,'2025-06-28','pendiente','16:30:00','21:00:00','bg-[#D4AF37]/90'),(52,'Domingo',1,2,'',25,'2025-06-28','pendiente','01:00:00','03:00:00','bg-[#D4AF37]/90'),(53,'Domingo',4,2,'',2,'2025-06-29','pendiente','04:00:00','06:00:00','bg-[#D4AF37]/90');
/*!40000 ALTER TABLE `turnos` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-29  8:57:49
CREATE DATABASE  IF NOT EXISTS "restaurante" /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `restaurante`;
-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: mysql-346c90ee-appchefdesk.f.aivencloud.com    Database: restaurante
-- ------------------------------------------------------
-- Server version	8.0.35

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

--
-- Table structure for table `tareas`
--

DROP TABLE IF EXISTS `tareas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tareas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `descripcion` text,
  `empleado_id` int NOT NULL,
  `fecha_finalizacion` date NOT NULL,
  `fecha_inicio` date NOT NULL,
  `estado` enum('Completada','En curso','Pendiente') DEFAULT NULL,
  `titulo` varchar(100) NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_finalizacion` time NOT NULL,
  PRIMARY KEY (`id`),
  KEY `tareas_ibfk_1` (`empleado_id`),
  CONSTRAINT `tareas_ibfk_1` FOREIGN KEY (`empleado_id`) REFERENCES `empleados` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tareas`
--

LOCK TABLES `tareas` WRITE;
/*!40000 ALTER TABLE `tareas` DISABLE KEYS */;
INSERT INTO `tareas` VALUES (10,'fregar los patos',22,'2025-06-26','2025-06-26','En curso','fregar platos','15:43:00','16:44:00'),(11,'barrer todo  el suelo',10,'2025-06-19','2025-06-18','En curso','barrer','14:50:00','15:51:00'),(18,'barrer terraza',2,'2025-06-25','2025-06-25','Pendiente','barrer','10:00:00','11:30:00'),(21,'recoger la basura y tirar al contenedor',25,'2025-06-29','2025-06-29','Pendiente','basura','22:00:00','23:00:00'),(22,'recoger la basura y tirar al contenedor',21,'2025-06-29','2025-06-29','Pendiente','basura','22:00:00','23:00:00'),(23,'recoger la basura y tirar al contenedor',22,'2025-06-29','2025-06-29','Pendiente','basura','22:00:00','23:00:00'),(24,'recoger la basura y tirar al contenedor',26,'2025-06-29','2025-06-29','Pendiente','basura','22:00:00','23:00:00'),(25,'recoger maletas de clientes',2,'2025-06-28','2025-06-28','Pendiente','fadfs','12:38:00','13:39:00');
/*!40000 ALTER TABLE `tareas` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-29  8:57:47
CREATE DATABASE  IF NOT EXISTS "restaurante" /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `restaurante`;
-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: mysql-346c90ee-appchefdesk.f.aivencloud.com    Database: restaurante
-- ------------------------------------------------------
-- Server version	8.0.35

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

--
-- Table structure for table `ingredientes`
--

DROP TABLE IF EXISTS `ingredientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ingredientes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `alergenos` varchar(100) DEFAULT NULL,
  `categoria` varchar(100) NOT NULL,
  `cantidad` decimal(10,2) NOT NULL DEFAULT '0.00',
  `unidad` enum('unidades','kg','g','l','ml','cajas','paquetes') NOT NULL DEFAULT 'unidades',
  `proveedor` varchar(100) DEFAULT NULL,
  `estado` enum('En stock','Bajo stock','Sin stock') NOT NULL DEFAULT 'En stock',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `empleados_id` int DEFAULT NULL,
  `usuario_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `usuario_id_idx` (`usuario_id`),
  KEY `empleados_id_idx` (`empleados_id`),
  CONSTRAINT `empleados_id` FOREIGN KEY (`empleados_id`) REFERENCES `empleados` (`id`),
  CONSTRAINT `usuario_id` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ingredientes`
--

LOCK TABLES `ingredientes` WRITE;
/*!40000 ALTER TABLE `ingredientes` DISABLE KEYS */;
INSERT INTO `ingredientes` VALUES (32,'ajo','nada','Frutas y Verduras',100.00,'kg','ajos del sur','En stock','2025-06-23 10:13:35','2025-06-23 10:13:35',NULL,6),(33,'tomates','gluten','Frutas y Verduras',50.00,'kg','ajos del sur','Bajo stock','2025-06-23 10:15:41','2025-06-23 10:15:41',NULL,6),(34,'manzanas','nada','Frutas y Verduras',50.00,'kg','Frutas del campo','Bajo stock','2025-06-23 10:16:10','2025-06-23 10:16:10',NULL,6),(35,'Leche','lactosa','Lácteos',100.00,'l','Distribuidora del sur','Bajo stock','2025-06-23 10:16:37','2025-06-23 10:16:37',NULL,6),(36,'Queso','lactosa','Lácteos',50.00,'kg','Distribuidora del sur','En stock','2025-06-23 10:17:04','2025-06-23 10:17:04',NULL,6),(37,'Vino Tinto','nada','Bebidas',100.00,'l','Vinoteca del mond','En stock','2025-06-23 10:17:47','2025-06-23 10:17:47',NULL,6),(38,'Vino Blanco','nada','Bebidas',100.00,'l','Vinoteca del mundo','Bajo stock','2025-06-23 10:18:08','2025-06-23 10:18:08',NULL,6),(39,'Ron Blanco','nada','Bebidas',100.00,'l','Bebidas del mundo','En stock','2025-06-23 10:20:16','2025-06-23 10:20:16',2,NULL),(40,'Barras de pan','gluten','Pescados',50.00,'unidades','Panificadora La Mejor','En stock','2025-06-23 10:31:25','2025-06-23 10:31:25',2,NULL),(41,'Lubina','nada','Pescados',10.00,'kg','Mariscos y pescados Recio','En stock','2025-06-23 10:45:45','2025-06-23 10:45:45',2,NULL),(42,'Tomillo','nada','Especias',5.00,'kg','Plantas aromatizadas','Bajo stock','2025-06-23 10:51:17','2025-06-23 10:51:17',2,NULL),(43,'Carne de pollo','nada','Carnes',50.00,'kg','Pollos Felix','En stock','2025-06-23 10:56:32','2025-06-23 10:56:32',2,NULL),(44,'Peras','nada','Frutas y Verduras',50.00,'kg','Peras del sur','Bajo stock','2025-06-23 11:07:44','2025-06-23 11:07:44',2,NULL),(45,'Tomates','NA','Frutas y Verduras',1.00,'unidades','Distribuidora Alimentos S.L','En stock','2025-06-27 14:10:41','2025-06-27 14:10:41',NULL,8),(46,'Longanizas','No','Carnes',10.00,'kg','Carnes S.L.','En stock','2025-06-27 15:03:31','2025-06-27 15:03:31',NULL,10);
/*!40000 ALTER TABLE `ingredientes` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-29  8:57:46
