DROP TABLE IF EXISTS mri;
DROP TABLE IF EXISTS ct;
DROP TABLE IF EXISTS ge_mri_gesys_mroc;

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

CREATE TABLE ge_mri_gesys_mroc(
    id BIGSERIAL PRIMARY KEY,
    equipment_id text,
    time_stamp int,
    num_1 text,
    num_2 text,
    month text,
    day text,
    time time,
    year text,
    num_3 text,
    num_4 text,
    mroc text,
    data_1 text,
    num_5 text,
    data_2 text,
    server_name text,
    exception_class text,
    task_id text,
    time_2 text,
    object text,
    sr_group text,
    en text,
    host_dateTime text
);

