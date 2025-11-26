import {
	ChangeDetectorRef,
	Component,
	computed,
	ElementRef,
	inject,
	signal,
	viewChild,
	effect,
	OnDestroy,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { Header } from '../header/header';

@Component({
	selector: 'app-main-container',
	standalone: true,
	imports: [RouterModule, Header],
	templateUrl: './main-container.html',
	styleUrls: ['./main-container.scss'],
})
export class MainContainer implements OnDestroy {
	readonly headerContainer = viewChild.required<ElementRef>('headerContainer');
	private cdRef = inject(ChangeDetectorRef);

	private fullHeight = signal(window.innerHeight);
	public headerHeight = signal(0);
	private marginBelowProfile = 1;

	// Dynamically computed middle height
	middleHeight = computed(() =>
		this.fullHeight() - this.headerHeight() - this.marginBelowProfile
	);

	private resizeListener = () => {
		this.fullHeight.set(window.innerHeight);
		this.updateDynamicHeights();
	};

	ngAfterViewInit(): void {
		this.cdRef.detectChanges();
		setTimeout(() => {

			this.updateDynamicHeights();
		}, 1);

		// Listen to window resize events
		window.addEventListener('resize', this.resizeListener);
	}

	private updateDynamicHeights(): void {
		const header = document.querySelector('header');
		this.headerHeight.set(header?.clientHeight || 0);
	}

	ngOnDestroy(): void {
		window.removeEventListener('resize', this.resizeListener);
	}
}
