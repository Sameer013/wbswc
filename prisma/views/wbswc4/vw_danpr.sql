SELECT
  `vanpr`.`dt` AS `dt`,
  `vanpr`.`vno` AS `vno`,
  GROUP_CONCAT(`vanpr`.`created_at` SEPARATOR ',') AS `evt`,
  GROUP_CONCAT(`vanpr`.`vehiclewt` SEPARATOR ',') AS `wts`,
  GROUP_CONCAT(`vanpr`.`imageid` SEPARATOR ',') AS `imgs`
FROM
  (
    SELECT
      cast(`wbswc4`.`anprevent`.`created_at` AS date) AS `dt`,
      `wbswc4`.`anprevent`.`created_at` AS `created_at`,
      `wbswc4`.`anprevent`.`updated_vehicleNo` AS `vno`,
      `wbswc4`.`anprevent`.`vehicleWt` AS `vehiclewt`,
      `wbswc4`.`anprevent`.`imageId` AS `imageid`
    FROM
      `wbswc4`.`anprevent`
    WHERE
      (
        (
          `wbswc4`.`anprevent`.`updated_vehicleNo` IS NOT NULL
        )
        AND (
          cast(`wbswc4`.`anprevent`.`created_at` AS date) >= cast(
            (
              SELECT
                `wbswc4`.`curation_state`.`last_run_l1`
              FROM
                `wbswc4`.`curation_state`
            ) AS date
          )
        )
      )
    ORDER BY
      cast(`wbswc4`.`anprevent`.`created_at` AS date),
      `wbswc4`.`anprevent`.`updated_vehicleNo`,
      `wbswc4`.`anprevent`.`created_at`
  ) `vanpr`
GROUP BY
  `vanpr`.`dt`,
  `vanpr`.`vno`