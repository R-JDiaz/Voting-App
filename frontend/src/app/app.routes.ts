import { Routes } from '@angular/router';
import { ElContainer } from './components/elections/el-container/el-container';
import { Home } from './components/home/home';
import { Login } from './components/auth/login/login';
import { Signup } from './components/auth/signup/signup';

export const routes: Routes = [
    { path: 'signup', component: Signup},
    { path: '', component: Login},
    { path: 'home', component: Home}
];
