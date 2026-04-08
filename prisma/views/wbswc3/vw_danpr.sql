SELECT
  `vanpr`.`dt` AS `dt`,
  `vanpr`.`vno` AS `vno`,
  GROUP_CONCAT(`vanpr`.`created_at` SEPARATOR ',') AS `evt`,
  GROUP_CONCAT(`vanpr`.`vehiclewt` SEPARATOR ',') AS `wts`,
  GROUP_CONCAT(`vanpr`.`imageid` SEPARATOR ',') AS `imgs`
FROM
  (
    SELECT
      cast(`wbswc3`.`anprevent`.`created_at` AS date) AS `dt`,
      `wbswc3`.`anprevent`.`created_at` AS `created_at`,
      `wbswc3`.`anprevent`.`updated_vehicleNo` AS `vno`,
      `wbswc3`.`anprevent`.`vehicleWt` AS `vehiclewt`,
      `wbswc3`.`anprevent`.`imageId` AS `imageid`
    FROM
      `wbswc3`.`anprevent`
    WHERE
      (
        `wbswc3`.`anprevent`.`updated_vehicleNo` IS NOT NULL
      )
    ORDER BY
      cast(`wbswc3`.`anprevent`.`created_at` AS date),
      `wbswc3`.`anprevent`.`updated_vehicleNo`,
      `wbswc3`.`anprevent`.`created_at`
  ) `vanpr`
GROUP BY
  `vanpr`.`dt`,
  `vanpr`.`vno`