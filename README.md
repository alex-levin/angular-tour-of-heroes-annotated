# AngularTourOfHeroes

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.7.4.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

Commands:
npm install -g @angular/cli
ng new angular-tour-of-heroes
cd angular-tour-of-heroes
ng serve --open
ng generate component heroes
ng generate component hero-detail
ng generate service hero
ng generate component messages

The --module=app option tells the CLI to provide this service in the AppModule,
ng generate service message --module=app

--flat puts the file in src/app instead of its own folder.
--module=app tells the CLI to register it in the imports array of the AppModule.
ng generate module app-routing --flat --module=app

ng generate component dashboard

In-memory Web API to simulate HTTP server
npm install angular-in-memory-web-api@0.5 --save

ng generate component hero-search
