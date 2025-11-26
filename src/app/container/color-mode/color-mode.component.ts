import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppState, changesAppTheme } from '../../utility/store/store.reducer';
import { Store } from '@ngrx/store';

@Component({
	selector: 'app-color-mode',
	imports: [CommonModule],
	templateUrl: './color-mode.component.html',
	styleUrl: './color-mode.component.scss'
})
export class ColorModeComponent {
	private store = inject(Store<AppState>);

	theme!: string;
	private mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
	ngOnInit(): void {
		this.setTheme(this.getPreferredTheme());

		// window
		// 	.matchMedia("(prefers-color-scheme: dark)")
		// 	.addEventListener("change", () => {
		// 		const storedTheme = this.getStoredTheme();
		// 		if (storedTheme !== "light" && storedTheme !== "dark") {
		// 			this.setTheme(this.getPreferredTheme());
		// 		}
		// 	});
		// Add listener for system theme changes
		this.mediaQueryList.addEventListener('change', this.handleSystemThemeChange.bind(this));
	}

	getStoredTheme() {
		// console.log(localStorage.getItem("theme"));
		if (localStorage.getItem("theme") == null) {
			this.changeTheme("auto");
		}

		return localStorage.getItem("theme");
	}

	setStoredTheme(theme: any) {
		localStorage.setItem("theme", theme);
	}

	getPreferredTheme() {
		const storedTheme = this.getStoredTheme();
		if (storedTheme) {
			return storedTheme;
		}

		return window.matchMedia("(prefers-color-scheme: dark)").matches
			? "dark"
			: "light";
	}

	setTheme(theme: any) {
		if (theme === "auto" && window.matchMedia("(prefers-color-scheme: dark)").matches) {

			this.theme = "auto";
			document.documentElement.setAttribute("data-bs-theme", "dark");
			this.store.dispatch(changesAppTheme({ theme: 'dark' }));
			this.applyThemeFile('dark');

		} else if (theme === "auto" && window.matchMedia("(prefers-color-scheme: light)").matches) {

			this.theme = "auto";
			document.documentElement.setAttribute("data-bs-theme", "light");
			this.store.dispatch(changesAppTheme({ theme: theme }));
			this.applyThemeFile('light');

		} else {

			this.theme = theme;
			document.documentElement.setAttribute("data-bs-theme", theme);
			this.store.dispatch(changesAppTheme({ theme: theme }));
			this.applyThemeFile(theme);
		}
	}

	changeTheme(theme: string) {
		this.setStoredTheme(theme);
		this.setTheme(theme);
	}


	// Toggle theme
	toggleTheme() {
		const modes = ['light', 'dark', 'auto'];
		const currentIndex = modes.indexOf(this.theme);
		const nextTheme = modes[(currentIndex + 1) % modes.length];
		this.changeTheme(nextTheme);
	}

	handleSystemThemeChange(event: MediaQueryListEvent) {
		if (this.theme === 'auto') {
			const systemTheme = event.matches ? 'dark' : 'light';
			document.documentElement.setAttribute('data-bs-theme', systemTheme);

			this.applyThemeFile(systemTheme);
		}
	}
	applyThemeFile(theme: string) {
		// Add blur class to body before switching theme
		document.body.classList.add('blurAction');
		document.body.classList.add('blur');

		// Create new link for the selected theme
		const newLink = document.createElement('link');
		newLink.id = 'app-theme-new'; // temporary id
		newLink.rel = 'stylesheet';
		newLink.href = `${theme}-theme.css`;

		// When the new theme is loaded
		newLink.onload = () => {
			// Remove old theme link if exists
			const oldLink = document.getElementById('app-theme');
			if (oldLink) {
				oldLink.remove();
			}

			// Rename new link to 'app-theme'
			newLink.id = 'app-theme';

			// Remove blur class
			setTimeout(() => {
				document.body.classList.remove('blur');
			}, 1000);
		};

		// Append new theme first
		document.head.appendChild(newLink);
	}


}
