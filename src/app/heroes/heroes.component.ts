import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { HEROES } from '../mock-heroes';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {

  heroes: Hero[];

  // No longer in use
  selectedHero: Hero;

  /**
   * Injects HeroService
   * The parameter simultaneously defines a private heroService property and
   * identifies it as a HeroService injection site.
   * When Angular creates a HeroesComponent, the Dependency Injection system
   * sets the heroService parameter to the singleton instance of HeroService
   * @param heroService 
   */
  constructor(private heroService: HeroService) { }

  // getHeroes(): void {
  //  this.heroes = this.heroService.getHeroes();
  // }

  getHeroes(): void {
    // The new version waits for the Observable to emit the array of heroes— which could happen 
    // now or several minutes from now. Then subscribe passes the emitted array to the callback, 
    // which sets the component's heroes property.
    // http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#instance-method-subscribe
    // Callbacks provided to subscribe are not guaranteed to be called asynchronously. 
    // It is an Observable itself that decides when these functions will be called. 
    // For example of by default emits all its values synchronously.
    this.heroService.getHeroes()
        .subscribe(heroes => this.heroes = heroes);
  }

  ngOnInit() {
    this.getHeroes();
  }

  // No longer in use
  onSelect(hero: Hero): void {
    this.selectedHero = hero;
  }

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.heroService.addHero({ name } as Hero)
      .subscribe(hero => {
        this.heroes.push(hero);
      });
  }

  delete(hero: Hero): void {
    this.heroes = this.heroes.filter(h => h !== hero);
    this.heroService.deleteHero(hero).subscribe();
  }
}