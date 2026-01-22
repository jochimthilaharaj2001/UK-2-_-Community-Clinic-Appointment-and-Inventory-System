-- Inventory Table Migration for Admin/Pharmacist
CREATE TABLE IF NOT EXISTS inventory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL, -- Generic or Brand name
    category VARCHAR(100),
    stock INT DEFAULT 0,
    unit VARCHAR(50), -- e.g. tablets, pcs
    reorder_level INT DEFAULT 10,
    price DECIMAL(10, 2),
    supplier VARCHAR(255),
    expiry_date DATE,
    location VARCHAR(100), -- Storage location
    status ENUM('in-stock', 'low-stock', 'out-of-stock', 'expiring-soon') DEFAULT 'in-stock',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
