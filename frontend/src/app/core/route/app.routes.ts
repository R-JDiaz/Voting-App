import { Routes } from '@angular/router';
import { Login } from '@features/auth/pages/login/login';
import { Signup } from '@features/auth/pages/signup/signup';
import { Home } from '@features/layouts/home/home';
import { AdminMenu } from '@features/user/pages/menu/menu';

export const routes: Routes = [
    { path: 'signup', component: Signup},
    { path: 'login', component: Login},
    { path: 'home', 
      component: Home,
      //canActivate: [ authGuard] 
    },
    {
      path: 'menu',
      component: AdminMenu
      //canActivate: [ authGuard]
    },
    { 
      path: '**', 
      redirectTo: 'login', 
      pathMatch: 'full' 
    }
];

