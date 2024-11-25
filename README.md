# Home Library Service


## Installing NPM modules

```
npm install
```

## Setting server variables

```
cp .env.example .env
```
!Important: If you have changed the values ​​in the .env file, you need to restart docker container ("docker compose down" and then "docker compose up")

## Working with application

Start docker container

```
docker compose up
```

Stop docker container

```
docker compose down
```

Check vulnerabilities (only if docker was started)

```
npm run docker:audit
```

After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/api/docs/.

## Testing

After application running open new terminal and enter:

To run all tests with authorization

```
npm run test:auth
npm run test:refresh
```

To run only one of all test suites

```
npm run test -- <path to suite>
```

### Auto-fix and format

```
npm run lint
```

```
npm run format
```