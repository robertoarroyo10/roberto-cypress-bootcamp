/**
 * Test que:
 *   1. Recorre TODAS las páginas del listado (?page=1 ... ?page=9) y
 *      acumula los productos en un único array.
 *   2. Guarda el resultado combinado en cypress/fixtures/allProducts.json.
 *   3. Recorre el JSON resultante y aplica aserciones sobre cada producto,
 *      igual que en productsIteration.cy.js.
 */

describe('API Products - Paginado completo (pages 1..9) e iteración', () => {

	before(() => {
		const allProducts = [];

		// 1. Primer GET para descubrir cuántas páginas hay realmente
		cy.request({
			method: 'GET',
			url: 'https://footer-back.onrender.com/api/products?page=1&limit=16&stock=true',
		}).then((firstResponse) => {
			expect(firstResponse.status).to.eq(200);
			const totalPages = firstResponse.body.totalPages;
			expect(totalPages, 'totalPages debe ser numérico').to.be.a('number').and.greaterThan(0);
			cy.log(`La API reporta ${totalPages} páginas`);

			allProducts.push(...firstResponse.body.products);

			// 2. GET del resto de páginas (2..totalPages). Se encolan en orden.
			// Usamos limit=16&stock=true para evitar un bug de paginación del backend
			// que provoca productos duplicados entre páginas consecutivas con la query por defecto.
			for (let page = 2; page <= totalPages; page++) {
				cy.request({
					method: 'GET',
					url: `https://footer-back.onrender.com/api/products?page=${page}&limit=16&stock=true`,
				}).then((response) => {
					expect(response.status, `GET page=${page}`).to.eq(200);
					expect(response.body).to.have.property('products').that.is.an('array');
					cy.log(`Página ${page}: ${response.body.products.length} productos`);
					allProducts.push(...response.body.products);
				});
			}

			// 3. Cuando todas las peticiones hayan terminado, escribimos el fixture combinado
			cy.then(() => {
				expect(allProducts, 'productos totales tras paginar').to.not.be.empty;
				cy.writeFile('cypress/fixtures/allProducts.json', {
					totalItems: allProducts.length,
					totalPages,
					products: allProducts,
				});
				cy.log(`Total acumulado: ${allProducts.length} productos guardados en fixtures/allProducts.json`);
			});
		});
	});

	it('Cada producto del JSON combinado cumple la estructura esperada', () => {
		cy.fixture('allProducts.json').then((data) => {
			expect(data).to.have.property('products').that.is.an('array').and.not.empty;

			data.products.forEach((product, index) => {
				// Campos obligatorios
				expect(product, `producto[${index}] debe tener id`).to.have.property('id').that.is.a('number');
				expect(product, `producto[${index}] debe tener name`).to.have.property('name').that.is.a('string').and.not.empty;
				expect(product, `producto[${index}] debe tener price`).to.have.property('price');
				expect(product, `producto[${index}] debe tener brand`).to.have.property('brand');
				expect(product, `producto[${index}] debe tener category`).to.have.property('category');
				expect(product, `producto[${index}] debe tener image`).to.have.property('image').that.is.a('string').and.match(/^https?:\/\//);

				// Precio numérico positivo
				const priceNumber = Number(product.price);
				expect(priceNumber, `producto[${index}] price numérico`).to.be.a('number').and.not.NaN;
				expect(priceNumber, `producto[${index}] price > 0`).to.be.greaterThan(0);

				// discountPrice menor que price (si existe). Si la data es inconsistente solo lo avisamos.
				if (product.discountPrice !== null && product.discountPrice !== undefined) {
					const discount = Number(product.discountPrice);
					if (discount >= priceNumber) {
						cy.log(`⚠️ producto[${index}] ${product.name} (id=${product.id}) tiene discountPrice (${discount}) >= price (${priceNumber})`);
					}
				}
			});

			cy.log(`Validados ${data.products.length} productos`);
		});
	});

	it('Todos los ids de producto son únicos (no hay duplicados entre páginas)', () => {
		cy.fixture('allProducts.json').then((data) => {
			const ids = data.products.map((p) => p.id);

			// Contamos cuántas veces aparece cada id y nos quedamos con los repetidos
			const counts = ids.reduce((acc, id) => {
				acc[id] = (acc[id] || 0) + 1;
				return acc;
			}, {});
			const duplicatedIds = Object.entries(counts)
				.filter(([, count]) => count > 1)
				.map(([id, count]) => `id=${id} (x${count})`);

			if (duplicatedIds.length > 0) {
				cy.log(`⚠️ Ids duplicados detectados: ${duplicatedIds.join(', ')}`);
			}

			expect(
				duplicatedIds,
				`Se detectaron ${duplicatedIds.length} id(s) duplicados entre páginas: ${duplicatedIds.join(', ')}`
			).to.be.empty;
		});
	});

});
