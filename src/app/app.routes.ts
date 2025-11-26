import { Routes } from '@angular/router';
import { AuthGuardService } from './services/auth-gaurd.service';

export const routes: Routes = [
	{ path: "", redirectTo: "user-info", pathMatch: "full" },
	{ path: "login", loadComponent: () => import('./authentication/login/login').then(c => c.Login), data: { title: "Login Page", animation: 'LoginPage' } },
	{ path: "register", loadComponent: () => import('./authentication/register/register').then(c => c.Register), data: { title: "Register Page", animation: 'RegisterPage' } },
	{
		path: "",
		canActivate: [AuthGuardService],
		data: { animation: 'Shell' },
		loadComponent: () => import('./container/default-layout/main-container').then(c => c.MainContainer),
		children: [
			{
				path: "home", loadComponent: () => import('./views/home/home').then(c => c.Home), data: { title: "Home Page", animation: 'HomePage' }
			},
			{
				path: "user-info", loadComponent: () => import('./views/user-info/user-info').then(c => c.UserInfo), data: { title: "User Info Page", animation: 'UserInfoPage' }
			}
		]
	}
];
