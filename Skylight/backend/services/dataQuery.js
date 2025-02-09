require("dotenv").config();
const connection = require("../config/connection");

const runQuery = async (sql, values) => {
  return new Promise((resolve, reject) => {
    connection.execute({
      sqlText: sql,
      binds: values,
      complete: function (err, stmt, rows) {
        if (err) {
          console.error(
            "Failed to execute statement due to the following error: " +
              err.message
          );
          reject(new Error(err.message));
        } else {
          resolve(rows);
        }
      },
    });
  });
};

const fetchAllSessionData = async (filter) => {
  const query = `WITH PacketData AS (
        SELECT
            SESSION_NAME,
            SUM(ul_lostpkts + dl_lostpkts) AS total_lostpkts,
            SUM(ul_rxpkts + dl_rxpkts) AS total_rxpkts,
            (SUM(ul_dvp95 + dl_dvp95) / 2) AS avg_delay_variation
        FROM 
            skylight_main
        WHERE
            EPOCH_TIME BETWEEN '${filter.sdate}' AND '${filter.edate}'
        GROUP BY
            SESSION_NAME
    )
    SELECT
        SESSION_NAME,
        COALESCE((total_lostpkts / NULLIF(total_rxpkts, 0)) * 100, 0) AS packet_loss,
        avg_delay_variation AS delay_variation
    FROM
        PacketData;`;

  try {
    // Pass the filter values as bind variables
    const data = await runQuery(query);
    return data;
  } catch (error) {
    console.error("Error fetching data: ", error);
    throw error;
  }
};

const fetchAllSessionName = async () => {
  try {
    // Query to fetch distinct languages present in the table
    const queryLanguages = `SELECT DISTINCT SESSION_NAME FROM SKYLIGHT_MAIN;`;

    let result = await runQuery(queryLanguages);

    return result;
  } catch (error) {
    console.error("Error executing SQL:", error);
    throw error; // Throw the error to propagate it further if needed
  }
};

const fetchProviderData = async (filter) => {
  try {
    // Query to fetch distinct languages present in the table
    const queryLanguages = `WITH AllData AS (
			SELECT
				PROVIDER,
				SUM(ul_lostpkts + dl_lostpkts) AS total_lostpkts,
				SUM(ul_rxpkts + dl_rxpkts) AS total_rxpkts,
				AVG(ul_dvp95 + dl_dvp95) AS avg_delay_variation
			FROM 
				skylight_main
			WHERE
				EPOCH_TIME BETWEEN '${filter.sdate}' AND '${filter.edate}'
			GROUP BY
				PROVIDER
		)
		SELECT
			PROVIDER,
			COALESCE((total_lostpkts / NULLIF(total_rxpkts, 0)) * 100, 0) AS packet_loss,
			avg_delay_variation AS delay_variation
		FROM
			AllData;`;

    let result = await runQuery(queryLanguages);

    return result;
  } catch (error) {
    console.error("Error executing SQL:", error);
    throw error; // Throw the error to propagate it further if needed
  }
};

const fetchAllData = async (filter) => {
  const query = `WITH AllData AS (
			SELECT
				session_name,
				city,
				source_city,
				latitude,
				longitude,
				source_latitude,
				source_longitude,
				destination_ip,
				source_ip,
				SUM(ul_lostpkts + dl_lostpkts) AS total_lostpkts,
				SUM(ul_rxpkts + dl_rxpkts) AS total_rxpkts,
				(SUM(ul_dvp95 + dl_dvp95) / 2) AS avg_delay_variation,
				SUM(dl_dmax + ul_dmax) AS total_max        
			FROM 
				skylight_main
			WHERE
				EPOCH_TIME BETWEEN '${filter.sdate}' AND '${filter.edate}'
			GROUP BY
				session_name, city, source_city, destination_ip, source_ip, latitude, longitude, source_latitude, source_longitude
		),
		MaxData AS (
			SELECT
				MAX(total_max) AS max_total_max
			FROM
				AllData
		)
		SELECT
			a.session_name,
			a.city,
			a.source_city,
			a.latitude,
			a.longitude,
			a.source_latitude,
			a.source_longitude,
			a.destination_ip,
			a.source_ip,
			total_lostpkts,
			total_rxpkts,
			COALESCE((a.total_lostpkts / NULLIF(a.total_rxpkts, 0)) * 100, 0) AS packet_loss,
			COALESCE((a.total_max / NULLIF(m.max_total_max, 0)) * 100, 0) AS avg_delay,
			a.avg_delay_variation AS delay_variation
		FROM
			AllData a
			CROSS JOIN MaxData m;`;

  try {
    // Pass the filter values as bind variables
    const data = await runQuery(query);
    return data;
  } catch (error) {
    console.error("Error fetching data: ", error);
    throw error;
  }
};

const fetchAllDataBurstMax = async (filter, session_name) => {
  let query = `
	  WITH IntervalData AS (
		SELECT
		  session_name,
		  destination_ip,
		  source_ip,
		  city,
		  source_city,
		  latitude,
		  longitude,
		  source_latitude,
		  source_longitude,
		  TIMESTAMPADD(HOUR, FLOOR(EXTRACT(EPOCH FROM EPOCH_TIME) / (6 * 3600)) * 6, '1970-01-01') AS interval_start,
		  SUM(ul_dmax + dl_dmax) AS total_dmax,
		  SUM(ul_lostburstmax + dl_lostburstmax) AS total_lost_burst_max,
		  SUM(ul_dvp95 + dl_dvp95) AS total_dvp95,
		  COUNT(*) AS count
		FROM
		  skylight_main
		WHERE `;

  if (session_name !== undefined && session_name !== null) {
    query += `session_name = '${session_name}' AND `;
  }

  query += `
		  EPOCH_TIME BETWEEN '${filter.sdate}' AND '${filter.edate}'
		GROUP BY
		  session_name,
		  destination_ip,
		  source_ip,
		  city,
		  source_city,
		  latitude,
		  longitude,
		  source_latitude,
		  source_longitude,
		  TIMESTAMPADD(HOUR, FLOOR(EXTRACT(EPOCH FROM EPOCH_TIME) / (6 * 3600)) * 6, '1970-01-01')
	  )
	  SELECT
		session_name,
		destination_ip,
		source_ip,
		city,
		source_city,
		latitude,
		longitude,
		source_latitude,
		source_longitude,
		ARRAY_AGG(
		  OBJECT_CONSTRUCT(
			'interval_start', interval_start,
			'delay_max', COALESCE(total_dmax / NULLIF(count, 0), 0),
			'delay_variation', COALESCE(total_dvp95 / NULLIF(count, 0), 0),
			'total_lost_burst_max', COALESCE(total_lost_burst_max / NULLIF(count, 0), 0)
		  )
		) AS metrics
	  FROM
		IntervalData
	  GROUP BY
		session_name,
		destination_ip,
		source_ip,
		city,
		source_city,
		latitude,
		longitude,
		source_latitude,
		source_longitude
	  ORDER BY
		session_name,
		destination_ip,
		source_ip,
		city,
		source_city,
		latitude,
		longitude,
		source_latitude,
		source_longitude;
	`;

  try {
    // Pass the filter values as bind variables
    const data = await runQuery(query);
    return data;
  } catch (error) {
    console.error("Error fetching data: ", error);
    throw error;
  }
};

const fetchFrequentFailed = async (filter) => {
  const query = `
		WITH DailyPacketLoss AS (
		  SELECT
			session_name,
			provider,
			DATE(EPOCH_TIME) AS date,
			COALESCE((SUM(ul_lostpkts + dl_lostpkts) / NULLIF(SUM(ul_rxpkts + dl_rxpkts), 0)) * 100, 0) AS packet_loss
		  FROM
			skylight_main
		  WHERE
			EPOCH_TIME BETWEEN '${filter.sdate}' AND '${filter.edate}'
		  GROUP BY
			session_name, provider, DATE(EPOCH_TIME)
		),
		ConsecutiveDays AS (
		  SELECT
			session_name,
			provider,
			COUNT(*) AS consecutive_days
		  FROM (
			SELECT
			  session_name,
			  provider,
			  date,
			  packet_loss,
			  ROW_NUMBER() OVER (PARTITION BY session_name, provider ORDER BY date) AS rn,
			  ROW_NUMBER() OVER (PARTITION BY session_name, provider, (packet_loss > 1) ORDER BY date) AS grp
			FROM
			  DailyPacketLoss
			WHERE
			  packet_loss > 1
		  ) sub
		  GROUP BY
			session_name, provider, (rn - grp)
		  HAVING
			COUNT(*) >= 3
		)
		SELECT
		  DISTINCT session_name,
		  provider
		FROM
		  skylight_main;
	  `;

  try {
    const data = await runQuery(query);
    return data;
  } catch (error) {
    console.error("Error fetching frequent failures: ", error);
    throw error;
  }
};

module.exports = {
  fetchAllSessionName,
  fetchAllSessionData,
  fetchAllData,
  fetchAllDataBurstMax,
  fetchProviderData,
  fetchFrequentFailed,
};
