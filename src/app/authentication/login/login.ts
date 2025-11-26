import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { email } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { PublicHeader } from "../../container/public-header/public-header";

@Component({
	selector: 'app-login',
	imports: [RouterLink, CommonModule, ReactiveFormsModule, PublicHeader],
	templateUrl: './login.html',
	styleUrl: './login.scss',
})
export class Login {
	loginForm!: FormGroup;
	private authService = inject(AuthenticationService);
	public formBuilder = inject(FormBuilder);
	userDetailSubmit = signal(false);
	private router = inject(Router);
	private toastr = inject(ToastrService);

	formSubmitStatus = signal<boolean>(false);
	passwordShow = signal("password");


	constructor() {

		const tokenAccess = sessionStorage.getItem("tokenAccess");
		if (tokenAccess) {
			this.router.navigate(["/home"]);
		} else {
			// this.router.navigate(["/login"]);
		}
	}

	ngOnInit(): void {

		this.loginForm = this.formBuilder.group({
			email: ["devUser@gmail.com", [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net|org|edu|gov|info|biz|co|us|uk|ca|au|in|de|cn|jp|ai|blog|tech|online|app|io)$/), Validators.minLength(6), Validators.maxLength(100)]],
			password: ["123456", [Validators.required, Validators.minLength(5), Validators.maxLength(25)]]
		});
	}

	ngAfterViewInit(): void {
		// this.checkTokenInSession();
	}
	get f(): { [key: string]: AbstractControl; } {
		// return this.form.controls;
		return this.loginForm.controls;
	}


	submitLoginDetails() {
		this.userDetailSubmit.set(true);

		if (this.loginForm.invalid) {
			return;
		} else {
			this.loginUser(this.f["email"].value, this.f["password"].value);
		}
	}
	passToggle() {
		if (this.passwordShow() == "password") {
			this.passwordShow.update((value) => value = "text");
		} else {
			this.passwordShow.update((value) => value = "password");
		}
	}

	loginUser(email: string, password: string) {
		this.formSubmitStatus.set(true);

		this.authService.authenticate(email, password).subscribe({
			next: (response: any) => {

				sessionStorage.setItem('mandatoryDataFound', response.mandatoryDataFound);

				if (response.status == 200 && response.mandatoryDataFound) {
					if (response.token !== undefined && response.token != '') {
						this.checkTokenInSession();
					}
				} else if (response.status == 200 && !response.mandatoryDataFound) {
					this.toastr.info('Please complete your profile information.', 'Info', { closeButton: true, timeOut: 10000, progressBar: true });
					this.router.navigate(['/user-info']);
				} else {

					this.toastr.error(response.message, `${response.status} Error`, { closeButton: true, timeOut: 10000, progressBar: true });
				}

				this.formSubmitStatus.set(false);

			},
			error: (err: any) => {
				this.toastr.error(err.error.message, `${err.error.status} Error`, { closeButton: true, timeOut: 10000, progressBar: true });
				this.formSubmitStatus.set(false);
			},
			complete: () => {
				// console.log("completed");
			},
		});
	}


	checkTokenInSession() {
		const tokenAccess = sessionStorage.getItem("tokenAccess");
		if (tokenAccess) {
			this.router.navigate(["/home"]);
		} else {
			this.router.navigate(["/login"]);
		}
	}

}
