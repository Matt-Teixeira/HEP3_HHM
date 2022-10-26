DROP TABLE IF EXISTS siemens_mri;
DROP TABLE IF EXISTS siemens_ct;
DROP TABLE IF EXISTS ge_mri_gesys_mroc;
DROP TABLE IF EXISTS philips_ct_eal;

CREATE TABLE siemens_mri(
    id BIGSERIAL PRIMARY KEY,
    equipment_id VARCHAR(10),
    host_state TEXT,
    host_date DATE,
    host_time TIME,
    source_group TEXT,
    type_group INT,
    text_group TEXT,
    domain_group TEXT,
    id_group INT,
    month TEXT,
    day INT,
    year INT,
    host_dateTime DATE
);

CREATE TABLE siemens_ct(
    id BIGSERIAL PRIMARY KEY,
    equipment_id VARCHAR(10),
    host_state TEXT,
    host_date DATE,
    host_time TIME,
    source_group TEXT,
    type_group INT,
    text_group TEXT,
    domain_group TEXT,
    id_group INT,
    month TEXT,
    day INT,
    year INT,
    host_dateTime DATE
);

CREATE TABLE ge_mri_gesys_mroc(
    id BIGSERIAL PRIMARY KEY,
    equipment_id text,
    time_stamp int,
    num_1 text,
    num_2 text,
    month text,
    day text,
    host_time time,
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
    host_dateTime DATE
);

CREATE TABLE philips_ct_eal(
    id BIGSERIAL PRIMARY KEY,
    equipment_id TEXT,
    line TEXT,
    err_type TEXT,
    tmstamp TEXT,
    file TEXT,
    datatype TEXT,
    param1 TEXT,
    errnum TEXT,
    info TEXT,
    dtime TEXT,
    ealtime TEXT,
    lognumber TEXT,
    param2 TEXT,
    vxwerrno INT,
    controller TEXT,
    host_dateTime DATE
);