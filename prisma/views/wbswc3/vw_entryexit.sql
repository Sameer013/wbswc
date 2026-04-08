SELECT
  `tve`.`dt` AS `dt`,
  `tve`.`vno` AS `vno`,
  GROUP_CONCAT(`tve`.`created_at` SEPARATOR ',') AS `evt`,
  GROUP_CONCAT(`tve`.`movement` SEPARATOR ',') AS `et`,
  GROUP_CONCAT(`tve`.`imageId` SEPARATOR ',') AS `imgs`
FROM
  (
    SELECT
      cast(`ve`.`created_at` AS date) AS `dt`,
      `ve`.`updated_vehicleNo` AS `vno`,
      `ve`.`created_at` AS `created_at`,
      `ve`.`movement` AS `movement`,
      `ve`.`imageId` AS `imageId`
    FROM
      `wbswc3`.`vehicle_event` `ve`
    WHERE
      (`ve`.`updated_vehicleNo` IS NOT NULL)
    ORDER BY
      cast(`ve`.`created_at` AS date),
      `vno`,
      `ve`.`created_at`
  ) `tve`
GROUP BY
  `tve`.`dt`,
  `tve`.`vno`