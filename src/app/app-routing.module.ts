import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublisherComponent } from './publisher/publisher.component';

const routes: Routes = [
  {
    path: 'publisher',
    component: PublisherComponent,
  },
  { path: '**', redirectTo: '/publisher' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
