import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { MenuComponent } from './menu/menu.component';
import { HeroComponent } from './hero/hero.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    HeroComponent   
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes)   
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
