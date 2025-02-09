-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost
-- Généré le : mer. 22 nov. 2023 à 13:30
-- Version du serveur : 8.0.31
-- Version de PHP : 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- Base de données : `library`
DROP DATABASE IF EXISTS library;
CREATE DATABASE library;
USE library;

-- Suppression de l'utilisateur s'il existe déjà
DROP USER IF EXISTS 'libr'@'%';
CREATE USER 'libr'@'%' IDENTIFIED BY 'NIEN97BF21OZEFJOZEO';
GRANT ALL PRIVILEGES ON library.* TO 'libr'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;

-- Structure de la table `livres`
CREATE TABLE `livres` (
  `id` int NOT NULL AUTO_INCREMENT,
  `titre` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `auteur` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `date_publication` date NOT NULL,
  `isbn` varchar(13) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci NOT NULL,
  `statut` enum('disponible','emprunté') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'disponible',
  `photo_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Déchargement des données de la table `livres`
INSERT INTO `livres` (`id`, `titre`, `auteur`, `date_publication`, `isbn`, `description`, `statut`, `photo_url`) VALUES
(1, 'Developpement Web mobile avec HTML, CSS et JavaScript Pour les Nuls', 'William HARREL', '2023-11-09', 'DHIDZH1374R', 'Un livre indispensable à tous les concepteurs ou développeurs de sites Web pour iPhone, iPad, smartphones et tablettes !Ce livre est destiné aux développeurs qui veulent créer un site Internet destiné aux plate-formes mobiles en adoptant les standard du Web que sont HTML, XHTML, les CSS et JavaScript.', 'emprunté', 'https://cdn.cultura.com/cdn-cgi/image/width=180/media/pim/82_metadata-image-20983225.jpeg'),
(4, 'PHP et MySql pour les Nuls ', 'Janet VALADE', '2023-11-14', '23R32R2R4', 'Le livre best-seller sur PHP & MySQL !\r\n\r\n\r\nAvec cette 5e édition de PHP et MySQL pour les Nuls, vous verrez qu\'il n\'est plus nécessaire d\'être un as de la programmation pour développer des sites Web dynamiques et interactifs.\r\n', 'disponible', 'https://cdn.cultura.com/cdn-cgi/image/width=830/media/pim/66_metadata-image-20983256.jpeg');

-- Structure de la table `utilisateurs`
CREATE TABLE `utilisateurs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `prenom` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `mot_de_passe` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `date_inscription` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `role` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'utilisateur',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Déchargement des données de la table `utilisateurs`
INSERT INTO `utilisateurs` (`id`, `nom`, `prenom`, `email`, `mot_de_passe`, `date_inscription`, `role`) VALUES
(1, 'Smith', 'John', 'john@smith.com', '$2b$10$6UQGsRHPMkIjH.1RqeTN/Oo4XRCXwBJEBdOb9lNjddbRIIj3/Olk6', '2023-11-09 21:54:09', 'admin'),
(2, 'Lord', 'Marc', 'marc@lord.com', '$2b$10$6UQGsRHPMkIjH.1RqeTN/Oo4XRCXwBJEBdOb9lNjddbRIIj3/Olk6', '2023-11-09 21:59:23', 'utilisateur');

-- Structure de la table `emprunts`
CREATE TABLE `emprunts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `book_id` int NOT NULL,
  `date_emprunt` timestamp DEFAULT CURRENT_TIMESTAMP,
  `date_retour` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`user_id`) REFERENCES `utilisateurs`(`id`),
  FOREIGN KEY (`book_id`) REFERENCES `livres`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
