import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import Validation from '../../utility/store/validation';
import { Subscription } from 'rxjs';
import { AuthenticationService } from '../../services/authentication.service';
import { UserRegister } from '../../utility/interfaces/general';
import { ToastrService } from 'ngx-toastr';
import { PublicHeader } from "../../container/public-header/public-header";
import { GenericHttpService } from '../../services/generic-http.service';

@Component({
	selector: 'app-register',
	imports: [RouterLink, CommonModule, ReactiveFormsModule, PublicHeader],
	templateUrl: './register.html',
	styleUrl: './register.scss',
})
export class Register {
	registerForm!: FormGroup;
	public formBuilder = inject(FormBuilder);
	userDetailSubmit = signal(false);
	passwordShow = "password";
	confirmPasswordShow = "password";
	formSubmitStatus = signal<boolean>(false);
	private authService = inject(AuthenticationService);
	private router = inject(Router);
	private toastr = inject(ToastrService);
	private genHttpService = inject(GenericHttpService);

	constructor() {

		const tokenAccess = sessionStorage.getItem("tokenAccess");
		if (tokenAccess) {
			this.router.navigate(["/home"]);
		} else {
			// this.router.navigate(["/login"]);
		}
	}


	ngOnInit(): void {
		this.registerForm = this.formBuilder.group({
			fName: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
			lName: ["", [Validators.required, Validators.minLength(3), Validators.maxLength(25)]],
			dob: ["", [Validators.required]],
			email: ["", [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net|org|edu|gov|info|biz|co|us|uk|ca|au|in|de|cn|jp|ai|blog|tech|online|app|io)$/), Validators.minLength(6), Validators.maxLength(100)]],
			mobile: ["", [Validators.pattern(/^[0-9]\d*$/), Validators.minLength(10), Validators.maxLength(10)]],
			password: ["", [Validators.required, Validators.minLength(6)]],
			terms: [false, [Validators.requiredTrue]],
			confirmPassword: ["", [Validators.required]]
		}, {
			validators: [Validation.match('password', 'confirmPassword')]
		});
	}


	get f(): { [key: string]: AbstractControl; } {
		// return this.form.controls;
		return this.registerForm.controls;
	}
	submitRegisterDetails() {
		this.userDetailSubmit.set(true);

		if (this.registerForm.invalid) {
			return;
		} else {
			// Registration logic to be implemented
			let registerData: UserRegister = {
				fName: this.registerForm.get('fName')?.value,
				lName: this.registerForm.get('lName')?.value,
				dob: this.registerForm.get('dob')?.value,
				email: this.registerForm.get('email')?.value,
				mobile: this.registerForm.get('mobile')?.value,
				password: this.registerForm.get('password')?.value,
			};
			this.registerUser(registerData);


		}
	}


	registerUser(data: UserRegister) {
		this.formSubmitStatus.set(true);


		this.authService.createUser(data).subscribe({
			next: (response: any) => {

				if (response.status == 200 || response.status == 201) {
					this.toastr.success('User Registered successfully!', 'Success', { closeButton: true, timeOut: 5000, progressBar: true });
				} else {
					this.toastr.error(response.message, `${response.status} Error`, { closeButton: true, timeOut: 10000, progressBar: true });
				}
				this.formSubmitStatus.set(false);

			},
			error: (err: any) => {
				// if (err.error.status === 422 || err.error.status === 404) {
				// 	this.toastr.error(err.error.message, `${err.error.status} Error`);
				// 	return;
				// } else {
				// 	this.toastr.error(err.error.message, `${err.error.status} Error`);
				// }
				this.formSubmitStatus.set(false);
				this.toastr.error(err.error.message, `${err.error.status} Error`, { closeButton: true, timeOut: 10000, progressBar: true });
			},
			complete: () => {
				// console.log("completed");
			},
		});
	}
}
