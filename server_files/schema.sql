CREATE DATABASE syrup;

USE player;

CREATE TABLE players (
	id int NOT NULL AUTO_INCREMENT;
	userID int NOT NULL;
	name varchar(40) NOT NULL;
	level int NOT NULL;
	experience int NOT NULL;
	hp int NOT NULL;
	attack int NOT NULL;
	defense int NOT NULL;
	PRIMARY KEY (ID);
);

CREATE TABLE users (
	id int NOT NULL AUTO_INCREMENT;
	username varchar(40);
	password varchar;
	PRIMARY KEY (ID);
);