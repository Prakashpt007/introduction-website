import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { ColorModeComponent } from "../color-mode/color-mode.component";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AuthenticationService } from '../../services/authentication.service';

@Component({
	selector: 'app-header',
	imports: [ColorModeComponent],
	templateUrl: './header.html',
	styleUrl: './header.scss',
})
export class Header {
	readonly logoutConfirmation = viewChild.required<ElementRef>("logoutConfirmation");
	private modalService = inject(NgbModal);
	private authService = inject(AuthenticationService);


	confirmLogout(): void {
		this.modalService.open(this.logoutConfirmation(), {
			size: 'md', scrollable: false, centered: false, backdrop: true
		}).result.then(
			() => this.logout(),
			() => { }
		);
	}

	logout(): void {
		this.authService.logOut();
	}

}
