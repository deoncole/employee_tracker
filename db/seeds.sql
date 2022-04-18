-- insert the values into the departments, roles, and employee tables to populate the database
INSERT INTO departments (name)
VALUES
    ('Administrators'),
    ('Engineering'),
    ('Developer');

INSERT INTO roles (title, salary, dept_id)
VALUES
    ('Database Architect', '100000.00', 1),
    ('Front End Developer', '95000.00', 2),
    ('Content Developer', '75000.00', 3);
    
INSERT INTO employee (first_name, last_name, roles_id, manager_id)
VALUES
    ('Mark', 'Morrison', 1, 1),
    ('Billy', 'Joel', 2, 2),
    ('Phil', 'Collins', 3, 3),
    ('George', 'Michael', 2, 1),
    ('Whitney', 'Houston', 3, 3),
    ('Lionel', 'Richie', 2, 1),
    ('John', 'Mellencamp', 3, 2),
    ('Tina', 'Turner', 1, 2);

