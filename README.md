# Resource Planning System

## Project description

The project's goal is to create a system that allows users/business manage their clients subscriptions. It is built in a Service Oriented Architecture manner and exposes a Restful API that is to be consumed.

## Project technology stack

. Build with JavaScript the core technology stack is: - Node.js - Express - MongoDB - Mongoose - JWT - Winston - Morgan - Jest - Superagent
and more...

## Project overview

#### Tests

The project is built with a testing perspective in mind so there are a lot of integration tests implemented that can be found in the resources folder, in each corresponding model. Testing is done with JEST and superagent.

#### Logging

The project uses morgan for development logs and Winston for error logging, which in case writes to a log file and to a dedicated database.

#### Api

On project startup, it seeds a superadmin user that has allpower. Mongodb is the database used in it and mongoose as its ODM. Mongoose allows the use of plugins, hooks, statics, indexing and much more to be done with ease.
As it is common for express a lot of middleware is used e.g. an error handling middleware, an async handler middleware -> can be found in the middleware dir. Another middleware used is for securing most of the routes and can be found in utils/auth -> protect. Security of the endpoints is done via a token based auth -> JWT
In later stages an identity managment system like OKTA could be introduced as I have a POC for it, that implements the implicit flow! Can be found here: [https://github.com/titanXL/okta_react](https://github.com/titanXL/okta_react)

The controllers modules expose handlers used by the routes, which are easily testable and extendable. Each route has a corresponding controller function(and middleware).

## Project setup:

### 1. Clone the github repo in a desired folder: https://github.com/titanXL/RPS.git

    2. Change directory to the cloned repo
    2.1 run "npm install" to install all the server dependencies

## Project startup:

Before running the project one needs to add a couple of environment variables:
DB_URL -> url for a mongodb
DB_URL_LOG -> url for a logging mongodb
sigKey -> Used for encryption of a model field

    1. Change to the project directory and run "npm run dev" to start developing.
    1.2 Run "npm test" to run all tests.
    1.3 Run "npm run build" to create a production ready build. All the neccessary files go into 'dist' folder

## Rest structure:

    An abstract route representation could be found in server.js! Every implemented route can be found in its corresponding model. All routes are flat with a maximum depth of about three levels.
