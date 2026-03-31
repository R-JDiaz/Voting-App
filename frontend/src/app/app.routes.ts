import { Routes } from '@angular/router';
import { ElContainer } from './components/elections/el-container/el-container';
import { Home } from './components/home/home';
import { Login } from './components/auth/login/login';
import { Signup } from './components/auth/signup/signup';

export const routes: Routes = [
    { path: '', component: Signup},
    { path: 'home', component: Home}
];
