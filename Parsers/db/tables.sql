DROP TABLE IF EXISTS siemens_mri;
DROP TABLE IF EXISTS siemens_ct;
DROP TABLE IF EXISTS ge_mri_gesys;
DROP TABLE IF EXISTS ge_ct_gesys;
DROP TABLE IF EXISTS ge_cv_syserror;
DROP TABLE IF EXISTS philips_ct_eal;
DROP TABLE IF EXISTS philips_ct_events;
DROP TABLE IF EXISTS philips_mri_logcurrent;
DROP TABLE IF EXISTS philips_mri_rmmu_short;
DROP TABLE IF EXISTS philips_mri_rmmu_long;
DROP TABLE IF EXISTS philips_mri_rmmu_magnet
DROP TABLE IF EXISTS philips_cv_eventlog;
DROP TABLE IF EXISTS philips_mri_monitor;
DROP TABLE IF EXISTS philips_mri_monitoring_data

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
    date_time TEXT
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
    date_time TEXT
);

CREATE TABLE siemens_cv(
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

CREATE TABLE ge_mri_gesys(
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

CREATE TABLE ge_ct_gesys(
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

CREATE TABLE ge_cv_syserror(
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
    date_time TEXT
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
    date_time TEXT
);

CREATE TABLE philips_mri_logcurrent(
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
    data_created_gb TEXT,
    size_copy_gb TEXT,
    data_8 TEXT,
    reconstructor TEXT,
    date_time TEXT
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
    date_time TEXT
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
    date_time TEXT
);

CREATE TABLE philips_mri_rmmu_magnet(
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
    event TEXT,
    data TEXT,
    descr TEXT,
    date_time TEXT
);

CREATE TABLE philips_cv_eventlog(
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

CREATE TABLE philips_mri_monitor(
    id TEXT NOT NULL PRIMARY KEY,
    equipment_id TEXT,
    monitoring_data jsonb
);

CREATE TABLE philips_mri_monitoring_data(
    id BIGSERIAL PRIMARY KEY,
    equipment_id TEXT,
    monitor_1HRFAmp1_AvgPower INT,
    monitor_1HRFAmp1_PredAvgPower INT,
    monitor_EPI_AvgPhix INT,
    monitor_EPI_Delay INT,
    monitor_EPI_MaxDevPHPhi0 INT,
    monitor_EPI_MaxDevPHPhix INT,
    monitor_EPI_MaxDevPHSig INT,
    monitor_EPI_MaxPHPhaseRes INT,
    monitor_EPI_MinPHPhaseRes INT,
    monitor_EPI_OutlierPHPhi0 INT,
    monitor_EPI_OutlierPHPhix INT,
    monitor_EPI_OutlierPHSig INT,
    monitor_EPI_StdDevPHPhi0 INT,
    monitor_EPI_StdDevPHPhix INT,
    monitor_EPI_StdDevPHSig INT,
    monitor_PrepShim_LinewidthChange INT,
    monitor_PrepShim_PowsumChange INT,
    monitor_Spikes_MaxSpecSpikePower INT,
    monitor_Spikes_NoisePower INT,
    monitor_Spikes_NrAboveThreshold1 INT,
    monitor_Spikes_NrAboveThreshold2 INT,
    monitor_Spikes_NrAboveThreshold3 INT,
    monitor_Spikes_NrSuppressed INT,
    monitor_Spikes_PowerAboveThreshold1 INT,
    monitor_Spikes_PowerAboveThreshold2 INT,
    monitor_Spikes_PowerAboveThreshold3 INT,
    monitor_Spikes_QPI INT,
    monitor_Spikes_QPIAfterCorrection INT,
    monitor_Spikes_ScanName TEXT,
    monitor_Spikes_SpikeNoiseFraction INT,
    monitor_System_HumExamRoom INT,
    monitor_System_HumTechRoom INT,
    monitor_System_TempExamRoom INT,
    monitor_System_TempTechRoom INT,
    monitor_cryocompressor_bypass INT,
    monitor_cryocompressor_cerr INT,
    monitor_cryocompressor_palm INT,
    monitor_cryocompressor_talm INT,
    monitor_cryocompressor_time_status INT,
    monitor_magnet_b0_heater_on INT,
    monitor_magnet_helium_level_status INT,
    monitor_magnet_helium_level_value INT,
    monitor_magnet_helium_refill_level INT,
    monitor_magnet_lt_boiloff INT,
    monitor_magnet_pressure_dps INT,
    monitor_magnet_quench INT,
    monitor_magnet_under_pressure INT,
);

CREATE TABLE philips_mri_monitoring_data(
    id BIGSERIAL PRIMARY KEY,
    equipment_id TEXT,
    host_date DATE,
    host_time TIME,
    tech_room_humidity INT,
    tech_room_temp INT,
    cryo_comp_comm_error INT,
    cryo_comp_press_alarm INT,
    cryo_comp_temp_alarm INT,
    cryo_comp_malf_minutes INT,
    helium_level_value INT,
    long_term_boil_off INT,
    mag_dps_status_minutes INT,
    quenched INT
);