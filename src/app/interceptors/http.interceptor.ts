import { HttpInterceptorFn } from '@angular/common/http';
import { inject, signal } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {

	const PUBLIC_ENDPOINTS: any = ['/public-kpi'];
	const authService = inject(AuthenticationService);
	const token = authService.getAuthToken();

	/**
	 * Identify whether API is public or private.
	 * Example logic:
	 * - Public: URLs containing `/public-kpi`
	 * - Private: everything else
	 */
	const isPublicApi = PUBLIC_ENDPOINTS.some((url: string) => req.url.includes(url));

	// ✅ Case 1: Public API → do NOT attach token
	if (isPublicApi) {
		return next(req);
	}

	// // ✅ Case 2: Private API → must be logged in
	// if (!authService.isUserLoggedIn()) {
	// 	// You could optionally redirect to login
	// 	authService.logOut();
	// 	return next(req); // or throwError(() => new Error('Not logged in'));
	// }

	// ✅ Case 3: Private API + logged in → attach token
	const modifiedReq = token
		? req.clone({
			setHeaders: {
				Authorization: `Bearer ${token}`,
			},
		})
		: req;

	return next(modifiedReq);
};
