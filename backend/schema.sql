CREATE TABLE users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    username NVARCHAR(255) UNIQUE NOT NULL,
    password NVARCHAR(255) NOT NULL,
    role NVARCHAR(50) NOT NULL,
    venue_detail NVARCHAR(MAX),
    local_name NVARCHAR(255),
    local_email NVARCHAR(255)
);