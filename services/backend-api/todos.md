# API

- [x] Fleet Admin/Driver sign in/sign up
- [x] Vehicles CRUD
- [x] Drivers CRUD
- [x] Trips CRUD
- [x] Generate Unique password/username for fleet manager and drivers to login
- [x] One fleet has one admin (for now)
- [x] Create vehicles (via CSV)
- [x] Show trips of last 7 days
- [x] Show route on driver's end only when manager has assigned it to him.

## Models

- Fleet
  - Fleet Admin(s)
  - Fleet Vehicles
  - Fleet Drivers

- Fleet Vehicle
  - Driver
  - Vehicle Type
  - License Plate
  - Status (Idle, Charging, en-route)
  - Battery Level
  - Location (Latitude, Longitude)
  - Next Stop
  - Temperature
  - Odometer Reading (kms travelled)

- Fleet Driver
  - Name
  - Contact Information
  - Assigned Vehicle
  - Status (Available, On Duty, Off Duty)

- Fleet Trip
  - Vehicle
  - Driver
  - Start Location
  - End Location
  - Distance
  - Duration
  - Status (Planned, In Progress, Completed)
  - Start Time
  - End Time

  ***
