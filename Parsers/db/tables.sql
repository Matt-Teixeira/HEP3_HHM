DROP TABLE IF EXISTS siemens_mri;
DROP TABLE IF EXISTS siemens_ct;
DROP TABLE IF EXISTS ge_mri_gesys_mroc;
DROP TABLE IF EXISTS philips_ct_eal;
DROP TABLE IF EXISTS philips_ct_events;
DROP TABLE IF EXISTS philips_mri_logcurrent;
DROP TABLE IF EXISTS philips_mri_rmmu_short;

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
    date_time DATE
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
    date_time DATE
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
    date_time DATE
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
    date_time DATE
);

CREATE TABLE philips_ct_events(
    id BIGSERIAL PRIMARY KEY,
    equipment_id TEXT,
    eventtime TEXT,
    blob TEXT,
    type TEXT,
    tstampnum TEXT,
    eal TEXT,
    level TEXT,
    ermodulernum TEXT,
    dtime TEXT,
    msg TEXT,
    date_time DATE
);

CREATE TABLE philips_mri_logcurrent(
    id BIGSERIAL PRIMARY KEY,
    equipment_id TEXT,
    host_date DATE,
    host_time TIME,
    data_1 TEXT,
    data_2 TEXT,
    data_3 TEXT,
    data_4 TEXT,
    data_5 TEXT,
    data_6 TEXT,
    data_7 TEXT,
    packets_created TEXT,
    data_created_gb TEXT,
    size_copy_gb TEXT,
    data_8 TEXT,
    reconstructor TEXT,
    date_time DATE
);

CREATE TABLE philips_mri_rmmu_short(
    id BIGSERIAL PRIMARY KEY,
    equipment_id TEXT,
    system_reference_number TEXT,
    hospital_name TEXT,
    serial_number_magnet TEXT,
    serial_number_meu TEXT,
    lineno INT,
    year INT,
    mo INT,
    dy INT,
    hr INT,
    mn INT,
    ss INT,
    hs INT,
    AvgPwr INT,
    MinPwr INT,
    MaxPwr INT,
    AvgAbs INT,
    AvgPrMbars INT,
    MinPrMbars INT,
    MaxPrMbars INT,
    LHePct INT,
    LHe2 INT,
    DiffPressureSwitch varchar(2),
    TempAlarm varchar(2),
    PressureAlarm varchar(2),
    Cerr varchar(2),
    CompressorReset varchar(2),
    Chd INT,
    Cpr INT,
    date_time DATE
);

CREATE TABLE philips_mri_rmmu_long(
    id BIGSERIAL PRIMARY KEY,
    equipment_id TEXT,
    system_reference_number TEXT,
    hospital_name TEXT,
    serial_number_magnet TEXT,
    serial_number_meu TEXT,
    lineno INT,
    year INT,
    mo INT,
    dy INT,
    hr INT,
    mn INT,
    ss INT,
    hs INT,
    dow INT,
    AvgPwr INT,
    MinPwr INT,
    MaxPwr INT,
    AvgAbs INT,
    AvgPrMbars INT,
    MinPrMbars INT,
    MaxPrMbars INT,
    LHePct INT,
    LHe2 INT,
    DiffPressureSwitch varchar(2),
    TempAlarm varchar(2),
    PressureAlarm varchar(2),
    Cerr varchar(2),
    CompressorReset varchar(2),
    Chd INT,
    Cpr INT,
    date_time DATE
);