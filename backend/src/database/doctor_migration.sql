-- =========================================
-- DOCTOR MODULE MIGRATION
-- =========================================

USE clinic_system;

-- 1. ADD COLUMNS TO DOCTORS TABLE
-- We need password for login, and profile fields
ALTER TABLE doctors
ADD COLUMN password VARCHAR(255) DEFAULT NULL AFTER email,
ADD COLUMN qualifications JSON DEFAULT NULL AFTER specialization,
ADD COLUMN certifications JSON DEFAULT NULL,
ADD COLUMN languages JSON DEFAULT NULL,
ADD COLUMN hospital VARCHAR(255) DEFAULT NULL,
ADD COLUMN address TEXT DEFAULT NULL,
ADD COLUMN consultation_fee VARCHAR(50) DEFAULT NULL,
ADD COLUMN available BOOLEAN DEFAULT TRUE;

-- Update existing doctor (if any) with a default password (hashed 'doctor123')
-- $2a$10$wI.u/v.u/v.u/v.u/v.u/v.u/v.u/v.u/v.u/v.u/v.u/v.u/v.u (Placeholder, will use real hash in code if needed)
-- For demo purposes using a known hash for 'doctor123': $2a$10$Metric/.. (Need a valid bcrypt hash)
-- Let's assume we update it via the application or use a simple hash for now.
-- Actually, let's just set a raw password for now and let the app hash it, OR update via a script.
-- For safety, let's not set a raw password in SQL if the app expects hashed.
-- We will update the sample doctor via the run_migration.js script using bcrypt.

-- 2. ADD COLUMNS TO PATIENTS TABLE
-- Frontend shows phone, email, address, condition, last_visit, next_appointment
ALTER TABLE patients
ADD COLUMN phone VARCHAR(20) DEFAULT NULL,
ADD COLUMN email VARCHAR(100) DEFAULT NULL,
ADD COLUMN address TEXT DEFAULT NULL,
ADD COLUMN medical_condition VARCHAR(255) DEFAULT NULL,
ADD COLUMN last_visit DATE DEFAULT NULL,
ADD COLUMN next_appointment DATE DEFAULT NULL,
ADD COLUMN status ENUM('Active', 'Inactive', 'Follow-up Required') DEFAULT 'Active';

-- 3. ENSURE APPOINTMENTS HAS TYPES
-- We already have 'type' in appointments from admin_migration, checking if we need more
-- ALTER TABLE appointments MODIFY COLUMN type VARCHAR(50); -- already done

-- 4. PRESCRIPTIONS
-- Exists? Yes.
-- Check if we need 'status' (already added), 'instructions' (notes?), 'medicines' (items table)
-- We might need to link prescriptions to doctor_id if not already done.
-- existing: prescriptions (id, patient_id, doctor_name, notes, created_at, status)
-- We should add doctor_id to prescriptions for better linking
ALTER TABLE prescriptions
ADD COLUMN doctor_id INT DEFAULT NULL,
ADD CONSTRAINT fk_prescription_doctor FOREIGN KEY (doctor_id) REFERENCES doctors(id);

-- Update existing prescriptions to link to a doctor if possible
-- UPDATE prescriptions SET doctor_id = (SELECT id FROM doctors LIMIT 1) WHERE doctor_id IS NULL;
