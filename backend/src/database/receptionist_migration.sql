-- =========================================
-- RECEPTIONIST MODULE MIGRATION
-- =========================================

USE clinic_system;

-- 1. RECEPTIONISTS TABLE
CREATE TABLE IF NOT EXISTS receptionists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. INVOICES TABLE
CREATE TABLE IF NOT EXISTS invoices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    invoice_no VARCHAR(50) NOT NULL UNIQUE,
    doctor_id INT, -- Optional, if billing is linked to a visit
    appointment_id INT, -- Optional link
    total_amount DECIMAL(10, 2) DEFAULT 0.00,
    paid_amount DECIMAL(10, 2) DEFAULT 0.00,
    balance DECIMAL(10, 2) DEFAULT 0.00,
    payment_method VARCHAR(50) DEFAULT 'Pending', -- Cash, Card, Insurance, etc.
    status ENUM('Paid', 'Partial', 'Unpaid', 'Refunded') DEFAULT 'Unpaid',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id)
);

-- 3. INVOICE ITEMS TABLE (Line items)
CREATE TABLE IF NOT EXISTS invoice_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_id INT NOT NULL,
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
);

-- 4. PAYMENTS TABLE (History of payments)
CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    method VARCHAR(50) NOT NULL, -- Cash, Credit Card, etc.
    reference_no VARCHAR(100), -- Transaction ID
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id)
);

-- 5. UPDATE APPOINTMENTS (If needed)
-- Check if we need 'checked-in' status if not exists
-- ENUMs in MySQL are tricky to update.
-- If 'checked-in' is not in the ENUM list, we might need to alter it.
-- Assuming 'status' is VARCHAR or we are okay with existing ENUM.
-- Let's check existing setup in admin_migration.sql or just assume we can use VARCHAR.
-- If it's ENUM, we should ALTER it.
-- ALTER TABLE appointments MODIFY COLUMN status ENUM('pending', 'confirmed', 'cancelled', 'completed', 'checked-in', 'waiting') DEFAULT 'pending';
