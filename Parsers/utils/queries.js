module.exports = queries = {
  CT_7: `
    INSERT INTO ct (
      equipment_id,
        source_group,
        host_date,
        host_time,
        domain_group,
        type_group,
        id_group,
        text_group
    )
    SELECT * FROM UNNEST (
      $1::text[], $2::text[], $3::date[], $4::time[], $5::text[], $6::numeric[], $7::numeric[], $8::text[]
    )
    `,
  CT_10: `
    INSERT INTO ct (
      equipment_id,
        host_state,
        host_date,
        host_time,
        source_group,
        type_group,
        text_group
    )
    SELECT * FROM UNNEST (
      $1::text[], $2::text[], $3::date[], $4::time[], $5::text[], $6::numeric[], $7::text[]
    )
    `,
  MRI_7: `
    INSERT INTO mri (
      equipment_id,
        source_group,
        host_date,
        host_time,
        domain_group,
        type_group,
        id_group,
        text_group
    )
    SELECT * FROM UNNEST (
      $1::text[], $2::text[], $3::date[], $4::time[], $5::text[], $6::numeric[], $7::numeric[], $8::text[]
    )
    `,
  MRI_10: `
    INSERT INTO mri (
      equipment_id,
        host_state,
        host_date,
        host_time,
        source_group,
        type_group,
        text_group
    )
    SELECT * FROM UNNEST (
      $1::text[], $2::text[], $3::date[], $4::time[], $5::text[], $6::numeric[], $7::text[]
    )
    `,
  ge: {
    MRI: {
      gesys_mroc: `
        INSERT INTO ge_mri_gesys_mroc (
          equipment_id,
          time_stamp,
          num_1,
          num_2,
          month,
          day,
          host_time,
          year,
          num_3,
          num_4,
          mroc,
          data_1,
          num_5,
          data_2,
          server_name,
          exception_class,
          task_id,
          time_2,
          object,
          sr_group,
          en,
          host_dateTime
        )
        SELECT * FROM UNNEST (
          $1::text[], $2::numeric[], $3::text[], $4::text[], $5::text[], $6::text[], $7::time[], $8::text[], $9::text[], $10::text[], $11::text[], $12::text[], $13::text[], $14::text[], $15::text[], $16::text[], $17::text[], $18::text[], $19::text[], $20::text[], $21::text[], $22::date[]
        )
        `,
    },
  },
  siemens: {
    CT: {
      windows: `
      INSERT INTO siemens_ct (
          equipment_id,
          host_state,
          host_date,
          host_time,
          source_group,
          type_group,
          text_group,
          domain_group,
          id_group,
          month,
          day,
          year,
          host_dateTime
      )
      SELECT * FROM UNNEST (
        $1::text[], $2::text[], $3::date[], $4::time[], $5::text[], $6::numeric[], $7::text[], $8::text[], $9::numeric[], $10::text[], $11::numeric[], $12::numeric[], $13::date[]
      )
      `,
    },
    MRI: {
      windows: `
      INSERT INTO siemens_mri (
          equipment_id,
          host_state,
          host_date,
          host_time,
          source_group,
          type_group,
          text_group,
          domain_group,
          id_group,
          month,
          day,
          year,
          host_dateTime
      )
      SELECT * FROM UNNEST (
        $1::text[], $2::text[], $3::date[], $4::time[], $5::text[], $6::numeric[], $7::text[], $8::text[], $9::numeric[], $10::text[], $11::numeric[], $12::numeric[], $13::date[]
      )
      `,
    },
  },
  philips: {
    CT: {
      eal_info: `
      INSERT INTO philips_ct_eal (
        equipment_id,
        line,
        err_type,
        tmstamp,
        file,
        datatype,
        param1,
        errnum,
        info,
        dtime,
        ealtime,
        lognumber,
        param2,
        vxwerrno,
        controller,
        host_dateTime
      )
      SELECT * FROM UNNEST (
        $1::text[], $2::text[], $3::text[], $4::text[], $5::text[], $6::text[], $7::text[], $8::text[], $9::text[], $10::text[], $11::text[], $12::text[], $13::text[], $14::numeric[], $15::text[], $16::date[]
      )
      `,
      events: `
      INSERT INTO phil_ct_events (
      equipment_id,
      eventtime,
      blob,
      type,
      tstampnum,
      eal,
      level,
      ermodulernum,
      dtime,
      msg,
      host_dateTime
    )
    SELECT * FROM UNNEST (
      $1::text[], $2::text[], $3::text[], $4::text[], $5::text[], $6::text[], $7::text[], $8::text[], $9::text[], $10::text[], $11::date[]
    )
      `,
    },
  },
};
