export interface UserRegister {
	fName: string;
	lName: string;
	dob: string;
	email: string;
	mobile: string | number;
	password: string;
}


export interface UserInfoStructure {
	qualification: string;
	role: string;
	experience: string;
	skills: string;
	address: Address
}

interface Address {
	street: string;
	city: string;
	state: string;
	country: string;
	pincode: string | number;
}


export interface UserInfoToDisplayStructure {
	id?: number,
	f_Name: string;
	l_Name: string;
	dob: string;
	email: string;
	mobile: string | number;
	user_id: string;
	qualification: string;
	role: string;
	experience: string;
	skills: string;
	street: string;
	city: string;
	state: string;
	country: string;
	pincode: string | number;
}