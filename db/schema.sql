DROP TABLE IF EXISTS employee;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS departments;


CREATE TABLE departments(
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

CREATE TABLE roles (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    dept_id INTEGER,
    CONSTRAINT fk_departments FOREIGN KEY (dept_id) REFERENCES departments (id)
);


CREATE TABLE employee (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    roles_id INTEGER,
    manager_id INTEGER,
    CONSTRAINT fk_role FOREIGN KEY (roles_id) REFERENCES roles (id),
    FOREIGN KEY (manager_id) REFERENCES employee (id)
);