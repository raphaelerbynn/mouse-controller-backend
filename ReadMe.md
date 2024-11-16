# Server Documentation

The server is written in Node.js and uses the Express.js framework. It provides a simple API for controlling a computer's mouse remotely.

## Endpoints

### `GET /`

Returns a simple HTML page with a QR code that can be scanned to connect to the server.

### `GET /generate-qrcode`

Returns a QR code as a PNG image that can be used to connect to the server.

### `GET /disconnect`

Disconnects the current client and closes the socket.

### `POST /controlMouse`

Expects a JSON payload with the following properties:

* `sessionId`: The session ID of the client to control.
* `command`: The mouse command to execute, which can be one of the following:
	+ `move`: Move the mouse to the specified coordinates.
		- `dx`: The change in x-coordinate.
		- `dy`: The change in y-coordinate.
	+ `click`: Click the mouse button specified by `button`.
		- `button`: The mouse button to click, which can be one of `left`, `right`, or `middle`.

## Environment Variables

The server expects the following environment variables to be set:

* `PORT`: The port number to listen on. Defaults to `3000`.

## Running the Server

To run the server, execute the following command in the terminal:

