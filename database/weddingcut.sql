-- ============================================================
-- WeddingCut — Schema del database
-- ============================================================

CREATE DATABASE IF NOT EXISTS `giopie`
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `giopie`;

-- ENTITÀ: services
-- Servizi di montaggio offerti dalla piattaforma

CREATE TABLE IF NOT EXISTS `services` (
  `id`                  INT UNSIGNED      NOT NULL AUTO_INCREMENT,
  `name`                VARCHAR(200)      NOT NULL,
  `description`         TEXT              NOT NULL,
  `durationDescription` VARCHAR(500)      DEFAULT NULL,
  `minDuration`         SMALLINT UNSIGNED DEFAULT NULL COMMENT 'Durata minima in minuti',
  `maxDuration`         SMALLINT UNSIGNED DEFAULT NULL COMMENT 'Durata massima in minuti',
  `orientation`         ENUM('vertical','horizontal','both') NOT NULL DEFAULT 'both',
  `priceVertical`       DECIMAL(10,2)     DEFAULT NULL,
  `priceHorizontal`     DECIMAL(10,2)     DEFAULT NULL,
  `priceBoth`           DECIMAL(10,2)     DEFAULT NULL,
  `additionalOptions`   JSON              DEFAULT NULL,
  `createdAt`           TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt`           TIMESTAMP         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ENTITÀ: orders
-- Ordini di montaggio video matrimoniale

CREATE TABLE IF NOT EXISTS `orders` (
  `id`               INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  `publicId`         VARCHAR(36)     NOT NULL UNIQUE,
  `userEmail`        VARCHAR(320)    NOT NULL,
  `coupleName`       VARCHAR(300)    NOT NULL,
  `weddingDate`      DATE            NOT NULL,
  `deliveryMethod`   ENUM('cloud_link','upload_request') NOT NULL,
  `materialLink`     VARCHAR(1000)   DEFAULT NULL,
  `materialSizeGb`   DECIMAL(6,2)    NOT NULL,
  `cameraCount`      ENUM('1-4','5-6','7+') NOT NULL,
  `generalNotes`     TEXT            DEFAULT NULL,
  `referenceVideo`   VARCHAR(1000)   DEFAULT NULL,
  `exportFps`        VARCHAR(20)     DEFAULT NULL,
  `exportBitrate`    VARCHAR(20)     DEFAULT NULL,
  `exportAspect`     VARCHAR(20)     DEFAULT NULL,
  `exportResolution` VARCHAR(20)     DEFAULT NULL,
  `selectedServices` JSON            NOT NULL,
  `servicesTotal`    DECIMAL(10,2)   DEFAULT NULL,
  `cameraSurcharge`  DECIMAL(10,2)   NOT NULL DEFAULT 0,
  `totalPrice`       DECIMAL(10,2)   DEFAULT NULL,
  `status`           ENUM('pending','in_progress','completed','cancelled') NOT NULL DEFAULT 'pending',
  `adminNotes`       TEXT            DEFAULT NULL,
  `deliveryLink`     VARCHAR(1000)   DEFAULT NULL,
  `createdAt`        TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt`        TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_orders_userEmail` (`userEmail`),
  INDEX `idx_orders_status`    (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ENTITÀ: conversations
-- Thread di messaggistica tra utente e admin

CREATE TABLE IF NOT EXISTS `conversations` (
  `id`            INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `publicId`      VARCHAR(36)   NOT NULL UNIQUE,
  `userEmail`     VARCHAR(320)  NOT NULL,
  `subject`       VARCHAR(500)  NOT NULL,
  `orderId`       VARCHAR(36)   DEFAULT NULL COMMENT 'publicId dell\'ordine collegato (opzionale)',
  `status`        ENUM('open','closed') NOT NULL DEFAULT 'open',
  `lastMessageAt` TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `createdAt`     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt`     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_conversations_userEmail` (`userEmail`),
  INDEX `idx_conversations_status`    (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ENTITÀ: messages
-- Singoli messaggi all'interno di una conversazione

CREATE TABLE IF NOT EXISTS `messages` (
  `id`             INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `publicId`       VARCHAR(36)  NOT NULL UNIQUE,
  `conversationId` INT UNSIGNED NOT NULL,
  `senderRole`     ENUM('user','admin') NOT NULL,
  `senderEmail`    VARCHAR(320) NOT NULL,
  `content`        TEXT         NOT NULL,
  `readAt`         TIMESTAMP    NULL DEFAULT NULL,
  `createdAt`      TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_messages_conversationId` (`conversationId`),
  CONSTRAINT `fk_messages_conversation` FOREIGN KEY (`conversationId`) REFERENCES `conversations`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
