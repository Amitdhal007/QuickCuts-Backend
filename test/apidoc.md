Certainly! Here's a comprehensive API documentation for your salon app backend:

# Salon App API Documentation

Base URL: `http://localhost:8000/api`

## Authentication

### Register User

- **URL**: `/auth/user/register`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Success Response**: 
  - **Code**: 201
  - **Content**: `{ "success": true, "token": "JWT_TOKEN" }`

### Login User

- **URL**: `/auth/user/login`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Success Response**: 
  - **Code**: 200
  - **Content**: `{ "success": true, "token": "JWT_TOKEN" }`

### Register Salon

- **URL**: `/auth/salon/register`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "name": "Beauty Salon",
    "email": "beauty@example.com",
    "password": "salonpass123",
    "address": "123 Main St, City",
    "operatingHours": {
      "start": "09:00",
      "end": "18:00"
    },
    "lat": 40.7128,
    "lon": -74.0060
  }
  ```
- **Success Response**: 
  - **Code**: 201
  - **Content**: `{ "success": true, "token": "JWT_TOKEN" }`

### Login Salon

- **URL**: `/auth/salon/login`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "beauty@example.com",
    "password": "salonpass123"
  }
  ```
- **Success Response**: 
  - **Code**: 200
  - **Content**: `{ "success": true, "token": "JWT_TOKEN" }`

## Salons

### Get All Salons

- **URL**: `/salons`
- **Method**: `GET`
- **Success Response**: 
  - **Code**: 200
  - **Content**: `{ "success": true, "data": [{ salon objects }] }`

### Get Salon Profile

- **URL**: `/salons/profile`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer JWT_TOKEN`
- **Success Response**: 
  - **Code**: 200
  - **Content**: `{ "success": true, "data": { salon object } }`

### Update Salon Profile

- **URL**: `/salons/profile`
- **Method**: `PUT`
- **Headers**: `Authorization: Bearer JWT_TOKEN`
- **Body**:
  ```json
  {
    "name": "Updated Beauty Salon",
    "address": "456 New St, City",
    "operatingHours": {
      "start": "08:00",
      "end": "19:00"
    },
    "lat": 40.7128,
    "lon": -74.0060
  }
  ```
- **Success Response**: 
  - **Code**: 200
  - **Content**: `{ "success": true, "data": { updated salon object } }`

### Search Salons

- **URL**: `/salons/search`
- **Method**: `GET`
- **Query Parameters**:
  - `name`: Salon name (optional)
  - `service`: Service name (optional)
  - `minRating`: Minimum rating (optional)
  - `maxPrice`: Maximum price (optional)
  - `sortBy`: Sort by field (optional, values: "rating" or "price")
- **Success Response**: 
  - **Code**: 200
  - **Content**: `{ "success": true, "count": number, "data": [{ salon objects }] }`

### Search Salons by Location

- **URL**: `/salons/search/location`
- **Method**: `GET`
- **Query Parameters**:
  - `lat`: Latitude of the search center (required)
  - `lon`: Longitude of the search center (required)
  - `maxDistance`: Maximum distance in meters (optional, default 5000)
- **Success Response**: 
  - **Code**: 200
  - **Content**: `{ "success": true, "count": number, "data": [{ salon objects }] }`

### Update Salon Services

- **URL**: `/salons/services`
- **Method**: `PUT`
- **Headers**: `Authorization: Bearer JWT_TOKEN`
- **Body**:
  ```json
  {
    "services": [
      {
        "name": "Haircut",
        "price": 30,
        "duration": 60
      },
      {
        "name": "Manicure",
        "price": 25,
        "duration": 45
      }
    ]
  }
  ```
- **Success Response**: 
  - **Code**: 200
  - **Content**: `{ "success": true, "data": { updated salon object } }`

### Update Main Picture

- **URL**: `/salons/profile/main-picture`
- **Method**: `PUT`
- **Headers**: `Authorization: Bearer JWT_TOKEN`
- **Body**: Form-data with key "mainPicture" and file value
- **Success Response**: 
  - **Code**: 200
  - **Content**: `{ "success": true, "data": { updated salon object } }`

### Add Carousel Images

- **URL**: `/salons/profile/carousel-images`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer JWT_TOKEN`
- **Body**: Form-data with key "carouselImages" and multiple file values (up to 5)
- **Success Response**: 
  - **Code**: 200
  - **Content**: `{ "success": true, "data": { updated salon object } }`

### Get Salon Services

- **URL**: `/salons/:salonId/services`
- **Method**: `GET`
- **Success Response**: 
  - **Code**: 200
  - **Content**: `{ "success": true, "data": [{ service objects }] }`

### Add New Service

- **URL**: `/salons/services`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer JWT_TOKEN`
- **Body**:
  ```json
  {
    "name": "New Service",
    "price": 50,
    "duration": 60
  }
  ```
- **Success Response**: 
  - **Code**: 201
  - **Content**: `{ "success": true, "data": { service object } }`

### Update Service

- **URL**: `/salons/services/:serviceId`
- **Method**: `PUT`
- **Headers**: `Authorization: Bearer JWT_TOKEN`
- **Body**:
  ```json
  {
    "name": "Updated Service",
    "price": 55,
    "duration": 75
  }
  ```
- **Success Response**: 
  - **Code**: 200
  - **Content**: `{ "success": true, "data": { updated service object } }`

### Delete Service

- **URL**: `/salons/services/:serviceId`
- **Method**: `DELETE`
- **Headers**: `Authorization: Bearer JWT_TOKEN`
- **Success Response**: 
  - **Code**: 200
  - **Content**: `{ "success": true, data: {} }`

## Bookings

### Create Booking

- **URL**: `/bookings`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer JWT_TOKEN`
- **Body**:
  ```json
  {
    "salon": "salon_id",
    "serviceId": "service_id",
    "date": "2023-05-01T10:00:00Z"
  }
  ```
- **Success Response**: 
  - **Code**: 201
  - **Content**: `{ "success": true, "data": { booking object } }`

### Get User Bookings

- **URL**: `/bookings/user`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer JWT_TOKEN`
- **Success Response**: 
  - **Code**: 200
  - **Content**: 
    ```json
    {
      "success": true,
      "data": [
        {
          "_id": "booking_id",
          "salon": {
            "_id": "salon_id",
            "name": "Salon Name",
            "address": "Salon Address"
          },
          "service": {
            "_id": "service_id",
            "name": "Service Name",
            "price": 30,
            "duration": 60
          },
          "date": "2023-05-01T10:00:00Z",
          "status": "pending"
        }
        // ... more booking objects
      ]
    }
    ```

### Get Salon Bookings

- **URL**: `/bookings/salon`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer JWT_TOKEN`
- **Success Response**: 
  - **Code**: 200
  - **Content**: 
    ```json
    {
      "success": true,
      "data": [
        {
          "_id": "booking_id",
          "user": {
            "_id": "user_id",
            "name": "User Name",
            "email": "user@example.com"
          },
          "service": {
            "_id": "service_id",
            "name": "Service Name",
            "price": 30,
            "duration": 60
          },
          "date": "2023-05-01T10:00:00Z",
          "status": "pending"
        }
        // ... more booking objects
      ]
    }
    ```

### Update Booking Status

- **URL**: `/bookings/:id`
- **Method**: `PATCH`
- **Headers**: `Authorization: Bearer JWT_TOKEN`
- **Body**:
  ```json
  {
    "status": "confirmed"
  }
  ```
- **Success Response**: 
  - **Code**: 200
  - **Content**: `{ "success": true, "data": { updated booking object } }`

### Cancel Booking

- **URL**: `/bookings/:id`
- **Method**: `DELETE`
- **Headers**: `Authorization: Bearer JWT_TOKEN`
- **Success Response**: 
  - **Code**: 200
  - **Content**: `{ "success": true, "data": {} }`

## Reviews

### Add Review

- **URL**: `/salons/:salonId/reviews`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer JWT_TOKEN`
- **Body**:
  ```json
  {
    "rating": 4,
    "comment": "Great service and friendly staff!"
  }
  ```
- **Success Response**: 
  - **Code**: 201
  - **Content**: `{ "success": true, "data": { salon object with new review } }`

### Get Salon Reviews

- **URL**: `/salons/:salonId/reviews`
- **Method**: `GET`
- **Success Response**: 
  - **Code**: 200
  - **Content**: `{ "success": true, "data": [{ review objects }] }`

### Update Review

- **URL**: `/salons/:salonId/reviews/:reviewId`
- **Method**: `PUT`
- **Headers**: `Authorization: Bearer JWT_TOKEN`
- **Body**:
  ```json
  {
    "rating": 5,
    "comment": "Updated: Excellent service and very professional staff!"
  }
  ```
- **Success Response**: 
  - **Code**: 200
  - **Content**: `{ "success": true, "data": { salon object with updated review } }`

### Delete Review

- **URL**: `/salons/:salonId/reviews/:reviewId`
- **Method**: `DELETE`
- **Headers**: `Authorization: Bearer JWT_TOKEN`
- **Success Response**: 
  - **Code**: 200
  - **Content**: `{ "success": true, data: {} }`

## User Profile Management

### Get User Profile

- **URL**: `/users/profile`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer JWT_TOKEN`
- **Success Response**: 
  - **Code**: 200
  - **Content**: 
    ```json
    {
      "success": true,
      "data": {
        "_id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "profilePicture": "https://example.com/profile.jpg",
        "phoneNumber": "+1234567890",
        "createdAt": "2023-04-20T12:00:00.000Z",
        "updatedAt": "2023-04-20T12:00:00.000Z"
      }
    }
    ```

### Update User Profile

- **URL**: `/users/profile`
- **Method**: `PUT`
- **Headers**: `Authorization: Bearer JWT_TOKEN`
- **Body**:
  ```json
  {
    "name": "John Updated",
    "phoneNumber": "+9876543210"
  }
  ```
- **Success Response**: 
  - **Code**: 200
  - **Content**: 
    ```json
    {
      "success": true,
      "data": {
        "_id": "user_id",
        "name": "John Updated",
        "email": "john@example.com",
        "profilePicture": "https://example.com/profile.jpg",
        "phoneNumber": "+9876543210",
        "createdAt": "2023-04-20T12:00:00.000Z",
        "updatedAt": "2023-04-20T13:00:00.000Z"
      }
    }
    ```

### Update Profile Picture

- **URL**: `/users/profile/picture`
- **Method**: `PUT`
- **Headers**: `Authorization: Bearer JWT_TOKEN`
- **Body**: Form-data with key "profilePicture" and file value
- **Success Response**: 
  - **Code**: 200
  - **Content**: 
    ```json
    {
      "success": true,
      "data": {
        "_id": "user_id",
        "name": "John Doe",
        "email": "john@example.com",
        "profilePicture": "/uploads/users/profilePicture-1234567890.jpg",
        "phoneNumber": "+1234567890",
        "createdAt": "2023-04-20T12:00:00.000Z",
        "updatedAt": "2023-04-20T14:00:00.000Z"
      }
    }
    ```

## Error Responses

All endpoints may return the following error responses:

- **Code**: 400 Bad Request
  - **Content**: `{ "success": false, "message": "Error description" }`
- **Code**: 401 Unauthorized
  - **Content**: `{ "message": "Not authorized to access this route" }`
- **Code**: 404 Not Found
  - **Content**: `{ "success": false, "message": "Resource not found" }`
- **Code**: 500 Internal Server Error
  - **Content**: `{ "success": false, "message": "Server error description" }`

This API documentation covers all the endpoints we've implemented in your salon app backend. It includes authentication, salon management, bookings, reviews, and search functionality. You can use this as a reference when developing your frontend or when other developers need to interact with your API.