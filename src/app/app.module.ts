import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LiftListComponent } from './components/lift-list/lift-list.component';
import { LiftFormComponent } from './components/lift-form/lift-form.component';
import { LiftDetailComponent } from './components/lift-detail/lift-detail.component';
import { AlertRecipientListComponent } from './components/alert-recipient-list/alert-recipient-list.component';
import { AlertRecipientFormComponent } from './components/alert-recipient-form/alert-recipient-form.component';

@NgModule({
  declarations: [
    AppComponent,
    LiftListComponent,
    LiftFormComponent,
    LiftDetailComponent,
    AlertRecipientListComponent,
    AlertRecipientFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
