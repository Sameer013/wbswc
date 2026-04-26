SELECT
  `tve`.`dt` AS `dt`,
  `tve`.`vno` AS `vno`,
  GROUP_CONCAT(
    `tve`.`created_at`
    ORDER BY
      `tve`.`created_at` ASC SEPARATOR ','
  ) AS `evt`,
  GROUP_CONCAT(
    `tve`.`movement`
    ORDER BY
      `tve`.`created_at` ASC SEPARATOR ','
  ) AS `et`,
  GROUP_CONCAT(
    `tve`.`imageId`
    ORDER BY
      `tve`.`created_at` ASC SEPARATOR ','
  ) AS `imgs`
FROM
  (
    SELECT
      cast(`ve`.`created_at` AS date) AS `dt`,
      `ve`.`updated_vehicleNo` AS `vno`,
      `ve`.`created_at` AS `created_at`,
      `ve`.`movement` AS `movement`,
      `ve`.`imageId` AS `imageId`
    FROM
      `wbswc`.`vehicle_event` `ve`
    WHERE
      (
        (`ve`.`updated_vehicleNo` IS NOT NULL)
        AND (`ve`.`flag` = 1)
        AND (
          cast(`ve`.`created_at` AS date) >= cast(
            (
              SELECT
                `wbswc`.`curation_state`.`last_run_l1`
              FROM
                `wbswc`.`curation_state`
            ) AS date
          )
        )
      )
  ) `tve`
GROUP BY
  `tve`.`dt`,
  `tve`.`vno`