SELECT
  count(
    IF((`wbswc5`.`eventmaster`.`eventId` = 1), 1, NULL)
  ) AS `entryCnt`,
  count(
    IF((`wbswc5`.`eventmaster`.`eventId` = 2), 1, NULL)
  ) AS `exitCnt`,
  count(
    IF((`wbswc5`.`eventmaster`.`eventId` = 3), 1, NULL)
  ) AS `loadCnt`,
  count(
    IF((`wbswc5`.`eventmaster`.`eventId` = 4), 1, NULL)
  ) AS `unloadCnt`
FROM
  `wbswc5`.`eventmaster`
WHERE
  (
    (
      to_days(NOW()) - to_days(`wbswc5`.`eventmaster`.`eventTimestamp`)
    ) <= 30
  )