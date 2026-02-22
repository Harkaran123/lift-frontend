import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LiftListComponent } from './components/lift-list/lift-list.component';
import { LiftFormComponent } from './components/lift-form/lift-form.component';
import { LiftDetailComponent } from './components/lift-detail/lift-detail.component';
import { AlertRecipientListComponent } from './components/alert-recipient-list/alert-recipient-list.component';
import { AlertRecipientFormComponent } from './components/alert-recipient-form/alert-recipient-form.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/lifts', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'lifts', component: LiftListComponent, canActivate: [AuthGuard] },
  { path: 'lifts/new', component: LiftFormComponent, canActivate: [AuthGuard] },
  { path: 'lifts/:id', component: LiftDetailComponent, canActivate: [AuthGuard] },
  { path: 'lifts/:id/edit', component: LiftFormComponent, canActivate: [AuthGuard] },
  { path: 'alert-recipients', component: AlertRecipientListComponent, canActivate: [AuthGuard] },
  { path: 'alert-recipients/new', component: AlertRecipientFormComponent, canActivate: [AuthGuard] },
  { path: 'alert-recipients/:id/edit', component: AlertRecipientFormComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
