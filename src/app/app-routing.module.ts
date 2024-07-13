import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { PayComponent } from './pay/pay.component';
import { TipComponent } from './tip/tip/tip.component';
import { SucessComponent } from './tip/sucess/sucess.component';


const routes: Routes = [
  { path: '', component: PayComponent },
  { path: 'tip', component: TipComponent },
  { path: 'order/:id', component: SucessComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
