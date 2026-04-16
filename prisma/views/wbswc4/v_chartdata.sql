SELECT
  cast(`wbswc4`.`eventmaster`.`eventTimestamp` AS date) AS `date`,
  sum(
    (
      CASE
        WHEN (`wbswc4`.`eventmaster`.`eventId` = 1) THEN 1
        ELSE 0
      END
    )
  ) AS `entryCnt`,
  sum(
    (
      CASE
        WHEN (`wbswc4`.`eventmaster`.`eventId` = 2) THEN 1
        ELSE 0
      END
    )
  ) AS `exitCnt`,
  sum(
    (
      CASE
        WHEN (`wbswc4`.`eventmaster`.`eventId` = 3) THEN 1
        ELSE 0
      END
    )
  ) AS `loadCnt`,
  sum(
    (
      CASE
        WHEN (`wbswc4`.`eventmaster`.`eventId` = 4) THEN 1
        ELSE 0
      END
    )
  ) AS `unloadCnt`
FROM
  `wbswc4`.`eventmaster`
GROUP BY
  cast(`wbswc4`.`eventmaster`.`eventTimestamp` AS date)