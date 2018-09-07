import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {HttpClientModule} from '@angular/common/http';
import { UnitSpritesComponent } from './unit-sprites/unit-sprites.component';
import { InfoDialogComponent } from './info-dialog/info-dialog.component';
import {GameLoopService} from "./gameloop.service";

@NgModule({
  declarations: [
    AppComponent,
    UnitSpritesComponent,
    InfoDialogComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [GameLoopService],
  bootstrap: [AppComponent]
})
export class AppModule { }
