import { Injectable } from '@angular/core';
import {GameLoopService} from "./gameloop.service";

@Injectable({
  providedIn: 'root'
})
export class SpritesService {

  constructor() { }

  game: GameLoopService;

  setGame(service: GameLoopService) {
    this.game = service;
  }
}
