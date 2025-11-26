interface SubMenuItem {
	order?: any;
	name: string;
	href: string;
	icon: string;
	activity?: string[];
	status?: string | boolean; // Add status property
}

interface MenuItem {
	order?: any;
	mainMenu: string;
	href: string;
	icon: string;
	activity?: string[];
	subMenu: SubMenuItem[];
	status?: boolean; // Add status property
}