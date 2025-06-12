CREATE TABLE app_slider (
    slider_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url TEXT,
    description TEXT,
    slide_order INTEGER
);

CREATE TABLE role (
    id_role UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE app_size (
    id_size UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    size_vi VARCHAR(255) NOT NULL,
    size_eur VARCHAR(255)
);

CREATE TABLE app_user (
    id_account UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    gender VARCHAR(50),
    cccd VARCHAR(20) UNIQUE,
    email VARCHAR(255) UNIQUE,
    number_phone VARCHAR(20),
    date_of_birth DATE,
    image_user TEXT,
    id_role UUID NOT NULL,
    CONSTRAINT fk_role FOREIGN KEY (id_role) REFERENCES role(id_role) ON DELETE CASCADE
);

CREATE TABLE app_brand (
    id_brand UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_name VARCHAR(255) NOT NULL,
    description_brand TEXT,
    image_brand TEXT
);

CREATE TABLE app_address (
    shopping_info_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shopping_info_name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    shopping_info_phone VARCHAR(20) NOT NULL,
    id_account UUID NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY (id_account) REFERENCES app_user(id_account) ON DELETE CASCADE
);

CREATE TABLE app_product (
    shoes_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shoes_name VARCHAR(255) NOT NULL,
    shoes_price NUMERIC(15, 2) NOT NULL,
    shoes_description TEXT,
    id_brand UUID NOT NULL,
    CONSTRAINT fk_brand FOREIGN KEY (id_brand) REFERENCES app_brand(id_brand) ON DELETE CASCADE
);

CREATE TABLE shoes_images (
    shoes_id UUID NOT NULL,
    image_url TEXT,
    CONSTRAINT fk_shoes FOREIGN KEY (shoes_id) REFERENCES app_product(shoes_id) ON DELETE CASCADE
);

CREATE TABLE cart_item (
    id_cart UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_account UUID NOT NULL,
    shoes_id UUID NOT NULL,
    id_size UUID NOT NULL,
    quantity INT NOT NULL CHECK (quantity >= 1),
    CONSTRAINT fk_user FOREIGN KEY (id_account) REFERENCES app_user(id_account) ON DELETE CASCADE,
    CONSTRAINT fk_product FOREIGN KEY (shoes_id) REFERENCES app_product(shoes_id) ON DELETE CASCADE,
    CONSTRAINT fk_size FOREIGN KEY (id_size) REFERENCES app_size(id_size) ON DELETE CASCADE
);

CREATE TABLE stock (
    id_inventory UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shoes_id UUID NOT NULL,
    id_size UUID NOT NULL,
    quantity_in_stock INT NOT NULL,
    CONSTRAINT fk_product FOREIGN KEY (shoes_id) REFERENCES app_product(shoes_id) ON DELETE CASCADE,
    CONSTRAINT fk_size FOREIGN KEY (id_size) REFERENCES app_size(id_size) ON DELETE CASCADE
);

CREATE TABLE bill (
    bill_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_account UUID NOT NULL,
    total_amount DECIMAL(15, 2) NOT NULL,
    bill_date TIMESTAMP NOT NULL,
    status VARCHAR(255),
    shopping_info_id UUID NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY (id_account) REFERENCES app_user(id_account) ON DELETE CASCADE,
    CONSTRAINT fk_address FOREIGN KEY (shopping_info_id) REFERENCES app_address(shopping_info_id) ON DELETE CASCADE
);

CREATE TABLE bill_detail (
    bill_detail_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bill_id UUID NOT NULL,
    shoes_id UUID NOT NULL,
    id_size UUID NOT NULL,
    quantity INT NOT NULL,
    total_price DECIMAL(15, 2) NOT NULL,
    CONSTRAINT fk_bill FOREIGN KEY (bill_id) REFERENCES bill(bill_id) ON DELETE CASCADE,
    CONSTRAINT fk_product FOREIGN KEY (shoes_id) REFERENCES app_product(shoes_id) ON DELETE CASCADE,
    CONSTRAINT fk_size FOREIGN KEY (id_size) REFERENCES app_size(id_size) ON DELETE CASCADE
);

CREATE EXTENSION IF NOT EXISTS pgcrypto;


