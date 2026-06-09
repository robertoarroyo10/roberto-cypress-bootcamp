describe('API GET Footer Products & Cart', () => {

    beforeEach(() => {
        cy.fixture('login_form').then((loginData) => {
            cy.request('POST', 'https://footer-back.onrender.com/api/auth/login', {
                email: loginData.email,
                password: loginData.password,
            }).then((loginResponse) => {
                expect(loginResponse.status).to.eq(200);
                expect(loginResponse.body).to.have.property('token');
                // Guardamos el token como alias para usarlo en los tests
                cy.wrap(loginResponse.body.token).as('authToken');
            });
        });
    });

    it('Flujo completo: buscar producto por nombre, obtener variants y añadir al carrito', () => {
			const productName = 'Nike Phoenix Oversized';
			const desiredColor = 'Rosa';
			const desiredSize = 'XS';
			const quantity = 6;
			cy.get('@authToken').then((token) => { // Accedemos al token obtenido en el beforeEach para usarlo en las peticiones que requieren autenticación

			// 1. GET producto por nombre para obtener el id
			cy.request({
				method: 'GET',
				url: `https://footer-back.onrender.com/api/products?name=${(productName)}`,
				}).then((searchResponse) => {
				expect(searchResponse.status).to.eq(200);
				expect(searchResponse.body).to.have.property('products').that.is.an('array').and.not.empty;

				const product = searchResponse.body.products[0];
				expect(product).to.have.property('name', productName);
				expect(product).to.have.property('id');
				const productId = product.id;
				cy.log(`Producto encontrado: ${product.name} (id: ${productId})`);

				// 2. GET detalle del producto para obtener los variants
				cy.request({
						method: 'GET',
						url: `https://footer-back.onrender.com/api/products/${productId}`,
				}).then((detailResponse) => {
					expect(detailResponse.status).to.eq(200);
					expect(detailResponse.body).to.have.property('variants').that.is.an('array').and.not.empty;

					const variants = detailResponse.body.variants;

					// Buscar el variant que coincida con color y talla deseados, si no lo encuentra, el test fallará con un mensaje claro
					const variant = variants.find((variant) => variant.color === desiredColor && variant.size === desiredSize);
					expect(variant,`No se encontró ningún variant con color "${desiredColor}" y talla "${desiredSize}"`).to.exist;
					expect(variant).to.have.property('id');
					const productVariantStockId = variant.id;
					cy.log(`Variant seleccionado: id=${productVariantStockId}, color=${variant.color}, size=${variant.size}`);

					// 3. POST al carrito con el variant id (usando el token del login)
						cy.request({
							method: 'POST',
							url: 'https://footer-back.onrender.com/api/cart/add',
							headers: {
								Authorization: `Bearer ${token}`,
							},
							body: {
								productVariantStockId,
								quantity,
							},
						}).then((cartResponse) => {
							expect(cartResponse.status).to.be.oneOf([200, 201]);
							cy.log(`Producto añadido al carrito: variantId=${productVariantStockId}, quantity=${quantity}`);

							// 4. GET al carrito para verificar que el producto se ha añadido
							cy.request({
								method: 'GET',
								url: 'https://footer-back.onrender.com/api/cart',
								headers: {
									Authorization: `Bearer ${token}`,
								},
							}).then((getCartResponse) => {
								expect(getCartResponse.status).to.eq(200);
								expect(getCartResponse.body).to.be.an('array');

								// Buscar en el carrito el item con el variant que acabamos de añadir
								const addedItem = getCartResponse.body.find(
									(item) => item.variant.id === productVariantStockId
								);

								expect(
									addedItem,
									`El producto con variantId=${productVariantStockId} no se encontró en el carrito`
								).to.exist;
								expect(addedItem.quantity).to.eq(quantity);
								expect(addedItem.product.id).to.eq(productId);
								cy.log(`Verificado en carrito: ${addedItem.product.name} - ${addedItem.variant.color} talla ${addedItem.variant.size} x${addedItem.quantity}`);

								// 5. DELETE para eliminar el item del carrito
								const itemId = addedItem.id;
								cy.request({
									method: 'DELETE',
									url: `https://footer-back.onrender.com/api/cart/item/${itemId}`,
									headers: {
										Authorization: `Bearer ${token}`,
									},
								}).then((deleteResponse) => {
									expect(deleteResponse.status).to.be.oneOf([200, 204]);
									cy.log(`Item eliminado del carrito: itemId=${itemId}`);

									// 6. GET al carrito para verificar que está vacío
									cy.request({
										method: 'GET',
										url: 'https://footer-back.onrender.com/api/cart',
										headers: {
											Authorization: `Bearer ${token}`,
										},
									}).then((emptyCartResponse) => {
										expect(emptyCartResponse.status).to.eq(200);

										// Aserción: el item eliminado ya no está en el carrito
										// (útil cuando no estemos seguros de que el carrito este vacío)
										const deletedItem = emptyCartResponse.body.find((item) => item.id === itemId);
										expect(deletedItem).to.be.undefined;
										// Aserción: el carrito está vacío (útil si sabemos que solo había un item)
										expect(emptyCartResponse.body).to.be.an('array').that.is.empty;
										cy.log('Carrito vacío verificado');
									});
								});
							});
						});
					});
				});
			});
		});
});
