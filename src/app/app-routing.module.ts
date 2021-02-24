import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActivityErrorComponent } from './components/activity-error/activity-error.component';
import { LoginComponent } from './components/login/login.component';
import { StatusBoardComponent } from './components/status-board/status-board.component';

const routes: Routes = [
  
  {
    path: 'dashboard', component: StatusBoardComponent
  },
  {
    path: 'latest-error' , component : ActivityErrorComponent
  },
  {
    path : '**', component: LoginComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
