# The Wall API & Middleware

This application is intended to act as a _middleware_ between the any backend API, external services, and the client. **The Wall**'s responsibility is to host all the business logic so the client just have to worry about front end logic, for example, rendering the data.

The API uses the [jsonapi](https://jsonapi.org/) specification to serialize JSON between the server and the client.

## Local environment configuration

Read [this](docker/README.md)

## Project structure

Behind the scenes, **The Wall** uses [expressjs](https://expressjs.com/) to expose the API the client need, the application does not use a database engine to persist the data, instead, it uses [redis](https://redis.io/) as cache to save the requested response data (it can come from any backend API or any external service) aiming to reduce response time. To perform any external API request, **The Wall** uses [axios](https://github.com/axios/axios).

### Environment config files

The [config](/config) folder is used to:
1. environment configuration.
2. app configuration.

By default, all the configuration data must be declared in the [default.json](config/default.json) file, then you can set up specific config per environment when needed, as described [here](https://github.com/lorenwest/node-config#quick-start)

### Request resolvers

Instead of defining all of your request handling logic as inline function in [the routes file](src/routes.js), there must be one `request-resolver` for each API route. The `request-resolver` is intended to handle the request logic and send back a response or throw an error if needed. **The Wall** uses the [express-validator](https://express-validator.github.io) library to validate in the input data received from the client, those validations are exported from a single `request-resolver` and declared in the [the routes file](src/routes.js) if needed.

### Models

Models are a representation of the data and the behavior that's related to it, for example: the shopping cart data and how to modify it. They can be used to send a response back to the client, if so, the model needs to implement an asynchronous method called `serialize` and use a [jsonapi-serializer](https://github.com/SeyZ/jsonapi-serializer#serialization).

### Serializers

They are just used to serialize the data in [jsonapi](https://jsonapi.org/) format that is sent back to the client. All `request-resolvers` must send back a response using a `serializer`. **The Wall** uses the [jsonapi-serializer](https://github.com/SeyZ/jsonapi-serializer) library for this.

### Repositories

Repositories are classes acting as the source of the data. Usually, they are used to call external APIs and perform simple logic on models.

## Testing

You can find some considerations when writing tests [here](tests/README.md).
