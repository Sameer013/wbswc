SELECT
  count(
    IF((`wbswc4`.`eventmaster`.`eventId` = 1), 1, NULL)
  ) AS `entryCnt`,
  count(
    IF((`wbswc4`.`eventmaster`.`eventId` = 2), 1, NULL)
  ) AS `exitCnt`,
  count(
    IF((`wbswc4`.`eventmaster`.`eventId` = 3), 1, NULL)
  ) AS `loadCnt`,
  count(
    IF((`wbswc4`.`eventmaster`.`eventId` = 4), 1, NULL)
  ) AS `unloadCnt`
FROM
  `wbswc4`.`eventmaster`
WHERE
  (
    cast(`wbswc4`.`eventmaster`.`eventTimestamp` AS date) = curdate()
  )