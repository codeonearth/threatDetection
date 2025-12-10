import { Component, OnInit, AfterViewInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImageLoaderService } from '../image-loader.service';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Typed from 'typed.js';

@Component({
  selector: 'app-home',
  // standalone: false,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class homeComponent implements OnInit, AfterViewInit {
  loginForm: FormGroup;
  logoUrl: string = '';

  private readonly RESPONSIVE_WIDTH = 1024;
  isHeaderCollapsed = window.innerWidth < this.RESPONSIVE_WIDTH;

  constructor(
    private formBuilder: FormBuilder,
    private imageLoader: ImageLoaderService,
    private renderer: Renderer2
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.loadLogo();
  }

  ngAfterViewInit(): void {
    this.initializeLandingPage();
    this.applyStoredTheme();
  }

  // ✅ Load Logo Image
  loadLogo() {
    const logoUrl = 'https://avatars.githubusercontent.com/u/124091983';
    this.imageLoader.loadImage(logoUrl).subscribe((blob: Blob) => {
      this.logoUrl = URL.createObjectURL(blob);
    });
  }

  // ✅ Form Submit Handler
  onSubmit(): void {
    if (this.loginForm.valid) {
      console.log('Login form submitted');
    }
  }

  // ✅ Toggle Dark / Light Mode
  toggleMode(): void {
    const toggleIcon = document.querySelector('#toggle-mode-icon');
    const html = document.documentElement;

    html.classList.toggle('tw-dark');

    if (html.classList.contains('tw-dark')) {
      toggleIcon?.classList.remove('bi-sun');
      toggleIcon?.classList.add('bi-moon');
      localStorage.setItem('color-mode', 'dark');
    } else {
      toggleIcon?.classList.add('bi-sun');
      toggleIcon?.classList.remove('bi-moon');
      localStorage.setItem('color-mode', 'light');
    }
  }

  // ✅ Toggle Header Collapse
  toggleHeader(): void {
    const collapseBtn = document.getElementById('collapse-btn');
    const collapseHeaderItems = document.getElementById('collapsed-header-items');

    if (!collapseBtn || !collapseHeaderItems) return;

    if (this.isHeaderCollapsed) {
      collapseHeaderItems.classList.add('max-lg:!tw-opacity-100', 'tw-min-h-[90vh]');
      collapseHeaderItems.style.height = '90vh';
      collapseBtn.classList.replace('bi-list', 'bi-x');
      document.body.classList.add('modal-open');
      this.isHeaderCollapsed = false;
    } else {
      collapseHeaderItems.classList.remove('max-lg:!tw-opacity-100', 'tw-min-h-[90vh]');
      collapseHeaderItems.style.height = '0vh';
      collapseBtn.classList.replace('bi-x', 'bi-list');
      document.body.classList.remove('modal-open');
      this.isHeaderCollapsed = true;
    }
  }

  // ✅ Initialize animations, typing effect, and responsive logic
  private initializeLandingPage(): void {
    // ---- Typed.js effect ----
    const typedElement = document.querySelector('#prompts-sample');
    if (typedElement) {
      new Typed('#prompts-sample', {
        strings: [
          "How to solve a rubik's cube? Step by step guide",
          "What's Pixa Playground?",
          'How to build an AI SaaS App?',
          'How to integrate Pixa API?'
        ],
        typeSpeed: 80,
        smartBackspace: true,
        loop: true,
        backDelay: 2000
      });
    }

    // ---- GSAP Animations ----
    gsap.registerPlugin(ScrollTrigger);
    gsap.to('#dashboard', {
      scale: 1,
      translateY: 0,
      rotateX: '0deg',
      scrollTrigger: {
        trigger: '#hero-section',
        start: window.innerWidth > this.RESPONSIVE_WIDTH ? 'top 95%' : 'top 70%',
        end: 'bottom bottom',
        scrub: 1
      }
    });

    // ---- FAQ Accordion ----
    const faqAccordion = document.querySelectorAll('.faq-accordion');
    faqAccordion.forEach(btn => {
      btn.addEventListener('click', () => {
        btn.classList.toggle('active');
        const content = (btn as HTMLElement).nextElementSibling as HTMLElement | null;
        const icon = btn.querySelector('.bi-plus') as HTMLElement | null;
        if (!content || !icon) return;

        if (content.style.maxHeight === '240px') {
          content.style.maxHeight = '0px';
          content.style.padding = '0px 18px';
          icon.style.transform = 'rotate(0deg)';
        } else {
          content.style.maxHeight = '240px';
          content.style.padding = '20px 18px';
          icon.style.transform = 'rotate(45deg)';
        }
      });
    });

    // ---- Responsive Behavior ----
    window.addEventListener('resize', () => {
      if (!this.isHeaderCollapsed) this.toggleHeader();
    });
  }

  // ✅ Apply theme from localStorage on page load
  private applyStoredTheme(): void {
    const html = document.documentElement;
    const savedTheme = localStorage.getItem('color-mode');
    if (
      savedTheme === 'dark' ||
      (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      html.classList.add('tw-dark');
    } else {
      html.classList.remove('tw-dark');
    }

    const toggleIcon = document.querySelector('#toggle-mode-icon');
    if (html.classList.contains('tw-dark')) {
      toggleIcon?.classList.remove('bi-sun');
      toggleIcon?.classList.add('bi-moon');
    } else {
      toggleIcon?.classList.add('bi-sun');
      toggleIcon?.classList.remove('bi-moon');
    }
  }

  
  toggleDropdown(index: number): void {
  const dropdownList = document.getElementById(`nav-dropdown-list-${index}`);
  const dropdownToggle = document.getElementById(`nav-dropdown-toggle-${index}`);
  if (!dropdownList || !dropdownToggle) return;

  const isOpen = dropdownList.getAttribute('data-open') === 'true';

  if (isOpen) {
    // Hide dropdown
    dropdownList.setAttribute('data-open', 'false');
    this.renderer.removeClass(dropdownList, 'tw-scale-100');
    this.renderer.removeClass(dropdownList, 'tw-opacity-100');
    this.renderer.addClass(dropdownList, 'tw-scale-0');
    this.renderer.addClass(dropdownList, 'tw-opacity-0');
    this.renderer.setStyle(dropdownList, 'maxHeight', '0px');
    this.renderer.setStyle(dropdownList, 'width', '0px');
  } else {
    // Show dropdown
    dropdownList.setAttribute('data-open', 'true');
    this.renderer.removeClass(dropdownList, 'tw-scale-0');
    this.renderer.removeClass(dropdownList, 'tw-opacity-0');
    this.renderer.addClass(dropdownList, 'tw-scale-100');
    this.renderer.addClass(dropdownList, 'tw-opacity-100');
    this.renderer.setStyle(dropdownList, 'maxHeight', '450px');
    this.renderer.setStyle(dropdownList, 'width', '90%');
  }
}

}

