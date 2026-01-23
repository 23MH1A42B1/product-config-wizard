# Dynamic Product Configuration Wizard

A production-ready multi-step Product Configuration Wizard built with **React, TypeScript, and XState**.  
The project showcases predictable state management, validation, accessibility, end-to-end testing, and Dockerized deployment.

## Project Objective

Build a dynamic, resilient product configuration wizard that guides users through multiple steps while preventing invalid states.  
The wizard is driven by an **XState state machine**, ensuring predictable navigation, validation, and maintainable UI logic.

## Key Features

- Multi-step wizard with clear step progression
- Centralized state management using **XState**
- Controlled forward and backward navigation
- Validation guards to prevent invalid transitions
- Dynamic summary step with selected configuration data
- Progress indicator for current step
- Keyboard-accessible UI (WCAG 2.1 AA basics)
- End-to-end testing using **Cypress**
- Dockerized production build served with **Nginx**

## Wizard Flow

1. **Step 1 – Product Selection**
   - Select a product type
   - Validation required to proceed
2. **Step 2 – Configuration Options**
   - Provide configuration details (e.g., RAM)
   - Back navigation supported
   - Validation prevents empty submission
3. **Summary Step**
   - Review all selected configuration values
   - Final confirmation before completion

## Architecture Overview

### State Management (XState)

- Single state machine controls the entire wizard
- Explicitly defined states, transitions, guards, and actions
- Guards prevent invalid navigation
- Predictable state flow avoids UI inconsistencies

### Component Structure


## Tech Stack

- React (Vite)
- TypeScript
- XState + @xstate/react
- Cypress
- Docker & Docker Compose
- Nginx

## Running the Application Locally

```bash
npm install
npm run dev

docker-compose up --build
