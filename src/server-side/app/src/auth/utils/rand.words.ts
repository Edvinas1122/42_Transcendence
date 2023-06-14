// a function that generates a random words of ammount of words from an array of words

export const randWords = (ammount: number): string => {
	const words = [
		'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing',
		'elit', 'curabitur', 'vel', 'hendrerit', 'libero', 'eleifend', 'blandit',
		'nunc', 'ornare', 'odio', 'ut', 'orci', 'gravida', 'imperdiet', 'nullam',
		'purus', 'lacinia', 'a', 'pretium', 'quis', 'congue', 'praesent', 'sagittis',
		'laoreet', 'auctor', 'mauris', 'non', 'velit', 'eros', 'dictum', 'proin',
		'accumsan', 'sapien', 'nec', 'massa', 'volutpat', 'venenatis', 'sed', 'eu',
		'molestie', 'lacus', 'quisque', 'porttitor', 'ligula', 'dui', 'mollis',
		'tempus', 'at', 'magna', 'vestibulum', 'turpis', 'ac', 'diam', 'tincidunt',
		'id', 'condimentum', 'enim', 'sodales', 'in', 'hac', 'habitasse', 'platea',
		'dictumst', 'aenean', 'neque', 'fusce', 'augue', 'leo', 'eget', 'semper',
		'mattis', 'tortor', 'scelerisque', 'nulla', 'interdum', 'tellus', 'malesuada',
		'rhoncus', 'porta', 'sem', 'aliquet', 'et', 'nam', 'suspendisse', 'potenti',
		'vivamus', 'luctus', 'fringilla', 'erat', 'donec', 'justo', 'vehicula',
		'ultricies', 'varius', 'ante', 'primis', 'faucibus', 'ultrices', 'posuere',
		'cubilia', 'curae', 'etiam', 'cursus', 'aliquam', 'quam', 'dapibus',
		'nisl', 'feugiat', 'egestas', 'class', 'aptent', 'taciti', 'sociosqu',
		'ad', 'litora', 'torquent', 'per', 'conubia', 'nostra', 'inceptos',
		'himenaeos', 'phasellus', 'nibh', 'pulvinar', 'vitae', 'urna', 'iaculis',
		'lobortis', 'nisi', 'viverra', 'arcu', 'morbi', 'pellentesque', 'metus',
		'commodo', 'ut', 'facilisis', 'felis', 'tristique', 'ullamcorper', 'placerat',
	];

	let result = '';
	for (let i = 0; i < ammount; i++) {
		result += words[Math.floor(Math.random() * words.length)] + ' ';
	}
	return result.trim();
}