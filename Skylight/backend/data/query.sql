-- fetchAllSessionData
WITH PacketData AS (
        SELECT
            SESSION_NAME,
            SUM(ul_lostpkts + dl_lostpkts) AS total_lostpkts,
            SUM(ul_rxpkts + dl_rxpkts) AS total_rxpkts,
            (SUM(ul_dvp95 + dl_dvp95) / 2) AS avg_delay_variation
        FROM 
            skylight_main
        WHERE
            EPOCH_TIME BETWEEN ? AND ?
        GROUP BY
            SESSION_NAME
    )
    SELECT
        SESSION_NAME,
        COALESCE((total_lostpkts / NULLIF(total_rxpkts, 0)) * 100, 0) AS packet_loss,
        avg_delay_variation AS delay_variation
    FROM
        PacketData;


-- fetchAllSessionName
SELECT DISTINCT SESSION_NAME FROM SKYLIGHT_MAIN;


-- Fetch all data
WITH AllData AS (
    SELECT
        SESSION_NAME,
        CITY,
        destination_ip AS public_ip,
        SUM(ul_lostpkts + dl_lostpkts) AS total_lostpkts,
        SUM(ul_rxpkts + dl_rxpkts) AS total_rxpkts,
        AVG(dl_dvp95) AS avg_delay_variation,
        SUM(dl_dmax + ul_dmax) AS total_max        
    FROM 
        skylight_main
    WHERE
        EPOCH_TIME BETWEEN ? AND ?
    GROUP BY
        SESSION_NAME, CITY, destination_ip
),
MaxData AS (
    SELECT
        MAX(total_max) AS max_total_max
    FROM
        AllData
)
SELECT
    a.SESSION_NAME,
    a.CITY,
    a.public_ip,
    COALESCE((a.total_lostpkts / NULLIF(a.total_rxpkts, 0)) * 100, 0) AS packet_loss,
    COALESCE((a.total_max / NULLIF(m.max_total_max, 0)) * 100, 0) AS avg_delay,
    a.avg_delay_variation AS delay_variation
FROM
    AllData a
    CROSS JOIN MaxData m;


-- Burst Max
WITH IntervalData AS (
    SELECT
        session_name, 
        destination_ip, 
        city, 
        latitude, 
        longitude,
        DATE_TRUNC(:duration, EPOCH_TIME) AS interval_start,
        SUM(ul_dmax + dl_dmax) AS total_dmax,
        SUM(ul_dvp95 + dl_dvp95) AS total_dvp95,
        COUNT(*) AS count
    FROM 
        skylight_main 
    WHERE 
        session_name = :session_name AND 
        EPOCH_TIME BETWEEN :sdate AND :edate
    GROUP BY
        session_name, 
        destination_ip, 
        city, 
        latitude, 
        longitude,
        DATE_TRUNC(:duration, EPOCH_TIME)
)
SELECT
    session_name, 
    destination_ip, 
    city, 
    latitude, 
    longitude,
    ARRAY_AGG(
        OBJECT_CONSTRUCT(
            'interval_start', interval_start,
            'delay_max', COALESCE(total_dmax / NULLIF(count, 0), 0),
            'delay_variation', COALESCE(total_dvp95 / NULLIF(count, 0), 0)
        )
    ) AS metrics
FROM
    IntervalData
GROUP BY
    session_name, 
    destination_ip, 
    city, 
    latitude, 
    longitude
ORDER BY
    session_name, 
    destination_ip, 
    city, 
    latitude, 
    longitude;


-- Provider
WITH AllData AS (
    SELECT
        PROVIDER,
        SUM(ul_lostpkts + dl_lostpkts) AS total_lostpkts,
        SUM(ul_rxpkts + dl_rxpkts) AS total_rxpkts,
        AVG(ul_dvp95 + dl_dvp95) AS avg_delay_variation  -- Use AVG instead of SUM / 2 for average calculation
    FROM 
        skylight_main
    WHERE
        EPOCH_TIME BETWEEN '2023-01-01T00:00:00Z' AND '2024-03-31T23:59:59Z'
    GROUP BY
        PROVIDER
)
SELECT
    PROVIDER,
    COALESCE((total_lostpkts / NULLIF(total_rxpkts, 0)) * 100, 0) AS packet_loss,
    avg_delay_variation AS delay_variation
FROM
    AllData;