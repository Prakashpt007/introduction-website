// import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

// export default class Validation {
// 	static match(controlName: string, checkControlName: string): ValidatorFn {
// 		return (formGroup: AbstractControl): ValidationErrors | null => {
// 			const control = formGroup.get(controlName);
// 			const matchingControl = formGroup.get(checkControlName);

// 			if (!control || !matchingControl) return null;

// 			// Avoid overwriting other errors
// 			const errors = matchingControl.errors || {};

// 			if (control.value !== matchingControl.value) {
// 				// Set the `matching` error
// 				errors['matching'] = true;
// 				matchingControl.setErrors(errors);
// 			} else {
// 				// Remove only the `matching` error if present
// 				if ('matching' in errors) {
// 					delete errors['matching'];

// 					// If there are no other errors, clear the error object
// 					if (Object.keys(errors).length === 0) {
// 						matchingControl.setErrors(null);
// 					} else {
// 						matchingControl.setErrors(errors);
// 					}
// 				}
// 			}

// 			return null;
// 		};
// 	}
// }


// export default class Validation {
// 	static match(controlName: string, checkControlName: string): ValidatorFn {
// 		return (controls: AbstractControl) => {
// 			const control = controls.get(controlName);
// 			const checkControl = controls.get(checkControlName);
// 			if (checkControl?.errors && !checkControl.errors['matching']) {
// 				return null;
// 			}
// 			if (control?.value !== checkControl?.value) {
// 				controls.get(checkControlName)?.setErrors({ matching: true });
// 				return { matching: true };
// 			} else {
// 				return null;
// 			}
// 		};
// 	}
// }


import { AbstractControl, ValidatorFn } from '@angular/forms';

export default class Validation {
	static match(controlName: string, checkControlName: string): ValidatorFn {
		return (group: AbstractControl): { [key: string]: any } | null => {
			const control = group.get(controlName);
			const checkControl = group.get(checkControlName);

			if (!control || !checkControl) {
				return null;
			}

			// if another validator has already found an error on the matching control
			if (checkControl.errors && !checkControl.errors['matching']) {
				return null;
			}

			// set error if validation fails
			if (control.value !== checkControl.value) {
				checkControl.setErrors({ matching: true });
				return { matching: true };
			} else {
				checkControl.setErrors(null);
				return null;
			}
		};
	}
}
