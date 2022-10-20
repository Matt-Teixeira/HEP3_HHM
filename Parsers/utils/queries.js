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
  };