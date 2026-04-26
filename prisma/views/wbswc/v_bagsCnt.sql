SELECT
  cast(`wbswc`.`eventmaster`.`eventTimestamp` AS date) AS `dt`,
  count(IF((`wbswc`.`eventmaster`.`eventId` = 1), 1, NULL)) AS `entryCnt`,
  count(IF((`wbswc`.`eventmaster`.`eventId` = 2), 1, NULL)) AS `exitCnt`,
  count(IF((`wbswc`.`eventmaster`.`eventId` = 3), 1, NULL)) AS `loadCnt`,
  count(IF((`wbswc`.`eventmaster`.`eventId` = 4), 1, NULL)) AS `unloadCnt`
FROM
  `wbswc`.`eventmaster`
GROUP BY
  `dt`
ORDER BY
  `dt`