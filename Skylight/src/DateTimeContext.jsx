import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import axios from "axios";

const DateTimeContext = createContext();

export const DateTimeProvider = ({ children }) => {
  const [dateTimeRange, setDateTimeRange] = useState({
    duration: "SECOND",
    sdate: "2023-06-01T00:00:00Z",
    edate: "2023-06-02T23:59:59Z",
  });
  const [interactions, setInteractions] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [sessionNames, setSessionNames] = useState([]);
  const [allData, setAllData] = useState([]);
  const [burstData, setBurstData] = useState([]);
  const [providerData, setProviderData] = useState([]);
  const [consecutiveData, setConsecutiveData] = useState([]);

  useEffect(() => {
    console.log("dateTimeRange updated:", dateTimeRange);
  }, [dateTimeRange]);

  const getInteractions = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/interaction");
      setInteractions(response.data);
    } catch (error) {
      console.error("Error getting interactions:", error);
    }
  }, []);

  const setInteraction = useCallback(
    async (duration, currentDateTimeRange) => {
      try {
        console.log("Sending POST request to set interaction");
        const response = await axios.post(
          "http://localhost:3000/api/interaction",
          {
            duration,
            sdate: currentDateTimeRange.sdate,
            edate: currentDateTimeRange.edate,
          }
        );
        console.log("Response received:", response.data);
        setInteractions(response.data);

        // Fetch the latest interactions after setting a new one
        await getInteractions();
      } catch (error) {
        console.error("Error setting interaction:", error);
        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
        } else if (error.request) {
          console.error("No response received:", error.request);
        } else {
          console.error("Error message:", error.message);
        }
      }
    },
    [getInteractions]
  );

  const listSessions = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/listsession");
      setSessions(response.data);
    } catch (error) {
      console.error("Error listing sessions:", error);
    }
  }, []);

  const listSessionNames = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/sessionName");
      setSessionNames(response.data);
    } catch (error) {
      console.error("Error listing session names:", error);
    }
  }, []);

  const getAllData = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/all");
      setAllData(response.data);
    } catch (error) {
      console.error("Error getting all data:", error);
    }
  }, []);

  const getAllSessionBurst = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/burst");
      setBurstData(response.data);
    } catch (error) {
      console.error("Error getting all session burst data:", error);
    }
  }, []);

  const getSpecificSessionBurst = useCallback(async (sessionName) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/burst/${sessionName}`
      );
      return response.data;
    } catch (error) {
      console.error("Error getting specific session burst data:", error);
      return null;
    }
  }, []);

  const getProviderData = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/provider");
      setProviderData(response.data);
    } catch (error) {
      console.error("Error getting provider data:", error);
    }
  }, []);

  const getFrequentFailed = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/consecutive");
      setConsecutiveData(response.data);
    } catch (error) {
      console.error("Error getting all data:", error);
    }
  }, []);

  useEffect(() => {
    getProviderData();
  }, [getProviderData, dateTimeRange]);

  const contextValue = useMemo(
    () => ({
      dateTimeRange,
      setDateTimeRange,
      interactions,
      setInteraction,
      getInteractions,
      sessions,
      listSessions,
      sessionNames,
      listSessionNames,
      allData,
      getAllData,
      burstData,
      getAllSessionBurst,
      getSpecificSessionBurst,
      providerData,
      getProviderData,
      consecutiveData,
      getFrequentFailed
    }),
    [
      dateTimeRange,
      interactions,
      sessions,
      sessionNames,
      allData,
      burstData,
      providerData,
      setInteraction,
      getInteractions,
      listSessions,
      listSessionNames,
      getAllData,
      getAllSessionBurst,
      getSpecificSessionBurst,
      getProviderData,
      consecutiveData,
      getFrequentFailed
    ]
  );

  return (
    <DateTimeContext.Provider value={contextValue}>
      {children}
    </DateTimeContext.Provider>
  );
};

export const useDateTimeRange = () => {
  const context = useContext(DateTimeContext);
  if (!context) {
    throw new Error("useDateTimeRange must be used within a DateTimeProvider");
  }
  return context;
};

export default DateTimeContext;
