SELECT
  cast(
    `warehousedb`.`eventmaster`.`eventTimestamp` AS date
  ) AS `date`,
  sum(
    (
      CASE
        WHEN (`warehousedb`.`eventmaster`.`eventId` = 1) THEN 1
        ELSE 0
      END
    )
  ) AS `entryCnt`,
  sum(
    (
      CASE
        WHEN (`warehousedb`.`eventmaster`.`eventId` = 2) THEN 1
        ELSE 0
      END
    )
  ) AS `exitCnt`,
  sum(
    (
      CASE
        WHEN (`warehousedb`.`eventmaster`.`eventId` = 3) THEN 1
        ELSE 0
      END
    )
  ) AS `loadCnt`,
  sum(
    (
      CASE
        WHEN (`warehousedb`.`eventmaster`.`eventId` = 4) THEN 1
        ELSE 0
      END
    )
  ) AS `unloadCnt`
FROM
  `warehousedb`.`eventmaster`
GROUP BY
  cast(
    `warehousedb`.`eventmaster`.`eventTimestamp` AS date
  )