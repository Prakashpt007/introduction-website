import { Component } from '@angular/core';
import { ColorModeComponent } from "../color-mode/color-mode.component";

@Component({
	selector: 'app-public-header',
	imports: [ColorModeComponent],
	templateUrl: './public-header.html',
	styleUrl: './public-header.scss',
})
export class PublicHeader {

}
