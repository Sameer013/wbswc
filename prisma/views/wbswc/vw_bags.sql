WITH `ordered_events` AS (
  SELECT
    `wbswc`.`eventmaster`.`eventId` AS `eventId`,
    `wbswc`.`eventmaster`.`eventTimestamp` AS `eventTimestamp`,
    lag(`wbswc`.`eventmaster`.`eventTimestamp`) OVER (
      ORDER BY
        `wbswc`.`eventmaster`.`eventTimestamp`
    ) AS `prev_ts`
  FROM
    `wbswc`.`eventmaster`
  WHERE
    (`wbswc`.`eventmaster`.`eventId` IN (3, 4))
  ORDER BY
    `wbswc`.`eventmaster`.`eventTimestamp`
),
`gap_flag` AS (
  SELECT
    `ordered_events`.`eventId` AS `eventId`,
    `ordered_events`.`eventTimestamp` AS `eventTimestamp`,
    `ordered_events`.`prev_ts` AS `prev_ts`,
(
      CASE
        WHEN (`ordered_events`.`prev_ts` IS NULL) THEN 1
        WHEN (
          timestampdiff(
            SECOND,
            `ordered_events`.`prev_ts`,
            `ordered_events`.`eventTimestamp`
          ) > 500
        ) THEN 1
        ELSE 0
      END
    ) AS `is_new_session`
  FROM
    `ordered_events`
),
`sessionized` AS (
  SELECT
    `gap_flag`.`eventId` AS `eventId`,
    `gap_flag`.`eventTimestamp` AS `eventTimestamp`,
    `gap_flag`.`prev_ts` AS `prev_ts`,
    `gap_flag`.`is_new_session` AS `is_new_session`,
    sum(`gap_flag`.`is_new_session`) OVER (
      ORDER BY
        `gap_flag`.`eventTimestamp`
    ) AS `session_id`
  FROM
    `gap_flag`
)
SELECT
  `sessionized`.`session_id` AS `session`,
(
    CASE
      WHEN (`sessionized`.`eventId` = 3) THEN 'Loading'
      WHEN (`sessionized`.`eventId` = 4) THEN 'Unloading'
    END
  ) AS `type_of_event`,
  min(`sessionized`.`eventTimestamp`) AS `start_time`,
  max(`sessionized`.`eventTimestamp`) AS `end_time`,
  count(0) AS `cnt`
FROM
  `sessionized`
GROUP BY
  `sessionized`.`session_id`,
  `sessionized`.`eventId`
ORDER BY
  `sessionized`.`session_id`,
  `type_of_event`