import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Login } from './components/auth/login/login';
import { Signup } from './components/auth/signup/signup';
import { authGuard } from './guards/auth/auth-guard';

export const routes: Routes = [
    { path: 'signup', component: Signup},
    { path: 'login', component: Login},
    { path: 'home', 
      component: Home,
      canActivate: [ authGuard ] }
];
