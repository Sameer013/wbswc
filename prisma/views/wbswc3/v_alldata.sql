SELECT
  count(
    IF((`wbswc3`.`eventmaster`.`eventId` = 1), 1, NULL)
  ) AS `entryCnt`,
  count(
    IF((`wbswc3`.`eventmaster`.`eventId` = 2), 1, NULL)
  ) AS `exitCnt`,
  count(
    IF((`wbswc3`.`eventmaster`.`eventId` = 3), 1, NULL)
  ) AS `loadCnt`,
  count(
    IF((`wbswc3`.`eventmaster`.`eventId` = 4), 1, NULL)
  ) AS `unloadCnt`
FROM
  `wbswc3`.`eventmaster`