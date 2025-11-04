# Phonebook Application – Frontend Documentation

## Overview

React-based frontend for a **digital phonebook application**.  
The application allows users to manage their contacts using **natural language commands**.  
The frontend communicates with the **Spring Boot backend** via REST API and presents responses in a clean, user-friendly interface.

**Tech Stack:**
- React 18+  
- TypeScript  
- Vite (bundler)  
- Axios (HTTP client)  
- CSS3  
- Node.js + npm  

## Features

### 1. Natural Language Input
- Input field for entering commands in **natural language**  
- Supports operations such as **adding**, **editing**, **deleting**, and **searching** contacts  
- Provides clear **user feedback** confirming the result of each operation  

### 2. Contacts Display
- Displays all contacts in a **readable list format**  
- Each contact shows:
  - **ID**
  - **Name**
  - **Phone numbers**  
- The contact list updates **dynamically** after every operation  

### 3. Error Handling
- Displays error messages returned from the backend  
- Handles **network errors** and **timeouts** gracefully  
- Provides **user-friendly error messages** for better UX  

## Architecture

### Frontend Data Flow – Natural Language Command Processing
1. The user enters a command (e.g., *"Add a contact named John with number 555-123-456"*)  
2. The frontend sends the prompt to the backend via the Gemini API endpoint  
3. The backend interprets the command and performs the appropriate CRUD operation  
4. The frontend updates the contact list and shows the user a confirmation or an error message  

## Setup & Installation

### Requirements
- **Node.js 16+**  
- **npm 8+**  
- **Git**

### Clone the Repository

-git clone: 
https://github.com/joannakmurawska/phonebookFE.git


- npm install
- npm run dev
- And you can see app on: http://localhost:5173/

You can check 

## Production url: 

```
https://phonebookfe.onrender.com/
```
