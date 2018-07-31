# EXLcode REPL - ReactJS Web Client

## Requirements

You may be able to get away with more/less than what's described below, but we can't recommend anything outside of these options:

Operating Systems:

- Ubuntu 16.04
- OS X 10.13+
- Windows has not been thoroughly tested, although it has worked and should work... Windows-related contributions are welcome

Other Dependencies:

- NodeJS v8.10+
- NPM v6.1+
- Yarn 1.7+

## Setup

```
git clone https://github.com/exlcode/repl-web

yarn install

cp .envdefault .env # And then enter in your own env variables in KEY=VALUE format

npm start # Starts dev server (first ensure that you don't have anything else on port 8081)

# Navigate to http://localhost:8081/repl/ (don't forget the /repl/ part!) to view the application
```

## Commands

- `yarn start` - start the dev server (ensure that port 8081 is free)
- `yarn clean` - delete the dist folder
- `yarn run production` - create a production ready build in `dist` folder
- `yarn run lint` - execute an eslint check
- `yarn test` - run all tests

## License

This software is offered under the terms outlined in the [LICENSE.md](LICENSE.md) file provided with this notice. If you have any questions regarding the license, please contact [licensing@exlinc.com](mailto:licensing@exlinc.com)

## Enterprise / Commercial Licensing & Support

For enterprise licenses and/or support, please send an email enquiry to [enterprise@exlinc.com](mailto:enterprise@exlinc.com)
