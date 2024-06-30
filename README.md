# YelpCamp

## Description
YelpCamp is a web app designed for users to discover campgrounds worldwide. It offers comprehensive information about each campground, such as descriptions, photos, prices, and reviews. Additionally, users can create their own campgrounds and contribute reviews to existing ones.

## Built with 

- <img src="https://img.shields.io/badge/CSS-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS icon" />
- <img src="https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white" alt="Bootstrap icon" />
- <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB icon" />
- <img src="https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white" alt="Mongoose icon" />
- <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express icon" />
- <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript icon" />

## Decisions and some considerations

- I decided to use Cloudinary because it serves as a cornerstone for managing and optimizing images in a cloud-based environment. By leveraging Cloudinary's services, the application simplifies the upload, storage, transformation, and delivery of media assets. This capability is essential for efficiently handling user-generated content such as campground photos and ensuring optimal visual presentation.

For session management, connect-mongo was chosen to store session data persistently in MongoDB. This ensures seamless user sessions across server restarts or crashes, maintaining user authentication states and enhancing application reliability.

EJS (Embedded JavaScript) serves as the templating engine for dynamically generating HTML markup with JavaScript. Its versatility enables the server-side rendering of dynamic content and the reuse of template components, enhancing code maintainability and rendering efficiency. EJS-mate extends EJS functionality by introducing layout and block functionalities. This extension promotes code reusability and structure within EJS templates, streamlining the development process and improving the organization of template-based views. I chose EJS for its seamless integration with Node.js, allowing efficient server-side rendering of dynamic content. Unlike React, EJS simplifies initial setup and reduces client-side rendering complexity, which is beneficial for applications emphasizing server-generated HTML. Since this project does not require advanced client-side features provided by React, EJS proved to be a straightforward and effective choice.

Helmet is integrated to enhance application security by setting HTTP headers. It mitigates common web vulnerabilities like XSS (Cross-Site Scripting) and CSRF (Cross-Site Request Forgery), bolstering the application's defenses against malicious attacks and ensuring data integrity.

Joi provides robust schema validation and data sanitization capabilities. By validating and sanitizing user input or external data, it prevents malformed data from entering the application, thereby ensuring data consistency and safeguarding against potential security threats.

Sanitize-html is employed for sanitizing HTML input to prevent XSS attacks. It enables safe HTML formatting and content rendering while removing potentially malicious scripts or code, ensuring that user-generated content is displayed safely within the application.

Method-override facilitates RESTful API practices by enabling the use of HTTP methods such as PUT and DELETE in web applications that only support GET and POST natively. This middleware enhances API flexibility and adherence to REST principles, improving overall API design and functionality.

Multer and multer-storage-cloudinary are crucial for handling file uploads within the application. Multer provides middleware for processing multipart/form-data, while multer-storage-cloudinary integrates Multer with Cloudinary for seamless upload and storage of files in the cloud. This setup streamlines file management processes and enhances scalability by offloading storage to a cloud-based service.

Paginationjs is utilized for client-side pagination in jQuery and JavaScript. It simplifies the implementation of pagination functionality for managing large datasets, enhancing user experience by dividing data into manageable pages without additional server-side rendering.

Passport is integrated for authentication middleware, supporting various authentication strategies such as OAuth and local username/password authentication. It enhances application security by managing user authentication and access control, ensuring secure user interactions and data protection.

Passport-google-oauth20 simplifies Google OAuth 2.0 authentication integration. By leveraging Google's authentication service, it allows users to sign in securely using their Google accounts, enhancing user convenience and authentication security within the application.

Passport-local and passport-local-mongoose provide authentication strategies for local username/password authentication. These packages streamline the implementation of user registration, login, and session management, ensuring secure access control and authentication processes.

These decisions were driven by the need to implement robust, scalable, and secure features while maintaining high performance and usability standards throughout the development of the application. Each npm package contributes uniquely to achieving these goals, ensuring a reliable and efficient application that meets both user expectations and industry standards.

## Features
- **Browse through a list of campgrounds**
- **View campground details** such as location, description, and images
- **Add new campgrounds** (requires authentication)
- **Edit existing campgrounds** (requires authorization)
- **Delete campgrounds** (requires authorization)
- **Leave reviews and ratings** for campgrounds (requires authentication)
- **User authentication with username and password**
- **User authentication with Google**
- **User registration**
- **Full responsiveness** for various devices
- **Interactive map** to explore campgrounds
  
## Technologies Used
### Main Technologies
- **Front End**: CSS, Bootstrap
- **Back End**: MongoDB, Express, Mongoose
- **Primary Language**: JavaScript

### Server and Routing
- **express**
- **method-override**

### Templating
- **ejs**
- **ejs-mate**

### Authentication and Authorization
- **passport**
- **passport-local**
- **passport-local-mongoose**
- **passport-google-oauth20**

### Database and Session Management
- **mongoose**
- **connect-mongo**

### Data Validation and Sanitization
- **joi**
- **sanitize-html**

### File Upload and Storage
- **multer**
- **multer-storage-cloudinary**
- **cloudinary**

### Environment Variables
- **dotenv**

### Security
- **helmet**
- **connect-flash**

### API and HTTP Requests
- **axios**
- **@mapbox/mapbox-sdk**

### Pagination
- **paginationjs**

## Project Link
**https://yelpcamp-uf2n.onrender.com/**

## Contacts
**https://www.linkedin.com/in/diogo-coelho-9360a9268/**
**diogocoelho19988@gmail.com**



