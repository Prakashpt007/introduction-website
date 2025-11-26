import { inject, Injectable } from '@angular/core';
import { environment } from "../../environments/environment";
import { catchError, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';
import { ToastrService } from 'ngx-toastr';
import { UserRegister } from '../utility/interfaces/general';

@Injectable({
	providedIn: 'root'
})
export class GenericHttpService {
	toastr = inject(ToastrService);
	baseUrl: string = environment.baseUrl;
	userInfoUrl = `${environment.baseUrl}/user-info`;
	private http = inject(HttpClient);
	private authService = inject(AuthenticationService);

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



	constructor() {
		// this.authService.isUserLoggedIn();
	}

	// Get Details By URL using GET method
	getDetailsByUrl(url: string): Observable<any> {
		return this.http.get<any>(this.baseUrl + "/" + url).pipe(catchError(this.handleError));
	}
}