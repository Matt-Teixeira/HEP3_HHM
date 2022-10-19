DROP TABLE IF EXISTS mri;
DROP TABLE IF EXISTS ct;

CREATE TABLE mri(
    id BIGSERIAL PRIMARY KEY,
    equipment_id VARCHAR(10),
    host_state VARCHAR(4),
    host_date DATE,
    host_time TIME,
    source_group TEXT,
    type_group INT,
    text_group TEXT,
    domain_group TEXT,
    id_group INT
);

CREATE TABLE ct(
    id BIGSERIAL PRIMARY KEY,
    equipment_id VARCHAR(10),
    host_state VARCHAR(4),
    host_date DATE,
    host_time TIME,
    source_group TEXT,
    type_group INT,
    text_group TEXT,
    domain_group TEXT,
    id_group INT
);

CREATE TABLE mri(
    id BIGSERIAL PRIMARY KEY,
    equipment_id VARCHAR(10),
    host_state VARCHAR(4),
    host_date DATE,
    host_time TIME,
    host_col_1 TEXT,
    host_col_2 TEXT,
    host_info TEXT
);

CREATE TABLE ct(
    id BIGSERIAL PRIMARY KEY,
    equipment_id VARCHAR(10),
    host_state VARCHAR(4),
    host_date DATE,
    host_time TIME,
    host_col_1 TEXT,
    host_col_2 TEXT,
    host_info TEXT
);