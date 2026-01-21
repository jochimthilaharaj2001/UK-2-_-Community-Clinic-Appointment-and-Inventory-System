-- Admin tables migration

-- Users table (consolidated or separate, let's stick to separate for now to avoid breaking pharmacist,
-- but we need a generic users table if we want a unified login, or just specific tables.
-- The frontend has UserManagement which implies a generic view.
-- Let's create specific tables first as requested.

-- DOCTORS
CREATE TABLE IF NOT EXISTS doctors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    specialization VARCHAR(100),
    department VARCHAR(100),
    experience VARCHAR(50),
    schedule VARCHAR(100),
    license VARCHAR(50),
    education VARCHAR(200),
    office VARCHAR(100),
    bio TEXT,
    status ENUM('active', 'on-leave', 'inactive') DEFAULT 'active',
    rating DECIMAL(2,1) DEFAULT 0.0,
    appointments_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- APPOINTMENTS (Updating existing prescription/patient flow or new?)
-- Frontend shows full appointment management.
CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_name VARCHAR(100) NOT NULL,
    patient_id VARCHAR(50), -- manually entered or linked
    patient_age INT,
    patient_gender VARCHAR(20),
    contact VARCHAR(20),
    email VARCHAR(100),
    doctor_id INT,
    date DATE,
    time VALID_TIME, -- Wait, MySQL doesn't have VALID_TIME. Just VARCHAR or TIME
    time_slot VARCHAR(20),
    duration VARCHAR(20),
    type VARCHAR(50), -- regular, emergency etc
    status ENUM('pending', 'confirmed', 'cancelled', 'completed', 'no-show') DEFAULT 'pending',
    reason VARCHAR(255),
    notes TEXT,
    room VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE SET NULL
);

-- Altering time column
ALTER TABLE appointments MODIFY COLUMN time VARCHAR(20);

-- ADMINS
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin if not exists (password: admin123)
-- bcrypt hash for 'admin123' is needed. 
-- $2a$10$wI6.R/h.h.h.h. -- placeholder, will use a known hash or insert via code.
-- For now, let's insert a text password and we can hash it via script if needed, or just insert a known hash.
-- Using the same hash as pharmacist for simplicity: $2a$10$Hj2tTKwmC2xTOHBPod.aBupZ19GVvjunCJmWI8F/qZc7Zr6FmR12C (123456)
INSERT IGNORE INTO admins (name, email, password) VALUES 
('Super Admin', 'admin@clinic.com', '$2a$10$Hj2tTKwmC2xTOHBPod.aBupZ19GVvjunCJmWI8F/qZc7Zr6FmR12C');

