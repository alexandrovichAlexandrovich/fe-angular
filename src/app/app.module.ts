import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {HttpClientModule} from '@angular/common/http';
import { UnitSpritesComponent } from './unit-sprites/unit-sprites.component';
import { InfoDialogComponent } from './info-dialog/info-dialog.component';

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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
