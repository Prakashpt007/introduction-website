import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { GenericHttpService } from '../../services/generic-http.service';
import { CommonModule } from '@angular/common';
import { UserInfoToDisplayStructure } from '../../utility/interfaces/general';
import { single } from 'rxjs';

@Component({
	selector: 'app-home',
	imports: [CommonModule],
	templateUrl: './home.html',
	styleUrl: './home.scss',
})
export class Home {
	private router = inject(Router);
	private toastr = inject(ToastrService);
	private genHttpService = inject(GenericHttpService);

	homePageDataStatus: boolean = false;
	// pageData: UserInfoToDisplayStructure = {
	// 	"id": 33,
	// 	"f_Name": "kunal02",
	// 	"l_Name": "ukirde",
	// 	"dob": "2025-11-26T00:00:00.000Z",
	// 	"email": "kunal04@gmail.com",
	// 	"mobile": "8989898989",
	// 	"user_id": "33",
	// 	"qualification": "B.Tech",
	// 	"role": "Admin",
	// 	"experience": "2.2",
	// 	"skills": "Angular, TypeScript, Docker",
	// 	"street": "123 Main St",
	// 	"city": "Pune",
	// 	"state": "Maharashtra",
	// 	"country": "India",
	// 	"pincode": "400001"
	// };


	pageData = signal<UserInfoToDisplayStructure>({
		"id": 33,
		"f_Name": "",
		"l_Name": "",
		"dob": "",
		"email": "",
		"mobile": "",
		"user_id": "",
		"qualification": "",
		"role": "",
		"experience": "",
		"skills": "",
		"street": "",
		"city": "",
		"state": "",
		"country": "",
		"pincode": ""
	});

	constructor() {
		this.checkMandatoryDataInSession();
	}

	checkMandatoryDataInSession(): void {
		const mandatoryDataFound = sessionStorage.getItem('mandatoryDataFound');
		if (mandatoryDataFound !== 'true') {
			this.toastr.info('Please complete your profile information.', 'Info', { closeButton: true, timeOut: 10000, progressBar: true });
			this.router.navigate(['/user-info']);
		} else {
			this.getUserInfo();
		}
	}


	getUserInfo(): void {
		// Logic to retrieve and display user information

		this.genHttpService.getDetailsByUrl('user-info').subscribe({

			next: (response: any) => {
				if (response.status == 200 || response.status == 304) {
					// User information retrieved successfully
					this.pageData.set(response.data); // Use this data as needed

					this.homePageDataStatus = true;
				} else {
					this.toastr.error(response.message, `${response.status} Error`, { closeButton: true, timeOut: 10000, progressBar: true });
					this.homePageDataStatus = false;
				}
			},
			error: (err: any) => {
				this.toastr.error(err.error.message, `${err.error.status} Error`, { closeButton: true, timeOut: 10000, progressBar: true });
				this.homePageDataStatus = false;

			},
			complete: () => {
				// console.log("completed");
			},
		});
	}
}