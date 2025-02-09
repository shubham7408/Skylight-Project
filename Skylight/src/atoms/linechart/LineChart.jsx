import { useEffect, useState, useMemo } from "react";
import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";

const LineChart1 = () => {
  const [chartData, setChartData] = useState([]);
  const [selectedTimeOption, setSelectedTimeOption] = useState("1 Hour");
  const [granularity, setGranularity] = useState(1000);

  // const { allData, getAllData, dateTimeRange, getSpecificSessionBurst } = useDateTimeRange();

  const timeGranularityMapping = {
    "1 Day": 15 * 60 * 1000,
    "6 Hours": 1 * 60 * 1000,
    "1 Hour": 1 * 1000,
    "15 Minutes": 1 * 1000,
    "1 Minute": 1 * 1000,
    "1 Second": 1 * 1000,
    "30 Days": 30 * 60 * 1000,
    "7 Days": 6 * 60 * 1000,
    "8 Hours": 1 * 60 * 1000,
    "180 Days": 1 * 60 * 1000,
  };

  useEffect(() => {
    const storedTimeOption = localStorage.getItem("selectedTimeOption");
    if (storedTimeOption) {
      setSelectedTimeOption(storedTimeOption);
      setGranularity(timeGranularityMapping[storedTimeOption] || 1000);
    }

    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/burst");
        const data = await response.json();

        const processedData = [];
        data.forEach((session) => {
          if (session.METRICS && Array.isArray(session.METRICS)) {
            session.METRICS.forEach((metric) => {
              processedData.push({
                time: metric.interval_start,
                delay_max: metric.delay_max,
                total_lost_burst_max: metric.total_lost_burst_max,
              });
            });
          }
        });

        const totalLostBurstSum = processedData.reduce(
          (sum, item) => sum + item.total_lost_burst_max,
          0
        );
        const averageLostBurst = processedData.length > 0 ? totalLostBurstSum / processedData.length : 0;

        const finalData = processedData.map((item) => ({
          ...item,
          avgLostBurst: averageLostBurst,
        }));

        setChartData(finalData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Update granularity when selected time option changes
    setGranularity(timeGranularityMapping[selectedTimeOption] || 1000);
    // Update local storage
    localStorage.setItem("selectedTimeOption", selectedTimeOption);
  }, [selectedTimeOption]);

  const processedData = useMemo(() => {
    let totalLostBurstSum = 0;
    let totalCount = 0;

    const flatData = chartData.map((d) => {
      totalLostBurstSum += d.total_lost_burst_max;
      totalCount++;
      return { ...d };
    });

    const avgLostBurst = totalCount > 0 ? totalLostBurstSum / totalCount : 0;

    return flatData.map((d) => ({ ...d, avgLostBurst }));
  }, [chartData]);

  return (
    <LineChart
      width={950}
      height={140}
      data={processedData}
      style={{ marginLeft: "-25px", paddingTop: "15px", marginBottom: "5px" }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis
        dataKey="time"
        tickFormatter={(time) => {
          const date = new Date(time);
          if (granularity === 1 * 1000) {
            return date.toLocaleTimeString(); // Full seconds
          } else if (granularity === 15 * 60 * 1000) {
            return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); // 15 min format
          } else if (granularity >= 1 * 60 * 1000) {
            return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); // Minute granularity
          } else {
            return date.toLocaleDateString();
          }
        }}
      />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="delay_max" stroke="#8884d8" activeDot={{ r: 8 }} />
      <Line type="monotone" dataKey="total_lost_burst_max" stroke="#ff7300" />
      <Line type="monotone" dataKey="avgLostBurst" stroke="#82ca9d" />
    </LineChart>
  );
};

export default LineChart1;