-- Question 1: Create the student table
CREATE TABLE student (
  id INT PRIMARY KEY,
  fullName VARCHAR(100),
  age INT
);

-- Question 2: Insert 3 records
INSERT INTO student (id, fullName, age) VALUES
(1, 'Amina Odhiambo', 19),
(2, 'Brian Kamau', 18),
(3, 'Chantal Njeri', 22);

-- Question 3: Update age for student with ID 2
UPDATE student
SET age = 20
WHERE id = 2;