import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { MessageService } from './message.service';
import { catchError, map, tap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class HeroService {

  private heroesUrl = 'api/heroes';  // URL to web api


  /**
   * Injects MessageService
   * @param messageService
   */
  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add('HeroService: ' + message);
  }

  /**
   * Synchronous method
   */
  // getHeroes(): Hero[] {
  //   return HEROES;
  // }

  /**
   * Asynchronous method
   * Synchronous method will not work in a real app. You're getting away with it now because 
   * the service currently returns mock heroes. But soon the app will fetch heroes from a remote 
   * server, which is an inherently asynchronous operation.
   * The HeroService must wait for the server to respond, getHeroes() cannot return immediately 
   * with hero data, and the browser will not block while the service waits.
   * HeroService.getHeroes() must have an asynchronous signature of some kind.
   * It can take a callback. It could return a Promise. It could return an Observable.
   * In this tutorial, HeroService.getHeroes() will return an Observable in part because it will 
   * eventually use the Angular HttpClient.get method to fetch the heroes and HttpClient.get() 
   * returns an Observable.
   *
  getHeroes(): Observable<Hero[]> {
    // TODO: send the message _after_ fetching the heroes
    this.messageService.add('HeroService: fetched heroes');
    // We have export const HEROES: Hero[{ id: 11, name: 'Mr. Nice' },...] in mock-heroes.ts
    // HEROES here is the array of mocked Hero objects
    // of(HEROES) returns an Observable<Hero[]> that emits a single value, the array of mock heroes.
    // http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#static-method-of
    // This static operator is useful for creating a simple Observable that only emits the 
    // arguments given, and the complete notification thereafter.
    return of(HEROES);
  }
  */

  /** GET heroes from the server
  getHeroes(): Observable<Hero[]> {
    // HttpClient.get returns the body of the response as an untyped JSON object by default. 
    // Applying the optional type specifier, <Hero[]> , gives you a typed result object.
    // Other APIs may bury the data that you want within an object. 
    // You might have to dig that data out by processing the Observable result with the 
    // RxJS map operator.
    return this.http.get<Hero[]>(this.heroesUrl)
        .pipe(
      // handleError() method reports the error and then returns an innocuous result so that 
      // the application keeps working
      catchError(this.handleError('getHeroes', []))
    );
  }
  */

  /** GET heroes from the server */
  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        // The tap operator looks at the observable values, does something with those values, 
        // and passes them along. The tap call back doesn't touch the values themselves.
        tap(heroes => this.log(`fetched heroes`)),
        catchError(this.handleError('getHeroes', []))
      );
  }

  /**
   * Although not discussed here, there's an example of map in the getHeroNo404() 
   * method included in the sample source code.
   * GET hero by id. Return `undefined` when id not found 
   */
  getHeroNo404<Data>(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/?id=${id}`;
    return this.http.get<Hero[]>(url)
      .pipe(
        map(heroes => heroes[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} hero id=${id}`);
        }),
        catchError(this.handleError<Hero>(`getHero id=${id}`))
      );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * After reporting the error to console, the handler constructs a user friendly message 
   * and returns a safe value to the app so it can keep working.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /*
  getHero(id: number): Observable<Hero> {
    // TODO: send the message _after_ fetching the hero
    // Note the backticks ( ` ) that define a JavaScript template literal for embedding the id.
    this.messageService.add(`HeroService: fetched hero id=${id}`);
    return of(HEROES.find(hero => hero.id === id));
  }
  */

  /** GET hero by id. Will 404 if id not found */
  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  /** PUT: update the hero on the server */
  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  /** POST: add a new hero to the server */
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, httpOptions).pipe(
      tap((hero: Hero) => this.log(`added hero w/ id=${hero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  /** DELETE: delete the hero from the server */
  deleteHero(hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  /* GET heroes whose name contains search term */
searchHeroes(term: string): Observable<Hero[]> {
  if (!term.trim()) {
    // if not search term, return empty hero array.
    return of([]);
  }
  return this.http.get<Hero[]>(`api/heroes/?name=${term}`).pipe(
    tap(_ => this.log(`found heroes matching "${term}"`)),
    catchError(this.handleError<Hero[]>('searchHeroes', []))
  );
}
}
