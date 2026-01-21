-- =========================================
-- DATABASE
-- DONT CHANGE ANYTHING HERE, THESE ARE ALREADY CREATED FOR THE NEED OF PHARMACIST MODULE.....
-- =========================================
CREATE DATABASE IF NOT EXISTS clinic_system;
USE clinic_system;

-- =========================================
-- PHARMACIST TABLE (LOGIN)
-- =========================================
CREATE TABLE pharmacists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    status ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT ('INACTIVE'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample pharmacist
-- Password = 123456 (bcrypt hash)
INSERT INTO pharmacists (name, email, password, status) VALUES (
    'Main Pharmacist',
    'pharmacist@test.com',
    '$2a$10$Hj2tTKwmC2xTOHBPod.aBupZ19GVvjunCJmWI8F/qZc7Zr6FmR12C',
    'ACTIVE'
);

-- =========================================
-- PATIENTS (needed for dispense & reports)
-- =========================================
CREATE TABLE patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INT,
    gender VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO patients (name, age, gender) VALUES
('John Doe', 45, 'Male'),
('Jane Smith', 32, 'Female');

-- =========================================
-- PRESCRIPTIONS (INPUT FOR DISPENSE)
-- =========================================
CREATE TABLE prescriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    doctor_name VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id)
);

-- =========================================
-- PRESCRIPTION ITEMS (MEDICINES PER RX)
-- =========================================
CREATE TABLE prescription_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    prescription_id INT NOT NULL,
    medicine_name VARCHAR(100),
    strength VARCHAR(50),
    quantity INT NOT NULL,
    FOREIGN KEY (prescription_id) REFERENCES prescriptions(id)
);

ALTER TABLE prescriptions
ADD COLUMN status ENUM('PENDING', 'DISPENSED', 'CANCELLED') DEFAULT 'PENDING';


INSERT INTO prescriptions (patient_id, doctor_name, notes)
VALUES (1, 'Dr. Silva', 'Take after meals');

INSERT INTO prescription_items (prescription_id, medicine_name, strength, quantity)
VALUES (1, 'Paracetamol', '500mg', 10);

-- =========================================
-- INVENTORY (CORE PHARMACIST TABLE)
-- =========================================
CREATE TABLE inventory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    generic_name VARCHAR(100) NOT NULL,
    brand_name VARCHAR(100),
    strength VARCHAR(50),
    batch_number VARCHAR(50),
    manufacturer VARCHAR(100),
    expiry_date DATE,
    quantity INT NOT NULL,
    selling_price DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO inventory
(generic_name, brand_name, strength, batch_number, manufacturer, expiry_date, quantity, selling_price)
VALUES
('Paracetamol', 'Panadol', '500mg', 'BATCH001', 'GSK', '2026-12-31', 100, 5.00),
('Amoxicillin', 'Amoxil', '250mg', 'BATCH002', 'Pfizer', '2025-06-30', 20, 12.00);

-- =========================================
-- DISPENSE LOG (STOCK DEDUCTION RECORD)
-- =========================================
CREATE TABLE dispense_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    prescription_id INT NOT NULL,
    inventory_id INT NOT NULL,
    quantity_dispensed INT NOT NULL,
    dispensed_by INT NOT NULL,
    dispensed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (prescription_id) REFERENCES prescriptions(id),
    FOREIGN KEY (inventory_id) REFERENCES inventory(id),
    FOREIGN KEY (dispensed_by) REFERENCES pharmacists(id)
);

-- =========================================
-- ORDER REQUESTS (LOW STOCK → ADMIN)
-- =========================================
CREATE TABLE order_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    inventory_id INT NOT NULL,
    requested_quantity INT NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (inventory_id) REFERENCES inventory(id)
);

-- =========================================
-- VIEWS (OPTIONAL BUT USEFUL FOR REPORTS)
-- =========================================

-- Low stock medicines
CREATE VIEW low_stock_medicines AS
SELECT *
FROM inventory
WHERE quantity < 100;

-- Expired medicines
CREATE VIEW expired_medicines AS
SELECT *
FROM inventory
WHERE expiry_date < CURDATE();



-- PHARMACIST MODULE END 
-- WORK BELOW HERE......FOR OTHER MODULES
