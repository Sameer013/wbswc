SELECT
  max(cast(`wr`.`system_timestamp` AS date)) AS `event_date`,
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
  max(`wr`.`tare_timestamp`) AS `tare_wt_time`,
  max(`wr`.`gross_timestamp`) AS `gross_wt_time`
FROM
  (
    (
      `wbswc`.`weighbridge_records` `wr`
      JOIN `wbswc`.`anprevent` `a` ON((`a`.`vehicleNo` = `wr`.`vehicle_no`))
    )
    JOIN `wbswc`.`eventmaster` `em` ON((`em`.`id` = `a`.`eventMasterId`))
  )
GROUP BY
  `wr`.`vehicle_no`,
  `wr`.`tare`,
  `wr`.`gross`,
  `wr`.`net`
ORDER BY
  `event_date`