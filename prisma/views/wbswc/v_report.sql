SELECT
  cast(`wr`.`gross_timestamp` AS date) AS `event_date`,
  `wr`.`vehicle_no` AS `vehicleNo`,
  max(
    (
      CASE
        WHEN (`em`.`eventId` = 1) THEN `em`.`eventTimestamp`
      END
    )
  ) AS `entry_time`,
  max(
    (
      CASE
        WHEN (`em`.`eventId` = 2) THEN `em`.`eventTimestamp`
      END
    )
  ) AS `exit_time`,
  `wr`.`tare` AS `tare_wt`,
  `wr`.`gross` AS `gross_wt`,
  `wr`.`net` AS `net_wt`,
  `wr`.`tare_timestamp` AS `tare_wt_time`,
  `wr`.`gross_timestamp` AS `gross_wt_time`
FROM
  (
    (
      `wbswc`.`weighbridge_records` `wr`
      LEFT JOIN `wbswc`.`anprevent` `a` ON((`a`.`vehicleNo` = `wr`.`vehicle_no`))
    )
    LEFT JOIN `wbswc`.`eventmaster` `em` ON((`em`.`id` = `a`.`eventMasterId`))
  )
GROUP BY
  `wr`.`id`
ORDER BY
  `event_date`