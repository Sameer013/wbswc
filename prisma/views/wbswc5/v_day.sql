SELECT
  count(IF((`ve`.`movement` = 1), 1, NULL)) AS `entryCnt`,
  count(IF((`ve`.`movement` = 2), 1, NULL)) AS `exitCnt`,
  count(IF((`em`.`eventId` = 3), 1, NULL)) AS `loadCnt`,
  count(IF((`em`.`eventId` = 4), 1, NULL)) AS `unloadCnt`
FROM
  (
    `wbswc5`.`eventmaster` `em`
    LEFT JOIN `wbswc5`.`vehicle_event` `ve` ON(
      (
        (`em`.`id` = `ve`.`eventMasterId`)
        AND (`ve`.`updated_vehicleNo` IS NOT NULL)
        AND (`ve`.`flag` = 1)
      )
    )
  )
WHERE
  (cast(`em`.`eventTimestamp` AS date) = curdate())