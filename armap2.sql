CREATE DATABASE armap2_db CHARACTER SET utf8 COLLATE utf8_general_ci;

-- ALTER TABLE offices MODIFY office_cover INT(11);
-- ALTER TABLE objects MODIFY object_cover INT(11);

CREATE TABLE users (
  user_id INT(11) NOT NULL AUTO_INCREMENT,
  user_email VARCHAR(60),
  user_pass VARCHAR(60),
  user_role INT(11),
  user_firstname VARCHAR(30),
  user_lastname VARCHAR(30),
  user_mobile VARCHAR(15),
  user_ban INT(2),
  PRIMARY KEY (user_id)
);

CREATE TABLE roles (
  role_id INT(11) NOT NULL AUTO_INCREMENT,
  role_name VARCHAR(15),
  PRIMARY KEY (role_id)
);

CREATE TABLE objects (
  object_id INT(11) NOT NULL AUTO_INCREMENT,
  object_name VARCHAR(60),
  object_create DATETIME,
  object_author INT(11),
  object_coords VARCHAR(40),
  object_adres VARCHAR(40),
  object_publish INT(2),
  object_show INT(2),
  object_type INT(11),
  object_cover VARCHAR(255),
  PRIMARY KEY (object_id)
);

CREATE TABLE objtypes (
  objtype_id INT(11) NOT NULL AUTO_INCREMENT,
  objtype_name VARCHAR(60),
  PRIMARY KEY (objtype_id)
);

CREATE TABLE offices (
  office_id INT(11) NOT NULL AUTO_INCREMENT,
  office_name VARCHAR(255),
  office_create DATETIME,
  office_author INT(11),
  office_description VARCHAR(255),
  office_area VARCHAR(11),
  office_height VARCHAR(11),
  office_subprice VARCHAR(11),
  office_totalptice VARCHAR(11),
  office_tacked INT(11),
  office_cover INT(11),
  office_publish INT(2),
  office_object INT(11),
  office_show INT(2),
  office_phone VARCHAR(25),
  PRIMARY KEY (office_id)
);

CREATE TABLE images (
  image_id INT(11) NOT NULL AUTO_INCREMENT,
  image_filename VARCHAR(255),
  image_office INT(11),
  PRIMARY KEY (image_id)
);

CREATE TABLE options (
  option_id INT(11) NOT NULL AUTO_INCREMENT,
  option_name VARCHAR(255),
  option_author INT(11),
  option_create DATETIME,
  option_publish INT(2),
  option_type INT(11),
  PRIMARY KEY (option_id)
);

CREATE TABLE opttypes (
  opttype_id INT(11) NOT NULL AUTO_INCREMENT,
  opttype_name VARCHAR(60),
  PRIMARY KEY (opttype_id)
);

CREATE TABLE options_offices (
  link_id INT(11) NOT NULL AUTO_INCREMENT,
  link_office INT(11),
  link_option INT(11),
  PRIMARY KEY (link_id)
);
