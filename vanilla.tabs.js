'use strict';

/**
  * Start writing a plugin using Immediately Invoked Function Expression (IIFE).
  * Function is used to create a private scope: variable, created inside a function
  * is not accessible outside the function
*/

(function() {
	// Constructor function
	const VanillaTabs = function(opts) {
		this.options = Object.assign(VanillaTabs.defaults, opts);
		this.elems = document.querySelectorAll(this.options.selector);

		buildUI(this);
		handleNavigation(this);
		handleResponsive(this);
	}


	// Private function to initialize the UI Elements
	function buildUI(tabs) {
		let tabContainer = tabs.options.container,
				tabsStyle = tabs.options.type,
				activeTabIndex = Number(tabs.options.activeIndex);

		// walk on all tabs on the page
		tabs.elems.forEach(function(tabsElem) {
			let childNodes = tabsElem.childNodes,
					tabsTitles = [];

			tabsElem.classList.add('style_' + tabsStyle);

			for (let child of childNodes) {
				if (child.classList && child.classList.contains(tabs.options.container.slice(1))) {
					// grab tab title from data attribute
					let tabTitle = child.dataset.title ? child.dataset.title : '';
					tabsTitles.push(tabTitle);

					// wrap tab content
					child.innerHTML = `<div class="content_wrapper">${child.innerHTML}</div>`;

					// insert nav link for accordion navigation
					child.insertAdjacentHTML('afterbegin', `<span class="link">${tabTitle}</span>`);
				}
			}

			// create horizontal / vertical tabs navigation elements
			let navElemsHTML = '';

			tabsTitles.forEach(function(title) {
				navElemsHTML = `${navElemsHTML}<span class="link">${title}</span>`;
			});

			tabsElem.insertAdjacentHTML('afterbegin', `<li class="nav">${navElemsHTML}</li>`);

			// validate active tab index. but, you can specify -1 for accordion tabs to make all of them closed by defaults
			if (tabsStyle != 'accordion' && activeTabIndex != -1) {
				if (activeTabIndex > (tabsTitles.length - 1)) {
					// console.warn('VANILLA TABS: Active tab number from settings is bigger than tabs count. Please remember, that index starts from Zero! To avoid crashes, activeIndex option was reverted to 0.');
					activeTabIndex = 0;
				}

				document.querySelectorAll(`#${tabsElem.id} > ${tabContainer}`)[activeTabIndex].classList.add('active');
				document.querySelectorAll(`#${tabsElem.id} > .nav > .link`)[activeTabIndex].classList.add('active');
				document.querySelectorAll(`#${tabsElem.id} > ${tabContainer} > .link`)[activeTabIndex].classList.add('active');
			}
		});
	}


	// Navigation: assign click events
	function handleNavigation(tabs) {
		let tabContainer = tabs.options.container,
				tabsStyle = tabs.options.type;

		// walk on all tabs on the page
		tabs.elems.forEach(function(tabsElem) {
			tabsElem.addEventListener('click', (e) => {
				if (e.target && e.target.classList.contains('link')) {
					e.stopPropagation();

					let activeTabIndex;

					// if we click on main navigation link
					if (e.target.parentElement.classList == 'nav') {
						activeTabIndex = Array.prototype.slice.call(e.target.parentElement.children).indexOf(e.target);
					// if we click on accordion nav link
					} else {
						activeTabIndex = Array.prototype.slice.call(e.target.parentElement.parentElement.children).indexOf(e.target.parentElement) - 1;
					}

					let tabsContent = document.querySelectorAll(`#${tabsElem.id} > ${tabContainer}`),
							mainNavLinks = document.querySelectorAll(`#${tabsElem.id} > .nav > .link`),
							accordionNavLinks = document.querySelectorAll(`#${tabsElem.id} > ${tabContainer} > .link`);

					// toggle accordion panel
					if ((tabsStyle == 'accordion' || tabsElem.classList.contains('responsive')) && e.target.classList.contains('active')) {
						tabsContent[activeTabIndex].classList.remove('active');
						mainNavLinks[activeTabIndex].classList.remove('active');
						accordionNavLinks[activeTabIndex].classList.remove('active');
						return;
					}

					// remove active class for inactive tabs
					for (let item of tabsContent) {
						item.classList.remove('active');
					}
					// add active class for a current (active) tab
					tabsContent[activeTabIndex].classList.add('active');

					// add active classes and remove inactive for main nav links
					for (let link of mainNavLinks) {
						link.classList.remove('active');
					}
					mainNavLinks[activeTabIndex].classList.add('active');

					// add active classes and remove inactive for accordion nav links
					for (let link of accordionNavLinks) {
						link.classList.remove('active');
					}
					accordionNavLinks[activeTabIndex].classList.add('active');
				}
			});
		});
	}


	// Responsive: tabs to accordion
	function handleResponsive(tabs) {
		let tabContainer = tabs.options.container,
				tabsStyle = tabs.options.type,
				responsiveClassName = 'responsive',
				responsiveBreak = tabs.options.responsiveBreak;

		window.addEventListener('resize', () => {
			// walk on all tabs on the page
			tabs.elems.forEach(function(tabsElem) {
				let tabsContent = document.querySelectorAll(`#${tabsElem.id} > ${tabContainer}`),
						mainNavLinks = document.querySelectorAll(`#${tabsElem.id} > .nav > .link`),
						accordionNavLinks = document.querySelectorAll(`#${tabsElem.id} > ${tabContainer} > .link`);

				if (window.innerWidth > Number(responsiveBreak)) {
					tabsElem.classList.remove(responsiveClassName);

					if (tabsStyle != 'accordion') {
						// set first active tab if all of tabs were closed in accordion mode
						let openTabs = tabsElem.querySelectorAll('.link.active');

						if (openTabs.length == 0) {
							tabsContent[0].classList.add('active');
							mainNavLinks[0].classList.add('active');
							accordionNavLinks[0].classList.add('active');
						}
					}

				} else {
					tabsElem.classList.add(responsiveClassName);
				}
			});
		});

		// manually fire resize event
		window.dispatchEvent(new Event('resize'));
	}


	// Attach our defaults for plugin to the plugin itself
	VanillaTabs.defaults = {
		'selector': '#tabs',
		'container': '.content',
		'type': 'accordion', // accordion, horizontal or vertical
		'responsiveBreak': 840,
		'activeIndex': 0
	}

	// make accessible globally
	window.VanillaTabs = VanillaTabs;
})();
