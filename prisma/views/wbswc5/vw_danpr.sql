SELECT
  `vanpr`.`dt` AS `dt`,
  `vanpr`.`vno` AS `vno`,
  GROUP_CONCAT(
    `vanpr`.`created_at`
    ORDER BY
      `vanpr`.`created_at` ASC SEPARATOR ','
  ) AS `evt`,
  GROUP_CONCAT(
    `vanpr`.`vehiclewt`
    ORDER BY
      `vanpr`.`created_at` ASC SEPARATOR ','
  ) AS `wts`,
  GROUP_CONCAT(
    `vanpr`.`imageid`
    ORDER BY
      `vanpr`.`created_at` ASC SEPARATOR ','
  ) AS `imgs`
FROM
  (
    SELECT
      cast(`wbswc5`.`anprevent`.`created_at` AS date) AS `dt`,
      `wbswc5`.`anprevent`.`created_at` AS `created_at`,
      `wbswc5`.`anprevent`.`updated_vehicleNo` AS `vno`,
      `wbswc5`.`anprevent`.`updated_vehicleWt` AS `vehiclewt`,
      `wbswc5`.`anprevent`.`imageId` AS `imageid`
    FROM
      `wbswc5`.`anprevent`
    WHERE
      (
        (
          `wbswc5`.`anprevent`.`updated_vehicleNo` IS NOT NULL
        )
        AND (`wbswc5`.`anprevent`.`flag` = 1)
        AND (
          cast(`wbswc5`.`anprevent`.`created_at` AS date) >= cast(
            (
              SELECT
                `wbswc5`.`curation_state`.`last_run_l1`
              FROM
                `wbswc5`.`curation_state`
            ) AS date
          )
        )
      )
  ) `vanpr`
GROUP BY
  `vanpr`.`dt`,
  `vanpr`.`vno`