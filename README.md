# Buffer's UTM extracting helper fuctions

This module offers some basic logic to extract UTM parameters from the
query string. It returns them in a simple data structure that includes a
TTL so that we can define when to discard the found UTM parameters

This module is currently shared between `buffer-login` and `buffer-marketing`
to handle UTM tracking in a consistent way

## Install

```
npm install @bufferapp/utms --save
```

## Usage

The main API to this module is `refreshUtms(query, previousUtms)`, it takes
the curret query parameters (object) and the previous value returned by this
function (which includes both the extracted UTMs and the TTL info)

This package does not take care of storing previous UTMs, a simple way to use
it is by storing them in the users session:

```
const { refreshUtms } = require('@bufferapp/utms')

middleware.trackUtm = (req, res, next) => {
  req.session.utms = refreshUtms(req.query, req.session.utms)

  next()
}
```

With the above middleware, the currently valid UTMs for the request would be available
in `req.session.utms.values`
