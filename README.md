# Cardano NFT Marketplace

## Directory structure

- core

  This directory contains core scripts for minting.

- electron

  This directory contains the electron app with simple UI to test scripts

## Requirements

- Node.js v16.13.1

## Technology stack

- Node.js
- TypeScript
- React
- Electron
- Cardano CLI

## Notes

If you're running on Windows, please `yarn global add ntsuspend` for OS compatibility.

## How to start the application in development mode

1. `cd core && npm install` to install core package dependencies
2. `npm run watch:build` to build the package in watch mode
3. `cd ../electron && yarn install` to install electron package dependencies
4. `npm start` to start the electron application

## How to build the application for production

To build the core package, in root directory, run the following commands.

1. `cd core` to get inside core package
2. `npm install` to install dependencies
3. `npm run build:main` to build the core package \
   The output files will be inside `<root>/core/build` directory

To build the electron package, in root directory, run the following commands

1. `cd electron` to get inside electron package
2. `yarn install` to install dependencies
3. `yarn package` to build the release of the Electron app
