-- Add missing fields to patients table to support full registration
ALTER TABLE patients ADD COLUMN first_name VARCHAR(100);
ALTER TABLE patients ADD COLUMN last_name VARCHAR(100);
ALTER TABLE patients ADD COLUMN date_of_birth DATE;
ALTER TABLE patients ADD COLUMN marital_status VARCHAR(20);
ALTER TABLE patients ADD COLUMN emergency_contact VARCHAR(100);
ALTER TABLE patients ADD COLUMN emergency_phone VARCHAR(20);
ALTER TABLE patients ADD COLUMN blood_group VARCHAR(10);
ALTER TABLE patients ADD COLUMN allergies TEXT;
ALTER TABLE patients ADD COLUMN medical_history TEXT;
ALTER TABLE patients ADD COLUMN current_medications TEXT;
ALTER TABLE patients ADD COLUMN insurance_provider VARCHAR(100);
ALTER TABLE patients ADD COLUMN insurance_id VARCHAR(50);
ALTER TABLE patients ADD COLUMN policy_number VARCHAR(50);
ALTER TABLE patients ADD COLUMN primary_doctor VARCHAR(100);
ALTER TABLE patients ADD COLUMN referral_source VARCHAR(100);
ALTER TABLE patients ADD COLUMN notes TEXT;
