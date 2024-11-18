# Home Library Service


## Installing NPM modules

```
npm install
```

## Setting server variables

cp .env.example .env
```

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

create empty migration

```
npm run migration:create
```

migration for generate bd

```
npm run migration:generate
```


After starting the app on port (4000 as default) you can open
in your browser OpenAPI documentation by typing http://localhost:4000/api/docs/.
For more information about OpenAPI/Swagger please visit https://swagger.io/.

## Testing

After application running open new terminal and enter:

To run all tests without authorization

```
npm run test
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