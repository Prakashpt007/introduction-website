import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { jwtDecode } from 'jwt-decode';
import { UserInfoStructure, UserRegister } from '../utility/interfaces/general';

@Injectable({
	providedIn: 'root',
})
export class AuthenticationService {
	private http = inject(HttpClient);
	private router = inject(Router);
	private toastr = inject(ToastrService);

	baseUrl = environment.baseUrl;
	loginUrl = `${environment.baseUrl}/auth/login`;
	registerUrl = `${environment.baseUrl}/auth/register`;
	userInfoUrl = `${environment.baseUrl}/user-info`;

	handleError(error: HttpErrorResponse) {
		let errorMessage = {
			errorStatusCode: "",
			errorMessage: "",
		};
		if (error.error instanceof ErrorEvent) {
			errorMessage = {
				errorStatusCode: "",
				errorMessage: `${error.error.message}`,
			};
		} else {
			errorMessage = {
				errorStatusCode: `${error.status}`,
				errorMessage: `${error.message}`,
			};

			// `Error Code: ${error.status}\nMessage: ${error.message}`;
		}
		return throwError(() => {
			// return errorMessage;
			return error;
		});
	}

	authenticate(email: string, password: string) {
		return this.http.post<any>(this.loginUrl, { email, password }).pipe(
			map((data) => {

				sessionStorage.setItem('tokenAccess', data.token);
				sessionStorage.setItem('expires_in', `${this.getExpiryTime()}`);
				return data;
			})
		);
	}


	// createUser(data: any) {
	// 	return this.httpClient.post<any>(this.registerUrl, data).pipe(
	// 		map((response) => {
	// 			return response;
	// 		}),
	// 		catchError(this.handleError)
	// 	);
	// }
	createUser(data: UserRegister): Observable<any> {
		return this.http.post<any>(this.registerUrl, data).pipe(catchError(this.handleError));
	}

	createUserInfo(data: UserInfoStructure): Observable<any> {
		return this.http.post<any>(this.userInfoUrl, data).pipe(catchError(this.handleError));
	}

	getExpiryTime() {
		const date = new Date();
		date.setHours(date.getHours() + 1); // adds 1 hour
		return date;
	}

	isUserLoggedIn(): boolean {
		return !!sessionStorage?.getItem("tokenAccess");
	}


	getAuthToken() {
		return sessionStorage.getItem('tokenAccess');
	}

	logOut(): void {
		sessionStorage.clear();
		this.router.navigate(['/login']);
	}

	isUserSessionValid(): boolean {
		const session = sessionStorage.getItem('expires_in');
		if (!session) {
			return false; // no expiry -> invalid
		}

		const sessionDate = new Date(session);
		const currentDate = new Date();

		return sessionDate.getTime() > currentDate.getTime();
	}

}
