# API Endpoints

## Set Interactions
### POST: http://localhost:3000/api/interaction

```json
{
  "duration": "SECOND",
  "sdate": "2023-01-01T00:00:00Z",
  "edate": "2024-03-31T23:59:59Z"
}
```

## Get Interactions
### GET: http://localhost:3000/api/interaction

## List Sessions
### GET: http://localhost:3000/api/listsession

Output
```json
[
  {
    "SESSION_NAME": "LG2406_R_Z_T_0",
    "PACKET_LOSS": 0,
    "DELAY_VARIATION": 0
  },
  {
    "SESSION_NAME": "LG2889_R_Z_T_0",
    "PACKET_LOSS": 0.0001,
    "DELAY_VARIATION": 404347
  },
  ...
]
```

## List Session Names
### GET: http://localhost:3000/api/sessionName

Output
```json
[
  {
    "SESSION_NAME": "LG2406_R_Z_T_0"
  },
  {
    "SESSION_NAME": "LG2889_R_Z_T_0"
  },
  {
    "SESSION_NAME": "LG2981_R_Z_T_0"
  },
  ...
]
```

## Return All Data
### GET: http://localhost:3000/api/all

Output
```json
[
  {
    "SESSION_NAME": "LG0042_R_Z_T_0",
    "CITY": "Delhi",
    "PUBLIC_IP": "103.48.198.141",
    "PACKET_LOSS": 0.0903,
    "AVG_DELAY": 0.0482,
    "DELAY_VARIATION": 212825
  },
  {
    "SESSION_NAME": "LG0097_R_Z_T_0",
    "CITY": "Ahmedabad",
    "PUBLIC_IP": "182.237.8.5",
    "PACKET_LOSS": 0.0128,
    "AVG_DELAY": 0.0595,
    "DELAY_VARIATION": 301751
  },
  ...
]
```

## Return All session Burst
### GET: http://localhost:3000/api/burst

Output
```json
[
  {
    "SESSION_NAME": "LLG3370-NSASK12-RT01_C_N_T_0",
    "DESTINATION_IP": "117.247.147.123",
    "CITY": "Trivandrum",
    "LATITUDE": "8.5241",
    "LONGITUDE": "76.9366",
    "METRICS": [
      {
        "delay_max": 2233,
        "delay_variation": 170,
        "interval_start": "2023-07-19 09:19:30.000"
      },
      {
        "delay_max": 2372,
        "delay_variation": 327,
        "interval_start": "2023-07-19 10:26:00.000"
      },
      ...
    ]
  },
  {
    "SESSION_NAME": "LG2406_R_Z_T_0",
    "DESTINATION_IP": "...",
    "CITY": "...",
    "LATITUDE": "...",
    "LONGITUDE": "...",
    "METRICS": [...]
  },
  ...
]
```

## Specific Session burst max
### GET: http://localhost:3000/api/burst/:session_name

Output
```json
[
  {
    "SESSION_NAME": ":session_name",
    "DESTINATION_IP": "...",
    "CITY": "...",
    "LATITUDE": "...",
    "LONGITUDE": "...",
    "METRICS": [...]
  }
]