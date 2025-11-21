-- 1. TABLAS (Requisito: Diseño Normalizado)
-- Tabla de Usuarios para el login
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('gerente', 'farmaceutico', 'investigador'))
);

-- Tabla de Medicamentos (Información general)
CREATE TABLE IF NOT EXISTS medications (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    active_ingredient VARCHAR(100) NOT NULL,
    description TEXT,
    requires_prescription BOOLEAN DEFAULT false
);

-- Tabla de Lotes (Inventario físico - Aquí controlamos caducidad y precio)
CREATE TABLE IF NOT EXISTS batches (
    id SERIAL PRIMARY KEY,
    medication_id INT REFERENCES medications(id),
    batch_number VARCHAR(50) UNIQUE NOT NULL,
    expiration_date DATE NOT NULL,
    quantity INT CHECK (quantity >= 0), -- Constraint para evitar inventario negativo
    price DECIMAL(10, 2) NOT NULL
);

-- Tabla de Ventas (Cabecera)
CREATE TABLE IF NOT EXISTS sales (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    sale_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2)
);

-- Tabla de Detalle de Ventas (Qué se vendió exactamente)
CREATE TABLE IF NOT EXISTS sale_items (
    id SERIAL PRIMARY KEY,
    sale_id INT REFERENCES sales(id),
    batch_id INT REFERENCES batches(id),
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2)
);

-- 2. ÍNDICES (Requisito 5.1: Estructuras Físicas para optimización)
-- Índice para buscar medicamentos por nombre rápidamente
CREATE INDEX IF NOT EXISTS idx_medication_name ON medications(name);
-- Índice para encontrar lotes próximos a vencer (crítico para farmacéuticas)
CREATE INDEX IF NOT EXISTS idx_batch_expiry ON batches(expiration_date);

-- 3. DATOS SEMILLA (Para tener algo con qué probar)
INSERT INTO users (username, password_hash, role) VALUES 
('admin_gerente', 'hash123', 'gerente'),
('pepe_farma', 'hash123', 'farmaceutico'),
('ana_investiga', 'hash123', 'investigador')
ON CONFLICT DO NOTHING;

INSERT INTO medications (name, active_ingredient, description) VALUES
('Paracetamol 500mg', 'Paracetamol', 'Analgésico y antipirético'),
('Amoxicilina 500mg', 'Amoxicilina', 'Antibiótico de amplio espectro')
ON CONFLICT DO NOTHING;

-- 4. ROLES DE BASE DE DATOS (Requisito 5.4 y 5.5: Seguridad)
-- Nota: Creamos roles a nivel de Motor de BD para cumplir el requisito académico.

DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'rol_gerente') THEN
    CREATE ROLE rol_gerente WITH LOGIN PASSWORD 'securePass1';
    GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO rol_gerente;
  END IF;

  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'rol_farmaceutico') THEN
    CREATE ROLE rol_farmaceutico WITH LOGIN PASSWORD 'securePass2';
    -- Farmacéutico: Puede leer todo, pero solo insertar/modificar en ventas y lotes
    GRANT SELECT ON ALL TABLES IN SCHEMA public TO rol_farmaceutico;
    GRANT INSERT, UPDATE ON batches TO rol_farmaceutico;
    GRANT INSERT ON sales, sale_items TO rol_farmaceutico;
  END IF;

  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'rol_investigador') THEN
    CREATE ROLE rol_investigador WITH LOGIN PASSWORD 'securePass3';
    -- Investigador: Solo lectura estricta
    GRANT SELECT ON ALL TABLES IN SCHEMA public TO rol_investigador;
  END IF;
END
$$;