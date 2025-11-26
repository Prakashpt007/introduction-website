import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from './authentication.service';

@Injectable({
	providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

	constructor(
		private authService: AuthenticationService,
		private toastr: ToastrService,
		private router: Router
	) { }

	canActivate(): boolean | UrlTree {
		if (!this.authService.isUserLoggedIn()) {
			this.toastr.info('Please log in!');
			return this.router.parseUrl('/login');
		}

		if (!this.authService.isUserSessionValid()) {
			this.toastr.warning('Session expired. Please log in again.');
			return this.router.parseUrl('/login');
		}

		// logged in and session valid
		return true;
	}
}