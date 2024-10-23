## Overview
This project is a simple URL shortener service that uses PostgreSQL with database sharding, The database is split across three shards to distribute the load and improve scalability.
It has a web server providing an API with two main endpoints:
  - Shorten a URL: Submit a URL to receive a shortened version.
  - Retrieve a URL: Provide a shortened URL to get back the original one.

## Sharding Details
- The service uses 3 PostgreSQL shards to distribute the data.
- Each URL is assigned to a specific shard based on a sharding key.
- The Sharding key used is the shortened URL field, the value of the shortened URL gets passed to a consistent hashing function that determines which shard the query will be executed on.
- Each shard stores a portion of the shortened URLs and operates as a separate PostgreSQL instance, managed by Docker Compose.

## Endpoints
  1. Shorten a URL:  
    Endpoint: /  
    Method: POST  
    Request Body:
  ```json
   {
      "url": "https://example.com"
   }
  ```
  2. Retrieve the Original URL:  
      Endpoint: /:urlId  
      Method: GET
  
  
## Installation
  Make sure you have the following installed:  
  - Docker  
  - Docker Compose
    
1. Clone the repository:
  ```bash
  git clone https://github.com/omarfarouk311/URL-Shortener-With-Sharding.git
  cd URL-Shortener-With-Sharding
  ```

2. Start the services using Docker Compose:
  ```bash
  docker-compose up -d
  ```
  The web server will be available at http://localhost:8080.

## Usage
  - Create `.env` file with `POSTGRES_PASSWORD=your password` entry in the project folder.
  - To shorten a URL, make a POST request to `http://localhost:8080/` with the url field in the request body.
  - To retrieve an original URL, make a GET request to `http://localhost:8080/:shortened_url` with the shortened_url as a path variable.
  - You can use a tool like Postman to send the request.
