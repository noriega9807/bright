# Bright code challenge

To run execute one of the following commands:

```bash
node ./src/index.js
#or
bun run start
```

Note: you can modify the constant *inputLoop* to run that number of times the requests to the endpoint

## Explanation

### What I did was a class with the following:
  - Construct that contains an attibute pendingRequests which is an array that will be used to keep track of the pending requests.
  - lookupPrice which is the main entry point for requesting the stock. It checks if there's already a request for the current symbol and if it uses it, we return that promise, so that we don't make the same request twice one after another.
  Then it calls fetchPriceFromApi and we store the result in the map and finally we use await to ensure that the 1 second latency is not going to fail.
  - fetchPriceFromAPI which uses http to call the endpoint and returns the promise to lookupPrice.

## What's next

 - Use another library like axios which handles error codes better.
 - Create tests for the class to ensure that it's not going to fail when users use it (preferably 80% coverage).
 - Handle edge cases