DROP DATABASE syrup;

CREATE DATABASE syrup;

USE syrup;

CREATE TABLE players (
	id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
	userID int NOT NULL,
	name varchar(40) NOT NULL,
	level int NOT NULL,
	experience int NOT NULL,
	hp int NOT NULL,
	attack int NOT NULL,
	defense int NOT NULL
);

CREATE TABLE users (
	id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
	username varchar(40),
	password varchar(150)
);

CREATE TABLE mobs (
	id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
	name varchar(40),
	spritesheet varchar(150),
	hp int NOT NULL,
	attack int NOT NULL,
	defense int NOT NULL
);

INSERT into mobs (name, spritesheet, hp, attack, defense) VALUES 
	("slime", 
	"[[0,0,84,96],[84,0,84,96],[168,0,84,96],[252,0,84,96],[340,0,80,96],[424,0,80,96],[508,0,80,96]]",
	20, 20, 5);