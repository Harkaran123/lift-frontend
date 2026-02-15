import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LiftListComponent } from './components/lift-list/lift-list.component';
import { LiftFormComponent } from './components/lift-form/lift-form.component';
import { LiftDetailComponent } from './components/lift-detail/lift-detail.component';
import { AlertRecipientListComponent } from './components/alert-recipient-list/alert-recipient-list.component';
import { AlertRecipientFormComponent } from './components/alert-recipient-form/alert-recipient-form.component';

const routes: Routes = [
  { path: '', redirectTo: '/lifts', pathMatch: 'full' },
  { path: 'lifts', component: LiftListComponent },
  { path: 'lifts/new', component: LiftFormComponent },
  { path: 'lifts/:id', component: LiftDetailComponent },
  { path: 'lifts/:id/edit', component: LiftFormComponent },
  { path: 'alert-recipients', component: AlertRecipientListComponent },
  { path: 'alert-recipients/new', component: AlertRecipientFormComponent },
  { path: 'alert-recipients/:id/edit', component: AlertRecipientFormComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
