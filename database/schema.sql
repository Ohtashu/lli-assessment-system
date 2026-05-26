-- 1. Create the Database
CREATE DATABASE AssetManagementDB;
GO

USE AssetManagementDB;
GO

-- 2. Users Table (For Login Functionality)
CREATE TABLE Users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'Staff' CHECK (role IN ('Admin', 'Staff')),
    created_at DATETIME DEFAULT GETDATE()
);
GO

-- 3. Assets Table (For CRUD Functionality)
CREATE TABLE Assets (
    id INT IDENTITY(1,1) PRIMARY KEY,
    asset_tag VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,            
    category VARCHAR(50) NOT NULL,         
    status VARCHAR(20) DEFAULT 'Active' CHECK (status IN ('Active', 'In Repair', 'Retired')),
    assigned_to VARCHAR(100) NULL,         
    purchase_date DATE NULL,
    cost DECIMAL(10, 2) NULL,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);
GO

-- 4. Insert Seed Data (Default Admin Credentials)
-- Default Password before hashing: AdminPassword123!
INSERT INTO Users (name, email, password_hash, role)
VALUES (
    'System Admin', 
    'admin@lli.com', 
    '$2a$12$GMe21.dtqE9x0X1Y.DeCKu.SnkmFD..KQRax05yjN6hwQgbBQmYHO', 
    'Admin'
);
GO