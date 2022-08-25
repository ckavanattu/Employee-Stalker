INSERT INTO department (name)
VALUES ('Sales'),('Accounting'),('Marketing'),('IT');

INSERT INTO role (title, salary, department_id)
VALUES
    ('Sales Coordinator', 45000, 1),
    ('Sales Engineer', 60000, 1),
    ('Sales Lead', 100000, 1),
    ('Marketing Director', 80000, 3), 
    ('Marketing Assistant', 46000, 3),
    ('Accountant', 70000, 2), 
    ('IT Specialist', 90000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
    ('John', 'Wick', 1, 1),
    ('Captain', 'America', 1, 1),
    ('Steph', 'Curry', 1, 1),
    ('Chacko', 'Kavanattu', 3, 4),
    ('Test', 'Idk', 3, 4),
    ('Idk', 'Anymore', 2, null),
    ('Rick', 'Morty', 4, null);