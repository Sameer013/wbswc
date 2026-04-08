SELECT
  `wbswc3`.`vehicle_cycle`.`vehicleNo` AS `vehicleNo`,
  max(`wbswc3`.`vehicle_cycle`.`entry_time`) AS `entry_time`,
  max(`wbswc3`.`vehicle_cycle`.`exit_time`) AS `exit_time`,
  min(`wbswc3`.`vehicle_cycle`.`weight_time`) AS `tear_wt_time`,
  max(`wbswc3`.`vehicle_cycle`.`weight_time`) AS `gross_wt_time`,
  min(`wbswc3`.`vehicle_cycle`.`weight`) AS `tear_wt`,
  max(`wbswc3`.`vehicle_cycle`.`weight`) AS `gross_wt`,
(
    max(`wbswc3`.`vehicle_cycle`.`weight`) - min(`wbswc3`.`vehicle_cycle`.`weight`)
  ) AS `net_wt`,
  cast(
    max(`wbswc3`.`vehicle_cycle`.`weight_time`) AS date
  ) AS `event_date`
FROM
  `wbswc3`.`vehicle_cycle`
GROUP BY
  `wbswc3`.`vehicle_cycle`.`vehicleNo`