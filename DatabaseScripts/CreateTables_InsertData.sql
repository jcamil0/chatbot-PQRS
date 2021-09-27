CREATE TABLE rooms_type (
  id INT NOT NULL,
  fname VARCHAR(256) NOT NULL,  
  price INT NOT NULL,
  PRIMARY KEY (id));

CREATE TABLE rooms (
  id INT NOT NULL,
  number INT NOT NULL,
  type_id INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (type_id)
  REFERENCES rooms_type (id)
  ON DELETE CASCADE
  ON UPDATE CASCADE);

CREATE TABLE bookings (
  id INT NOT NULL,
  booking_date DATE NOT NULL,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  PRIMARY KEY (id));

CREATE TABLE rooms_booked (
  id INT NOT NULL,
  rooms_id INT NOT NULL,
  bookings_id INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (bookings_id)
  REFERENCES bookings (id)
  ON DELETE CASCADE
  ON UPDATE CASCADE,
  FOREIGN KEY (rooms_id)
  REFERENCES rooms (id)
  ON DELETE CASCADE
  ON UPDATE CASCADE);

CREATE TABLE capacity (
   id INT NOT NULL,
   type_id INT NOT NULL,
   total_rooms INT NOT NULL,
   PRIMARY KEY (id),
   FOREIGN KEY (type_id)
   REFERENCES rooms_type (id)
   ON DELETE CASCADE
   ON UPDATE CASCADE);

INSERT INTO rooms_type(id, fname, price)
	VALUES
	(1,'Executive Double Room',261),
	(2,'Deluxe Single Room',330),
	(3,'Deluxe Double Room',333),
	(4,'Superior Deluxe Double Room',460),
	(5,'Junior Suite',545),
	(6,'Adlon Executive Suite',716),
	(7,'Junior Suite Unter den Linden',833);

INSERT INTO rooms(id, number, type_id)
     VALUES 
        (1,101,1),
        (2,102,1),
        (3,103,1),
        (4,104,1),
        (5,105,1),
        (6,201,2),
        (7,202,2),
        (8,203,2),
        (9,204,2),
        (10,205,2),
        (11,206,2),
        (12,301,3),
        (13,302,3),
        (14,303,3),
        (15,304,3),
        (16,305,3),
        (17,306,3),
        (18,307,3),
        (19,401,4),
        (20,402,4),
        (21,403,4),
        (22,404,4),
        (23,405,4),
        (24,406,4),
        (25,407,4),
        (26,408,4),
        (27,501,5),
        (28,502,5),
        (29,503,5),
        (30,504,5),
        (31,601,6),
        (32,602,6),
        (33,603,6),
        (34,604,6),
        (35,605,6),
        (36,701,7),
        (37,702,7),
        (38,703,7),
        (39,704,7);


 INSERT INTO bookings (id, booking_date, check_in_date, check_out_date)
     VALUES
        (1, '2021-01-08', '2021-08-10', '2021-08-15'),
        (2, '2021-01-08', '2021-08-08', '2021-08-10'),
        (3, '2021-01-08', '2021-06-08', '2021-06-18'),
        (4, '2021-01-08', '2021-06-20', '2021-06-23'),
        (5, '2021-01-08', '2021-06-08', '2021-06-11'),
        (6, '2021-01-08', '2021-06-08', '2021-06-13'),
        (7, '2021-01-13', '2021-06-13', '2021-06-15'),
        (8, '2021-01-10', '2021-08-11', '2021-08-13'),
        (9, '2021-01-10', '2021-08-12', '2021-08-16'),
        (10, '2021-01-14', '2021-08-15', '2021-08-17'),
        (11, '2021-01-14', '2021-08-16', '2021-08-21'),
        (12, '2021-01-14', '2021-08-28', '2021-09-07'),
        (13, '2021-01-14', '2021-08-15', '2021-08-25'),
        (14, '2021-01-14', '2021-08-16', '2021-08-18'),
        (15, '2021-01-14', '2021-08-17', '2021-08-20');

INSERT INTO rooms_booked (id, rooms_id, bookings_id) 
    VALUES 
    (1,1,1),
    (2,1,2),
    (3,2,3),
    (4,2,4),
    (5,3,5),
    (6,4,6),
    (7,4,7),
    (8,5,8),
    (9,6,9),
    (10,7,10),
    (11,8,11),
    (12,1,12),
    (13,2,13),
    (14,3,14),
    (15,4,15);

INSERT INTO capacity(id, type_id, total_rooms)
        VALUES
        (1,1,5),
        (2,2,6),
        (3,3,7),
        (4,4,8),
        (5,5,4),
        (6,6,5),
        (7,7,4);