WITH `ordered_data` AS (
  SELECT
    `wbswc`.`eventmaster`.`eventId` AS `eventId`,
    `wbswc`.`eventmaster`.`eventTimestamp` AS `eventTimestamp`,
    lag(`wbswc`.`eventmaster`.`eventTimestamp`) OVER (
      PARTITION BY `wbswc`.`eventmaster`.`eventId`
      ORDER BY
        `wbswc`.`eventmaster`.`eventTimestamp`
    ) AS `prev_time`
  FROM
    `wbswc`.`eventmaster`
  WHERE
    (`wbswc`.`eventmaster`.`eventId` = 3)
),
`flagged` AS (
  SELECT
    `ordered_data`.`eventId` AS `eventId`,
    `ordered_data`.`eventTimestamp` AS `eventTimestamp`,
    `ordered_data`.`prev_time` AS `prev_time`,
(
      CASE
        WHEN (`ordered_data`.`prev_time` IS NULL) THEN 1
        WHEN (
          timestampdiff(
            MINUTE,
            `ordered_data`.`prev_time`,
            `ordered_data`.`eventTimestamp`
          ) > 12
        ) THEN 1
        ELSE 0
      END
    ) AS `new_session_flag`
  FROM
    `ordered_data`
),
`sessionized` AS (
  SELECT
    `flagged`.`eventId` AS `eventId`,
    `flagged`.`eventTimestamp` AS `eventTimestamp`,
    sum(`flagged`.`new_session_flag`) OVER (
      PARTITION BY `flagged`.`eventId`
      ORDER BY
        `flagged`.`eventTimestamp`
    ) AS `session_id`
  FROM
    `flagged`
)
SELECT
  `sessionized`.`eventId` AS `eventId`,
  `sessionized`.`session_id` AS `session_id`,
  min(`sessionized`.`eventTimestamp`) AS `session_start`,
  max(`sessionized`.`eventTimestamp`) AS `session_end`,
  count(0) AS `total_events`
FROM
  `sessionized`
GROUP BY
  `sessionized`.`eventId`,
  `sessionized`.`session_id`
ORDER BY
  `sessionized`.`session_id`