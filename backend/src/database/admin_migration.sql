-- Admin tables migration refinements

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
    status ENUM('active', 'on-leave', 'inactive', 'ACTIVE', 'INACTIVE') DEFAULT 'active',
    rating DECIMAL(2,1) DEFAULT 0.0,
    appointments_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- APPOINTMENTS
CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_name VARCHAR(100) NOT NULL,
    patient_id VARCHAR(50),
    patient_age INT,
    patient_gender VARCHAR(20),
    contact VARCHAR(20),
    email VARCHAR(100),
    doctor_id INT,
    doctor_name VARCHAR(100),
    appointment_date DATE,
    appointment_time VARCHAR(20),
    date DATE, -- redundant but for compatibility
    time VARCHAR(20), -- redundant but for compatibility
    duration VARCHAR(20),
    type VARCHAR(50),
    status ENUM('pending', 'confirmed', 'cancelled', 'completed', 'no-show', 'scheduled', 'Waiting', 'Confirmed', 'Pending') DEFAULT 'pending',
    reason VARCHAR(255),
    notes TEXT,
    room VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE SET NULL
);

-- INVENTORY (Ensuring columns exist for both Admin and Pharmacist modules)
-- Pharmacist uses: generic_name, brand_name, strength, batch_number, manufacturer, expiry_date, quantity, selling_price
-- Admin uses: name, category, unit, reorder_level, location
ALTER TABLE inventory ADD COLUMN IF NOT EXISTS name VARCHAR(100);
ALTER TABLE inventory ADD COLUMN IF NOT EXISTS category VARCHAR(100);
ALTER TABLE inventory ADD COLUMN IF NOT EXISTS unit VARCHAR(50);
ALTER TABLE inventory ADD COLUMN IF NOT EXISTS reorder_level INT DEFAULT 0;
ALTER TABLE inventory ADD COLUMN IF NOT EXISTS location VARCHAR(100);

-- ADMINS
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- RECEPTIONISTS (Ensure table exists if not covered by other migrations)
CREATE TABLE IF NOT EXISTS receptionists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin (password: 123456)
INSERT IGNORE INTO admins (name, email, password) VALUES 
('Super Admin', 'admin@clinic.com', '$2a$10$Hj2tTKwmC2xTOHBPod.aBupZ19GVvjunCJmWI8F/qZc7Zr6FmR12C');

