# IOTA ZMQ

The IOTA ZMQ Demonstration is composed of 2 packages `api` and `client`.

It demonstrates exposes a ZMQ stream over a websocket to the browser.

## API

The API facilitates all the services required by `client` web UI. It is a set of services running on NodeJS connecting to IRI Node ZMQ.

See [./api/README.md](./api/README.md) for more details.

## Client

The client package provides a React Web UI to provide facilities to view a ZMQ from an IRI.

See [./client/README.md](./client/README.md) for more details.

# Deployed

A demonstration version of the application is currently deployed at the following urls

* client - <https://iota-poc-zmq.dag.sh>
* api - <https://iota-poc-zmq-api.dag.sh>
