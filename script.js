const tableBody = document.querySelector('#table-body')

const API = 'https://657f0f719d10ccb465d5dc18.mockapi.io/'

const METHOD = {
	GET: 'GET',
	POST: 'POST',
	PUT: 'PUT',
	PATCH: 'PATCH',
	DELETE: 'DELETE'
}

async function controller(action, method = METHOD.GET, body) {
	const headers = {
		'Content-Type': 'application/json'
	}

	const config = {
		method,
		headers
	}

	if (body) {
		config.body = JSON.stringify(body)
	}

	try {
		const response = await fetch(`${API}${action}`, config);
		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error:', error);
		throw error;
	}
}

async function getHeroes() {
	return await controller('heroes');
}

function createTableCell(elementType, textContent) {
	const td = document.createElement(elementType);
	td.textContent = textContent;
	return td;
}

function createCheckbox(checked, changeHandler) {
	const checkbox = document.createElement('input');
	checkbox.type = 'checkbox';
	checkbox.checked = checked;
	checkbox.addEventListener('change', changeHandler);
	return checkbox;
}

function createDeleteButton(clickHandler) {
	const button = document.createElement('button');
	button.textContent = 'Delete';
	button.addEventListener('click', clickHandler);
	return button;
}

function renderHeroes(heroes) {
	heroes.forEach(hero => {
		const tr = document.createElement('tr');
		const [tdName, tdComics, tdFavourite, tdDelete] = [
			createTableCell('td', hero.name),
			createTableCell('td', hero.comics),
			createTableCell('td', ''),
			createTableCell('td', '')
		];

		const checkboxFavourite = createCheckbox(hero.favourite, async () => {
			await controller(`heroes/${hero.id}`, METHOD.PUT, { favourite: checkboxFavourite.checked });
		});

		const buttonDelete = createDeleteButton(async () => {
			await controller(`heroes/${hero.id}`, METHOD.DELETE);
			tr.remove();
		});

		tdFavourite.append(checkboxFavourite);
		tdDelete.append(buttonDelete);

		tr.append(tdName, tdComics, tdFavourite, tdDelete);
		tableBody.append(tr);
	});
}

async function getUniverses() {
	const data = await controller('universes')
	return data
}

function renderUniverses(universes) {
	const select = document.querySelector('#heroComics')

	universes.forEach(universe => {
		const option = document.createElement('option')
		option.value = universe.name
		option.textContent = universe.name

		select.append(option)
	})
}

async function addHero(e) {
	e.preventDefault()

	const heroName = document.querySelector('#heroName')
	const heroComics = document.querySelector('#heroComics')
	const heroFavorite = document.querySelector('#heroFav')

	const heroes = await getHeroes();
	const heroExists = heroes.find(hero => hero.name.toLowerCase() === heroName.value.toLowerCase());

	if (heroExists) {
		console.error('Hero already exists')
		return
	}

	const hero = {
		name: heroName.value,
		comics: heroComics.value,
		favourite: heroFavorite.checked
	}

	await controller('heroes', METHOD.POST, hero)

	heroName.value = ''
	heroComics.value = 'Marvel'
	heroFavorite.checked = false

	renderHeroes([hero])
}

getHeroes().then(renderHeroes);
getUniverses().then(renderUniverses);

const addHeroButton = document.querySelector('#add-hero-btn')
addHeroButton.addEventListener('click', addHero)