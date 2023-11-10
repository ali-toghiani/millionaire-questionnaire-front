import { Routes } from '@angular/router';
import {FeaturesPathsEnum} from "./enums/features-paths.enum";

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: FeaturesPathsEnum.AUTHORIZATION
  },
  {
    path: FeaturesPathsEnum.AUTHORIZATION,
    loadChildren: () => import('./features/authorization/authorization.module').then(m => m.AuthorizationModule)
  }
];
