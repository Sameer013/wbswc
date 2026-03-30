SELECT
  cast(
    `warehousedb2`.`eventmaster`.`eventTimestamp` AS date
  ) AS `date`,
  sum(
    (
      CASE
        WHEN (`warehousedb2`.`eventmaster`.`eventId` = 1) THEN 1
        ELSE 0
      END
    )
  ) AS `entryCnt`,
  sum(
    (
      CASE
        WHEN (`warehousedb2`.`eventmaster`.`eventId` = 2) THEN 1
        ELSE 0
      END
    )
  ) AS `exitCnt`,
  sum(
    (
      CASE
        WHEN (`warehousedb2`.`eventmaster`.`eventId` = 3) THEN 1
        ELSE 0
      END
    )
  ) AS `loadCnt`,
  sum(
    (
      CASE
        WHEN (`warehousedb2`.`eventmaster`.`eventId` = 4) THEN 1
        ELSE 0
      END
    )
  ) AS `unloadCnt`
FROM
  `warehousedb2`.`eventmaster`
GROUP BY
  cast(
    `warehousedb2`.`eventmaster`.`eventTimestamp` AS date
  )