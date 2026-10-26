# SmartCash AI: IoT-Based Smart ATM Fleet Monitoring & Anti-Fraud Biometric Security System

## 1. Project Overview

SmartCash AI is a web-based prototype designed to demonstrate ATM fleet monitoring, cash management, and multi-factor transaction security.

The project aims to address:
- ATM cash depletion and operational monitoring.
- Suspicious transactions involving stolen cards.
- Improved accessibility through a simple ATM interface.

**Important:** Facial verification, banking authorization, IoT sensor readings, cash dispensing, and SMS notifications are simulated demonstrations unless explicitly connected to real services or hardware.

## 2. Main Features

### ATM Security
- Simulated facial verification.
- Card scanning interface.
- PIN entry and verification workflow.
- Multi-factor access decision demonstration.
- Validation of withdrawal amounts.
- Simulated cash withdrawal and digital receipts.
- Emergency or duress workflow demonstration, where implemented.

### ATM Fleet Monitoring
- ATM cash-level monitoring.
- Low-cash alerts.
- ATM operational-status dashboard.
- Cash depletion forecasting concept.
- Simulated cash replenishment and sensor alerts.

### Accessibility
- English and Tamil language support, where implemented.
- Browser-based voice guidance, where implemented.
- Audio alerts and interface feedback.

## 3. Technology Stack

- React
- TypeScript
- Vite
- GitHub
- Browser APIs, where implemented

Testing tools such as Vitest and React Testing Library should be listed after their installation and configuration are verified.

## 4. Installation

### Prerequisites
Install Node.js and npm.

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

### Build the project

```bash
npm run build
```

Open the local URL displayed by the development server.

## 5. Testing and Error Handling

Unit tests should verify individual application behaviors, including:

- Successful and unsuccessful verification scenarios.
- Correct and incorrect PIN handling.
- Rejection of zero or negative withdrawal amounts.
- Prevention of withdrawals without required verification.
- Multi-factor access decisions.
- Emergency or duress workflow behavior.

**Test status:** Test results must be added after running the tests against the current repository. Do not report tests as passing until verified.

If Vitest is configured, the test command can be added to `package.json` and run using:

```bash
npm run test
```

## 6. API Documentation

API endpoints, request formats, response structures, and error handling will be documented after backend implementation and verification.

The current prototype should not be described as connected to live banking APIs unless that integration has been implemented.

## 7. Database Schema

ATM records, cash balances, operational status, and alert information may be stored in a future database.

The final schema will be documented after database implementation and verification.

## 8. Current Limitations

- Authentication and biometric verification may use simulated logic.
- Cash dispensing is a software demonstration, not a physical ATM operation.
- Live banking integration is not established by this documentation.
- Real IoT sensor communication requires additional hardware and integration.
- Live SMS delivery requires a configured messaging service.
- Production deployment requires secure backend authorization and appropriate security testing.

## 9. Future Enhancements

- Backend and database integration.
- Automated unit and integration testing.
- Improved error handling and security logging.
- Cash forecasting model.
- Real IoT sensor integration.
- Improved authentication and accessibility.

## 10. Review 3 Validation Checklist

- [ ] Confirm the latest application files are committed to GitHub.
- [ ] Add test configuration and test files if implemented.
- [ ] Run the test suite and record the actual results.
- [ ] Run the production build and record the result.
- [ ] Verify documentation against the implemented features.

## Repository

https://github.com/anithakaviya2007-afk/SmartCash-AI-ATM-Security
