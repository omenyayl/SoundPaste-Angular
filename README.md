# SoundPaste

Transmit/Receive text data over sound for easy copying and pasting device to device. (Paired with Android app called SoundPaste) 

## Important note

Before building/running this app, make sure to create a file src/app/environment.ts with the following contents:

```
const CHIRP_KEY = 'YOUR_CHIRP_APP_KEY';
const API_URL = 'YOUR_API_URL';
export { CHIRP_KEY, API_URL };
```

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
