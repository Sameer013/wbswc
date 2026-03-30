SELECT
  count(
    IF(
      (`warehousedb2`.`eventmaster`.`eventId` = 1),
      1,
      NULL
    )
  ) AS `entryCnt`,
  count(
    IF(
      (`warehousedb2`.`eventmaster`.`eventId` = 2),
      1,
      NULL
    )
  ) AS `exitCnt`,
  count(
    IF(
      (`warehousedb2`.`eventmaster`.`eventId` = 3),
      1,
      NULL
    )
  ) AS `loadCnt`,
  count(
    IF(
      (`warehousedb2`.`eventmaster`.`eventId` = 4),
      1,
      NULL
    )
  ) AS `unloadCnt`
FROM
  `warehousedb2`.`eventmaster`