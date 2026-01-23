# Dynamic Product Configuration Wizard

A production-ready multi-step Product Configuration Wizard built using **React, TypeScript, and XState**.  
This project demonstrates advanced frontend engineering skills including predictable state management, validation, accessibility, comprehensive testing, and Dockerized deployment.

---

## Project Objective

The objective of this project is to build a dynamic and resilient product configuration wizard that guides users through multiple steps while preventing invalid states.

All wizard navigation, validation, and transitions are controlled using a centralized **XState state machine**, ensuring predictable behavior, maintainability, and robustness.

This project reflects real-world enterprise frontend architecture and quality standards.

---

## Key Features

- Multi-step configuration wizard
- Clear step progression with progress indicator
- Centralized state management using **XState**
- Forward and backward navigation controlled by state machine
- Validation guards preventing invalid navigation
- Visible validation error messages
- Dynamic summary step for review
- Keyboard-accessible UI (WCAG 2.1 AA basics)
- Unit & integration testing using **Jest + React Testing Library**
- End-to-end testing using **Cypress**
- Dockerized production build served via **Nginx**

---

## Wizard Flow

### Step 1 – Product Selection
- User selects a product type
- Validation prevents proceeding without selection
- Error message displayed on invalid action

### Step 2 – Configuration Options
- User provides configuration details
- Back navigation supported
- Validation prevents empty submission

### Summary Step
- Displays all selected configuration values
- User reviews selections before final submission

---

## Architecture Overview

### State Management (XState)

- A single XState machine controls the entire wizard
- All states, events, transitions, guards, and actions are explicitly defined
- Guards prevent invalid transitions
- Predictable state flow eliminates UI inconsistencies

### Component Structure


---

## Tech Stack

- React (Vite)
- TypeScript
- XState + @xstate/react
- Jest + React Testing Library
- Cypress (End-to-End Testing)
- Docker & Docker Compose
- Nginx

---

## Prerequisites

- Node.js (v18 or higher)
- npm
- Docker Desktop (optional, for containerized run)

---

## Running the Application Locally

### Install Dependencies

```bash
npm install

Start Development Server
npm run dev


Open in browser:

http://localhost:5173

Production Build (Local)
npm run build
npm run preview


Open in browser:

http://localhost:4173

Unit & Integration Testing (Jest + RTL)
Run Tests
npx jest

Run Tests with Coverage
npx jest --coverage

Testing Scope

XState machine logic tested independently

Wizard step components tested for validation and rendering

Coverage meets assignment expectations (~80%)

End-to-End Testing (Cypress)
Start Application
npm run dev

Run Cypress Tests
npx cypress run

E2E Coverage Includes

Complete successful wizard flow

Validation error scenarios

Forward and backward navigation

Final summary verification

Stable selectors are implemented using data-cy attributes.

Responsiveness

Responsive layout implemented using modern CSS

Verified at:

Mobile: 375px

Tablet: 768px

Desktop: 1440px

Tested using Chrome DevTools responsive mode

Accessibility

Semantic HTML elements (label, button, section, nav)

Full keyboard navigation support

Validation messages announced using role="alert"

Accessible progress indicator

Screen reader–friendly form controls

Loading States

Async submission handled via XState service

Clear loading indicator shown during submission

Navigation disabled while submitting

Docker Setup (Production)
Docker Files Included

Dockerfile – multi-stage build (Node → Nginx)

docker-compose.yml – container orchestration

Build and Run Using Docker
docker-compose up --build


Open in browser:

http://localhost:3000


Note: Docker Desktop must be running and configured for Linux containers.

Limitations & Future Enhancements

Persist wizard state using localStorage

Add visual regression testing

Integrate real backend APIs

Improve UI styling with a design system or Tailwind CSS

Author

Nadipena Murali