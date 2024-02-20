import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { PayComponent } from './pay/pay.component';
import { TipComponent } from './tip/tip/tip.component';


const routes: Routes = [
  { path: '', component: PayComponent },
  { path: 'tip', component: TipComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
