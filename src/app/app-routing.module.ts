import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgentComponent } from './agent/agent.component';
import { PublisherComponent } from './publisher/publisher.component';

const routes: Routes = [
  {
    path: 'publisher',
    component: PublisherComponent,
  },
  {
    path: 'agent',
    component: AgentComponent,
  },
  { path: '**', redirectTo: '/publisher' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
