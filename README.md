AccomoVista - Hotel Management API
AccomoVista is a robust API designed to manage hotel and room information. It enables CRUD operations for hotels and rooms, allows image uploads, and supports structured data storage. The API is built with scalability, file handling, and data validation in mind, making it suitable for a wide range of hospitality-related applications.

Table of Contents
Overview
Features
Tech Stack
Project Structure
Getting Started
Installation
    Environment Variables
    Usage
API Documentation
Testing
Error Handling
Contributing
License
Overview
The AccomoVista API serves as a backend service for hotel management, allowing users to:

Create, update, retrieve, and delete hotel and room records.
Upload and manage images associated with hotels and rooms.
Ensure data integrity through validation and error handling.
This API provides a foundational platform for building a more extensive hospitality management system.

Features
Comprehensive Hotel Management: CRUD operations for hotels and their respective rooms.
File Upload Support: Upload and manage images with automatic directory structure.
Data Validation and Error Handling: Enforces data integrity and provides detailed error responses.
Unit and Integration Testing: Reliable and well-tested codebase for quality assurance.
Tech Stack
Node.js with Express.js: Efficiently handles server requests and routing.
TypeScript: Enhances type safety and maintainability.
Multer: Manages file uploads.
Jest: Testing framework for unit and integration tests.
Slugify: Generates SEO-friendly slugs for hotel and room titles.
JSON File Storage: Used as a temporary data persistence layer (database integration is recommended for production).

Project Structure

ACCOMOVISTA/
├── node_modules/
├── public/
│   ├── hotelView/
│   ├── roomView/
│   └── uploads/
├── src/
│   ├── controllers/
│   │   └── hotelController.ts
│   ├── middleware/
│   │   ├── upload.ts
│   │   └── validate.ts
│   ├── models/
│   │   └── Hotel.ts
│   ├── routes/
│   │   ├── hotelRoutes.ts
│   │   └── uploadRoutes.ts
│   ├── types/
│   ├── app.ts
│   └── server.ts
├── tests/
│   └── hotelRoutes.test.ts
├── uploads/
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── tsconfig.json

Getting Started
Installation
To set up the project locally, clone the repository and install the dependencies:

git clone https://github.com/fahiiiiii/Accomodation-Vista
cd accomovista
npm install
Environment Variables
Create a .env file in the root directory with the following variables:

PORT=3000
NODE_ENV=development
Update these variables as needed for your environment.

Usage
Running the Application
To start the application in development mode:

npm run dev
For production:

npm run build
npm start
The API will run on http://localhost:3000 by default, or on the port specified in your .env file.

API Documentation
Below are the core endpoints provided by AccomoVista.

Base URL
http://localhost:3000/api
Endpoints
POST /api/hotel
Description: Creates a new hotel entry with associated rooms and images.
Request Fields:
title (string, required): The title of the hotel.
description (string, required): Description of the hotel.
guestCount (integer): Number of guests.
bedroomCount, bathroomCount (integer): Counts of bedrooms and bathrooms.
amenities (string, comma-separated): List of amenities.
hostInfo (string): Information about the host.
address (string): Hotel address.
latitude, longitude (number): Geolocation coordinates.
rooms (JSON string array): Details of rooms.
images (file array): Hotel images.
roomImage (file array): Room images.
Response:
201 Created: Hotel created successfully.
400 Bad Request: Missing or invalid data.
500 Internal Server Error: File upload or processing error.
GET /api/hotel/:hotelId
Description: Retrieves a hotel's details by ID.
Path Parameters:
hotelId (string): Unique identifier for the hotel.
Response:
200 OK: Successfully retrieved hotel details.
404 Not Found: No hotel found with the provided ID.
PUT /api/hotel/:hotelId
Description: Updates an existing hotel entry.
Request Fields: Same as POST /api/hotel.
Response:
200 OK: Successfully updated hotel details.
404 Not Found: No hotel found with the provided ID.


To run the tests:

npm test
For more detailed output:

npm run test:verbose
Ensure that tests cover all core functionality and error handling paths.

Test Coverage
Key features covered in tests:

Successful Hotel Creation: Valid data and images.
Validation Errors: Missing required fields.
File Upload Failures: Error handling when file uploads fail.
Data Retrieval: Ensuring data is correctly returned for both single and multiple records.
Error Handling
Errors are handled consistently, with appropriate HTTP status codes and structured error messages:

400 Bad Request: Input validation errors.
404 Not Found: Missing resources (e.g., hotel not found).
500 Internal Server Error: Unexpected server errors or file upload issues.
Example error response format:

{
  "error": "Error uploading files",
  "details": "Detailed error message if available"
}
Contributing
We welcome contributions! To contribute:

Fork the repository.
Create a new feature branch (git checkout -b feature/YourFeature).
Commit your changes (git commit -m 'Add new feature').
Push to the branch (git push origin feature/YourFeature).
Open a Pull Request.
Ensure that all tests pass before submitting a PR, and include tests for any new functionality.

License
This project is licensed under the MIT License. See the LICENSE file for details.

Thank you for your interest in AccomoVista! Feel free to reach out if you have questions or suggestions.


---

### Additional Recommendations

- **Update URLs**: Replace placeholder URLs (e.g., repository URL) with actual links.
- **Add More Details if Needed**: If you plan to add authentication or integrate a database, expand the README accordingly.
- **Add Diagrams or Examples**: For larger projects, consider adding example requests/responses or diagrams for better visualization. 

This README follows best practices for clarity, structure, and completeness, providing contributors and users with all the information they need to understand, use, and contribute to the project.
