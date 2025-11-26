import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AutosizeModule } from 'ngx-autosize';
import { AuthenticationService } from '../../services/authentication.service';
import { UserInfoStructure } from '../../utility/interfaces/general';
import { ToastrService } from 'ngx-toastr';

@Component({
	selector: 'app-user-info',
	imports: [CommonModule, ReactiveFormsModule, AutosizeModule],
	templateUrl: './user-info.html',
	styleUrl: './user-info.scss',
})
export class UserInfo {
	userInfoForm!: FormGroup;
	public formBuilder = inject(FormBuilder);
	userDetailSubmit = signal(false);
	formSubmitStatus = signal<boolean>(false);
	private authService = inject(AuthenticationService);
	private router = inject(Router);
	private toastr = inject(ToastrService);

	qualifications: string[] = [
		"High School",
		"Secondary School Certificate (SSC)",
		"Higher Secondary / 12th Grade",
		"Intermediate / Pre-University",
		"Diploma",
		"Associate Degree",
		"Bachelor of Arts (B.A.)",
		"Bachelor of Science (B.Sc.)",
		"Bachelor of Commerce (B.Com)",
		"Bachelor of Engineering / Technology (B.E./B.Tech)",
		"Bachelor of Business Administration (BBA)",
		"Bachelor of Fine Arts (BFA)",
		"Bachelor of Computer Applications (BCA)",
		"Master of Arts (M.A.)",
		"Master of Science (M.Sc.)",
		"Master of Commerce (M.Com)",
		"Master of Business Administration (MBA)",
		"Master of Technology (M.Tech)",
		"Master of Computer Applications (MCA)",
		"Master of Fine Arts (MFA)",
		"Doctor of Philosophy (Ph.D.)",
		"Doctor of Business Administration (DBA)",
		"Doctor of Education (Ed.D.)",
		"Professional Certification (e.g., CA, CPA, PMP, CSM, CCNA)"
	];

	roles: string[] = [
		"Admin",
		"User",
		"Manager",
		"Developer",
		"Team Lead",
		"Project Manager",
		"Designer",
		"QA Engineer",
		"DevOps Engineer",
		"Business Analyst",
		"HR",
		"Finance",
		"Support",
		"Intern",
		"Consultant"
	];

	countries: string[] = [
		"India",
		"United States",
		"United Kingdom",
		"Canada",
		"Australia",
		"Germany",
		"France",
		"Italy",
		"Spain",
		"Netherlands",
		"Sweden",
		"Switzerland",
		"Japan",
		"China",
		"Singapore",
		"South Korea",
		"New Zealand",
		"Brazil",
		"Mexico",
		"South Africa"
	];

	states: string[] = [
		"Andhra Pradesh",
		"Arunachal Pradesh",
		"Assam",
		"Bihar",
		"Chhattisgarh",
		"Goa",
		"Gujarat",
		"Haryana",
		"Himachal Pradesh",
		"Jharkhand",
		"Karnataka",
		"Kerala",
		"Madhya Pradesh",
		"Maharashtra",
		"Manipur",
		"Meghalaya",
		"Mizoram",
		"Nagaland",
		"Odisha",
		"Punjab",
		"Rajasthan",
		"Sikkim",
		"Tamil Nadu",
		"Telangana",
		"Tripura",
		"Uttar Pradesh",
		"Uttarakhand",
		"West Bengal",
		"Andaman and Nicobar Islands",
		"Chandigarh",
		"Dadra and Nagar Haveli and Daman & Diu",
		"Delhi",
		"Jammu and Kashmir",
		"Ladakh",
		"Lakshadweep",
		"Puducherry"
	];


	constructor() {
		this.checkMandatoryDataInSession();
	}

	checkMandatoryDataInSession(): void {
		const mandatoryDataFound = sessionStorage.getItem('mandatoryDataFound');
		if (mandatoryDataFound !== 'true') {
		} else {
			this.router.navigate(['/home']);
		}
	}

	ngOnInit(): void {

		this.userInfoForm = this.formBuilder.group({
			qualification: ["", Validators.required],
			role: ["", Validators.required],
			experience: ["", Validators.required],
			skills: ["", Validators.required],
			address: this.formBuilder.group({
				street: ["", [Validators.required, Validators.maxLength(100), Validators.minLength(10)]],
				city: ["", [Validators.required, Validators.maxLength(40), Validators.minLength(4)]],
				state: ["", Validators.required],
				country: ["", Validators.required],
				pincode: ["", [Validators.required, Validators.maxLength(6), Validators.minLength(6), Validators.pattern("^[0-9]{6}$")]] // 6-digit pincode
			})
		});

	}

	get f() {
		return this.userInfoForm.controls;
	}

	get address() {
		return (this.userInfoForm.get('address') as FormGroup).controls;
	}

	submitUserInfo() {
		this.userDetailSubmit.set(true);
		this.userInfoForm.markAllAsTouched();

		if (this.userInfoForm.invalid) {
			return;
		} else {

			const userData: UserInfoStructure = {
				qualification: this.f['qualification'].value,
				role: this.f['role'].value,
				experience: this.f['experience'].value,
				skills: this.f['skills'].value,
				address: {
					street: this.address['street'].value,
					city: this.address['city'].value,
					state: this.address['state'].value,
					country: this.address['country'].value,
					pincode: this.address['pincode'].value
				}
			};

			this.createUserInfo(userData);


		}

	}

	createUserInfo(data: UserInfoStructure) {
		this.formSubmitStatus.set(true);

		this.authService.createUserInfo(data).subscribe({
			next: (response: any) => {
				if (response.status == 200 || response.status == 201) {
					this.toastr.success('User information saved successfully!', 'Success', { closeButton: true, timeOut: 5000, progressBar: true });
					sessionStorage.setItem('mandatoryDataFound', 'true');
					this.router.navigate(['/home']);
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
}
