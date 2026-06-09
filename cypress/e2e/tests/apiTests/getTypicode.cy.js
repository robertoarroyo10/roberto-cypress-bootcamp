describe('Use GET method to get data from typicode', () => {
  
  it('first visit and get on typicode.com', () => {
    cy.visit("https://jsonplaceholder.typicode.com/");
    cy.request({
      method: 'GET',
      url: '/posts'
    })
  });

  it('Get on typicode.com', () => {
    cy.request({
      method: 'GET',
      url: 'https://jsonplaceholder.typicode.com/posts'
    });
  });

  it('Get without declare parameter (method and url) on typicode.com', () => {
    cy.request('GET','https://jsonplaceholder.typicode.com/posts');
  });
  
  it('Get without method on typicode.com', () => {
    cy.request('https://jsonplaceholder.typicode.com/posts');
  });

  it('Get on typicode.com and check status code with then', () => {
    cy.request('https://jsonplaceholder.typicode.com/posts').then((response) => {
      expect(response.status).to.eq(200);
    });
  });

  it('Get on typicode.com with its status', () => {
    cy.request('https://jsonplaceholder.typicode.com/posts').its('status').should('eq', 200);
  });

  it('Get on typicode.com with its body and check length', () => {
    cy.request('https://jsonplaceholder.typicode.com/posts').its('body').should('have.length', 100);
  });

  it('Get on typicode.com and use should and expect on the response', () => {
    cy.request('https://jsonplaceholder.typicode.com/posts').should((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.length(100);
    });
  });

  it('Get on typicode.com and check status, lenght and its an array and not a number', () => {
    cy.request('https://jsonplaceholder.typicode.com/posts').should((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.length(100);
      expect(response.body).to.be.a('array');
      expect(response.body).not.to.be.a('number');
    });
  });

  it("Get on typicode.com /post1 body", () => {
    cy.request("https://jsonplaceholder.typicode.com/posts/1").should(
      (response) => {
        expect(response.body).to.be.a("object");
        expect(response.body).not.to.be.a("number");
        expect(response.body.userId).to.be.eq(1); 
        expect(response.body.title).to.be.contain(
          "sunt aut facere repellat provident occaecati excepturi optio reprehenderit"
        );
      });
  });

  it('check that the response fot the endpoint "/posts"  and include the keys userId, id, title, body ', () => {
    cy.request('https://jsonplaceholder.typicode.com/posts').should((response) => {
      response.body.forEach((array) => {
        expect(array).to.include.all.keys(['userId', 'id', 'title', 'body']);
      })
    })
  });

  it("Checks email for id = 4 using find", () => {
    cy.request({
      method: "GET",
      url: "https://jsonplaceholder.typicode.com/posts/1/comments",
    }).should((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an("array");
      expect(response.body).to.have.length(5);

  // Usando find para buscar un id en especifico

      const id_4 = response.body.find((alias) => alias.id === 4);
      expect(id_4).to.exist;
      expect(id_4.email).to.be.a("string");
      expect(id_4.email).to.eq("Lew@alysha.tv");
      expect(id_4.email).to.contain("@");
      expect(id_4.name).to.be.a("string");
      expect(id_4.name).to.contain("alias");
      expect(id_4.name).to.eq("alias odio sit");
    });
  });

  it("Checks data for id = 4 using some", () => {
    cy.request({
      method: "GET",
      url: "https://jsonplaceholder.typicode.com/posts/1/comments",
    }).should((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an("array");
      expect(response.body).to.have.length(5);
      expect(response.body.some(({ id, email, name, body }) => id === 4 && email === "Lew@alysha.tv" && name === "alias odio sit" && body === "non et atque\noccaecati deserunt quas accusantium unde odit nobis qui voluptatem\nquia voluptas consequuntur itaque dolor\net qui rerum deleniti ut occaecati")).to.be.true;
    });
  });
  
  it("Check status, datatype and length of data response in /comments", () => {
    cy.request({
      method: "GET",
      url: "https://jsonplaceholder.typicode.com/posts/1/comments",
    }).should((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.a("array");
      expect(response.body).to.have.length(5);

      response.body.forEach((comment) => {
        if (comment.id === 4) {
          expect(comment.email).to.be.a("string");
          expect(comment.email).to.be.eq("Lew@alysha.tv");
        }
      });
    });
  });

  it('get data from a typicode/post1, check its status code, type of response body and evaluates type of value', () => {
    cy.request('https://jsonplaceholder.typicode.com/posts/1').should((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.a('object');
      Object.values(response.body).forEach((value) => {
        // Comparar si los values de las key son string o un number
        expect(typeof value === 'number' || typeof value === 'string').to.be.true;
      });
        // Se puede comprobar en la misma aserción si es un string o un number además de comprobar el valor exacto que tiene
      expect(response.body['title']).to.be.a('string').to.eq(
        'sunt aut facere repellat provident occaecati excepturi optio reprehenderit'
      );
      expect(response.body['userId']).to.be.a('number').to.eq(1);
      expect(response.body['body']).to.be.a('string').to.contain(
        'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto'
      );
    });
  });

  it('get data from a typicode/post1/comments, check its status code, type of response body and assert over object with id 4', () => {
    cy.request('https://jsonplaceholder.typicode.com/posts/1/comments').should((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.a('array');
      expect(response.body).to.have.length(5);
      response.body.filter((comment) => {
        comment.id === 4 && expect(comment.email).to.eq('Lew@alysha.tv');
      });
    });
  });

  it('GET on typicode.com check status in response and lenght for the body', () => {
    cy.request('https://jsonplaceholder.typicode.com/comments').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.length(500);
      expect(response.body).to.be.a('array');
      expect(response.duration).to.be.lessThan(160);
    })
  })

  it('a 404 error is displayed when getting data from typicode/post1/comment', () => {
    cy.request({
      url: 'https://jsonplaceholder.typicode.com/posts/1/error',
      failOnStatusCode: false
    }).should((response) => {
      expect(response.status).to.eq(404);
    });
  });
});