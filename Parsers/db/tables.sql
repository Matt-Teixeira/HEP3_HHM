DROP TABLE IF EXISTS hhm.siemens_mri;
DROP TABLE IF EXISTS hhm.siemens_ct;
DROP TABLE IF EXISTS hhm.siemens_cv;
DROP TABLE IF EXISTS hhm.ge_mri_gesys;
DROP TABLE IF EXISTS hhm.ge_ct_gesys;
DROP TABLE IF EXISTS hhm.ge_cv_syserror;
DROP TABLE IF EXISTS hhm.philips_ct_eal;
DROP TABLE IF EXISTS hhm.philips_ct_events;
DROP TABLE IF EXISTS hhm.philips_mri_logcurrent;
DROP TABLE IF EXISTS hhm.philips_mri_rmmu_short;
DROP TABLE IF EXISTS hhm.philips_mri_rmmu_long;
DROP TABLE IF EXISTS hhm.philips_cv_eventlog;
DROP TABLE IF EXISTS hhm.philips_mri_monitor;
DROP TABLE IF EXISTS hhm.philips_mri_monitoring_data;

create schema hhm;

CREATE TABLE hhm.siemens_mri(
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
    date_time TEXT
);

CREATE TABLE hhm.siemens_ct(
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
    date_time TEXT
);

CREATE TABLE hhm.siemens_cv(
    id BIGSERIAL PRIMARY KEY,
    equipment_id VARCHAR(10),
    host_time TIME,
    source_group TEXT,
    type_group INT,
    text_group TEXT,
    domain_group TEXT,
    id_group INT,
    month TEXT,
    day INT,
    year INT,
    date_time TEXT
);

CREATE TABLE hhm.ge_mri_gesys(
    id BIGSERIAL PRIMARY KEY,
    equipment_id TEXT,
    epoch INT,
    record_number_concurrent INT,
    misc_param_1 INT,
    month VARCHAR(4),
    day INT,
    host_time TIME,
    year INT,
    message_number INT,
    misc_param_2 INT,
    type TEXT,
    data_1 TEXT,
    num_1 INT,
    server TEXT,
    task_id TEXT,
    task_epoc INT,
    object TEXT,
    exception_class TEXT,
    severity TEXT,
    function TEXT,
    psd TEXT,
    coil TEXT,
    scan TEXT,
    message TEXT,
    sr INT,
    en INT,
    date_time TEXT
);

CREATE TABLE hhm.ge_ct_gesys(
    id BIGSERIAL PRIMARY KEY,
    equipment_id TEXT,
    epoch INT,
    record_number_concurrent INT,
    misc_param_1 INT,
    month VARCHAR(4),
    day INT,
    host_time TIME,
    year INT,
    message_number INT,
    misc_param_2 INT,
    type TEXT,
    data_1 TEXT,
    num_1 INT,
    date_2 TEXT,
    host TEXT,
    ermes_number INT,
    exception_class TEXT,
    severity TEXT,
    file TEXT,
    line_number INT,
    scan_type TEXT,
    warning TEXT,
    end_msg TEXT,
    message TEXT,
    sr INT,
    en INT,
    date_time TEXT
);

CREATE TABLE hhm.ge_cv_syserror(
    id BIGSERIAL PRIMARY KEY,
    equipment_id TEXT,
    sequencenumber INT,
    host_date DATE,
    host_time TEXT,
    subsystem VARCHAR(8),
    errorcode INT,
    errortext TEXT,
    exam INT,
    exceptioncategory VARCHAR(10),
    application TEXT,
    majorfunction TEXT,
    minorfunction TEXT,
    fru TEXT,
    viewinglevel INT,
    rootcause INT,
    repeatcount INT,
    debugtext TEXT,
    sourcefile TEXT,
    sourceline INT,
    date_time TEXT
);


CREATE TABLE hhm.philips_ct_eal(
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
    date_time TEXT
);

CREATE TABLE hhm.philips_ct_events(
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
    date_time TEXT
);

CREATE TABLE hhm.philips_mri_logcurrent(
    id BIGSERIAL PRIMARY KEY,
    equipment_id TEXT,
    host_date DATE,
    host_time TIME,
    row_type TEXT,
    event_type TEXT,
    subsystem TEXT,
    code_1 TEXT,
    code_2 TEXT,
    group_1 TEXT,
    message TEXT,
    packets_created TEXT,
    data_created_value TEXT,
    size_copy_value TEXT,
    data_8 TEXT,
    reconstructor TEXT,
    date_time TEXT
);

CREATE TABLE hhm.philips_mri_rmmu_short(
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
    AvgPwr_value INT,
    MinPwr_value INT,
    MaxPwr_value INT,
    AvgAbs_value INT,
    AvgPrMbars_value INT,
    MinPrMbars_value INT,
    MaxPrMbars_value INT,
    LHePct_value INT,
    LHe2_value INT,
    DiffPressureSwitch_state varchar(2),
    TempAlarm_state varchar(2),
    PressureAlarm_state varchar(2),
    Cerr_state varchar(2),
    CompressorReset_state varchar(2),
    Chd_value INT,
    Cpr_value INT,
    date_time TEXT
);

CREATE TABLE hhm.philips_mri_rmmu_long(
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
    dow_value INT,
    AvgPwr_value INT,
    MinPwr_value INT,
    MaxPwr_value INT,
    AvgAbs_value INT,
    AvgPrMbars_value INT,
    MinPrMbars_value INT,
    MaxPrMbars_value INT,
    LHePct_value INT,
    LHe2_value INT,
    DiffPressureSwitch_state varchar(2),
    TempAlarm_state varchar(2),
    PressureAlarm_state varchar(2),
    Cerr_state varchar(2),
    CompressorReset_state varchar(2),
    Chd_value INT,
    Cpr_value INT,
    date_time TEXT
);

CREATE TABLE hhm.philips_cv_eventlog(
    id BIGSERIAL PRIMARY KEY,
    equipment_id TEXT,
    category TEXT,
    host_date DATE,
    host_time TIME,
    error_type TEXT,
    num_1 INT,
    technical_event_id INT,
    description  TEXT,
    channel_id  TEXT,
    module TEXT,
    source TEXT,
    line INT,
    memo TEXT,
    subsystem_number INT,
    thread_name TEXT,
    message TEXT,
    date_time TEXT
);

CREATE TABLE hhm.philips_mri_monitor(
    id TEXT PRIMARY KEY,
    equipment_id TEXT,
    monitoring_data jsonb
);

CREATE TABLE hhm.philips_mri_monitoring_data(
    id BIGSERIAL PRIMARY KEY,
    equipment_id TEXT,
    host_date TEXT,
    tech_room_humidity_value DECIMAL, -- [%] (0=sensor not connected or broken)
    tech_room_temp_value DECIMAL, -- [C](0=sensor not connected or broken)
    cryo_comp_comm_error_state DECIMAL, -- 0=OK, > 0 = alarm bool
    cryo_comp_press_alarm_value DECIMAL, -- (minutes) [0=OK, > 0 = alarm]
    cryo_comp_temp_alarm_value DECIMAL, -- (minutes) [0=OK, > 0 = alarm]
    cryo_comp_malf_value DECIMAL, -- (minutes) [-1=Cable error, 0=OK, > 0 = alarm in minutes)]
    helium_level_value DECIMAL, -- [%]
    long_term_boil_off_value DECIMAL, -- (-1 = stuck_probe) [ml/h]
    mag_dps_status_value DECIMAL, -- (minutes) [0=OK,  >0 =Alarm status]
    quenched_state DECIMAL -- [0=No;1=Yes]
);

-- System Unites

DROP TABLE IF EXISTS hhm.philips_hhm_units;

CREATE TABLE hhm.philips_hhm_units(
    system_id text NOT NULL PRIMARY KEY,
    dow_value TEXT,
    AvgPwr_value TEXT,
    MinPwr_value TEXT,
    MaxPwr_value TEXT,
    AvgAbs_value TEXT,
    AvgPrMbars_value TEXT,
    MinPrMbars_value TEXT,
    MaxPrMbars_value TEXT,
    LHePct_value TEXT,
    LHe2_value TEXT,
    Chd_value TEXT,
    Cpr_value TEXT,
    tech_room_humidity_value TEXT, -- [%] (0=sensor not connected or broken)
    tech_room_temp_value TEXT, -- [C](0=sensor not connected or broken)
    cryo_comp_press_alarm_value TEXT, -- (minutes) [0=OK, > 0 = alarm]
    cryo_comp_temp_alarm_value TEXT, -- (minutes) [0=OK, > 0 = alarm]
    cryo_comp_malf_value TEXT, -- (minutes) [-1=Cable error, 0=OK, > 0 = alarm in minutes)]
    helium_level_value TEXT, -- [%]
    long_term_boil_off_value TEXT, -- (-1 = stuck_probe) [ml/h]
    mag_dps_status_value TEXT -- (ml/h) [0=OK,  >0 =Alarm status]
);
ALTER TABLE ONLY hhm.philips_hhm_units
    ADD CONSTRAINT fk_system_id FOREIGN KEY (system_id) REFERENCES public.systems(id);

INSERT INTO hhm.philips_hhm_units (system_id, tech_room_humidity_value, tech_room_temp_value, cryo_comp_press_alarm_value, cryo_comp_temp_alarm_value, cryo_comp_malf_value, helium_level_value, long_term_boil_off_value, mag_dps_status_value)
VALUES ('SME01138', '%', 'C', 'minutes', 'minutes', 'minutes', '%', 'ml/h', 'minutes');

SELECT * FROM hhm.philips_hhm_units;