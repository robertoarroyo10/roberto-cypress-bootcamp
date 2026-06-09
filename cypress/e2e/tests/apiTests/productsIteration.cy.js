/** 
 * Test que:
 *   1. Hace un GET a /api/products para obtener el listado de productos.
 *   2. Guarda la respuesta como JSON en cypress/fixtures/products.json
 *      (así podemos reutilizarlo offline en otros tests).
 *   3. Recorre cada producto del JSON y ejecuta aserciones sobre él
 *      (estructura, tipos de datos, precio válido, etc.).
 */

describe('API Products - Iteración sobre listado guardado en JSON', () => {

	before(() => {
		// 1. GET listado de productos
		cy.request({
			method: 'GET',
			url: 'https://footer-back.onrender.com/api/products?page=1&stock=true',
		}).then((response) => {
			expect(response.status).to.eq(200);
			expect(response.body).to.have.property('products').that.is.an('array').and.not.empty;

			// 2. Guardamos la respuesta como fixture para reutilizar
			cy.writeFile('cypress/fixtures/products.json', response.body);
			cy.log(`Guardados ${response.body.products.length} productos en fixtures/products.json`);
		});
	});

	it('Cada producto del JSON cumple la estructura esperada', () => {
		cy.fixture('products.json').then((data) => {
			expect(data).to.have.property('products').that.is.an('array').and.not.empty;

			// 3. Recorremos cada producto y validamos campos
			data.products.forEach((product, index) => {
				cy.log(`Producto #${index + 1}: ${product.name} (id=${product.id})`);

				// Campos obligatorios
				expect(product, `producto[${index}] debe tener id`).to.have.property('id').that.is.a('number');
				expect(product, `producto[${index}] debe tener name`).to.have.property('name').that.is.a('string').and.not.empty;
				expect(product, `producto[${index}] debe tener price`).to.have.property('price');
				expect(product, `producto[${index}] debe tener brand`).to.have.property('brand');
				expect(product, `producto[${index}] debe tener category`).to.have.property('category');
				expect(product, `producto[${index}] debe tener image`).to.have.property('image').that.is.a('string').and.match(/^https?:\/\//);

				// El precio debe ser un número positivo (la API lo devuelve como string)
				const priceNumber = Number(product.price);
				expect(priceNumber, `producto[${index}] price debe ser numérico`).to.be.a('number').and.not.NaN;
				expect(priceNumber, `producto[${index}] price debe ser > 0`).to.be.greaterThan(0);

				// Si hay precio con descuento, debe ser menor que el original
				if (product.discountPrice !== null && product.discountPrice !== undefined) {
					const discount = Number(product.discountPrice);
					expect(discount, `producto[${index}] discountPrice < price`).to.be.lessThan(priceNumber);
				}

				// Stock total no negativo (si está presente)
				if (product.totalStock !== undefined) {
					expect(product.totalStock, `producto[${index}] totalStock >= 0`).to.be.at.least(0);
				}
			});
		});
	});

	it('Hace un GET de detalle por cada uno de los primeros 3 productos del JSON', () => {
		cy.fixture('products.json').then((data) => {
			// Si queremos limitar para para no saturar la API o que el test no sea muy largo podemos usar solo una muestra de los productos, por ejemplo los primeros 3
			// const sample3Products = data.products.slice(0, 3);

			data.products.forEach((product) => {
				cy.request({
					method: 'GET',
					url: `https://footer-back.onrender.com/api/products/${product.id}`,
				}).then((detail) => {
					expect(detail.status, `detalle de ${product.name}`).to.eq(200);
					expect(detail.body).to.have.property('id', product.id);
					expect(detail.body).to.have.property('name', product.name);
					expect(detail.body).to.have.property('variants').that.is.an('array');
					cy.log(`OK detalle: ${product.name} - ${detail.body.variants.length} variants`);
				});
			});
		});
	});

	it('Flujo completo (añadir + verificar + borrar) por cada producto del JSON', () => {
		// Login para obtener token (necesario para operaciones sobre el carrito)
		cy.fixture('login_form').then((loginData) => {
			cy.request('POST', 'https://footer-back.onrender.com/api/auth/login', {
				email: loginData.email,
				password: loginData.password,
			}).then((loginResponse) => {
				expect(loginResponse.status).to.eq(200);
				const token = loginResponse.body.token;
				const authHeaders = { Authorization: `Bearer ${token}` };

				cy.fixture('products.json').then((data) => {
					// Limitamos a 3 productos para no saturar la API ni alargar mucho el test
					// const sample = data.products.slice(0, 3);
					const quantity = 1;

					data.products.forEach((product) => {
						cy.log(`--- Flujo para: ${product.name} (id=${product.id}) ---`);

						// 1. GET detalle para obtener un variant con stock
						cy.request({
							method: 'GET',
							url: `https://footer-back.onrender.com/api/products/${product.id}`,
						}).then((detail) => {
							expect(detail.status).to.eq(200);
							expect(detail.body.variants, `variants de ${product.name}`).to.be.an('array').and.not.empty;

							// Elegimos el primer variant con stock disponible
							const variant = detail.body.variants.find((v) => v.stock > 0) || detail.body.variants[0];
							expect(variant, `variant válido para ${product.name}`).to.exist;
							const productVariantStockId = variant.id;
							cy.log(`Variant elegido para ${product.name}: id=${productVariantStockId}, stock=${variant.stock}`);

							// 2. POST al carrito
							cy.request({
								method: 'POST',
								url: 'https://footer-back.onrender.com/api/cart/add',
								headers: authHeaders,
								body: { productVariantStockId, quantity },
							}).then((addResponse) => {
								expect(addResponse.status, `add al carrito ${product.name}`).to.be.oneOf([200, 201]);

								// 3. GET carrito y verificar que el item está
								cy.request({
									method: 'GET',
									url: 'https://footer-back.onrender.com/api/cart',
									headers: authHeaders,
								}).then((cartResponse) => {
									expect(cartResponse.status).to.eq(200);
									const addedItem = cartResponse.body.find(
										(item) => item.variant.id === productVariantStockId
									);
									expect(
										addedItem,
										`${product.name} (variantId=${productVariantStockId}) no aparece en el carrito`
									).to.exist;
									expect(addedItem.product.id).to.eq(product.id);

									// 4. DELETE el item para dejar el carrito limpio antes del siguiente producto
									const itemId = addedItem.id;
									cy.request({
										method: 'DELETE',
										url: `https://footer-back.onrender.com/api/cart/item/${itemId}`,
										headers: authHeaders,
									}).then((deleteResponse) => {
										expect(deleteResponse.status).to.be.oneOf([200, 204]);
										cy.log(`OK flujo para ${product.name}: añadido, verificado y eliminado`);
									});
								});
							});
						});
					});
				});
			});
		});
	});

});
