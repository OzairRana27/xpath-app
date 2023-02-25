import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { ProxyComponentComponent } from './proxy-component/proxy-component.component';
import { SafePipe } from './safe.pipe';
import { ClickCatchDirectiveDirective } from './click-catch-directive.directive';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ProxyComponentComponent,
    SafePipe,
    ClickCatchDirectiveDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
