document.addEventListener('DOMContentLoaded', () => {
	new VanillaTabs({
		'selector': '#tabs-v',
		'type': 'vertical'
	});

	new VanillaTabs({
		'selector': '#tabs-commit',
		'type': 'accordion',
		'activeIndex': -1
	});

	new VanillaTabs({
		'selector': '#tabs-branch',
		'type': 'accordion',
		'activeIndex': -1
	});

	new VanillaTabs({
		'selector': '#tabs-remote',
		'type': 'accordion',
		'activeIndex': -1
	});
});
