describe("POST a /settings", () => {
  it("Can fill the form", () => {
    cy.visit("/settings");
    cy.get("form");

    cy.get('input[name="title"]')
      .type("La Pantoja ataca de nuevo")
      .should("have.value", "La Pantoja ataca de nuevo");
    cy.get('input[name="year"]').type("2021").should("have.value", "2021");
    cy.get('input[name="director"]')
      .type("Javier Ambrossi y Javier Calvo")
      .should("have.value", "Javier Ambrossi y Javier Calvo");
    cy.get('input[name="cast"]')
      .type("Isabel Pantoja, Mila Ximenez")
      .should("have.value", "Isabel Pantoja, Mila Ximenez");
    cy.get('input[name="genre"]').type("Drama").should("have.value", "Drama");
    cy.get('input[name="duration"]')
      .type("80 min")
      .should("have.value", "80 min");
    cy.get('input[name="rating"]').type("5/5").should("have.value", "5/5");
    cy.get('input[name="plot"]')
      .type("Pasan cosas")
      .should("have.value", "Pasan cosas");
    cy.get('input[name="img"]')
      .type(
        "http://images6.fanpop.com/image/photos/34400000/Zac-Efron-With-No-Teeth-zac-efron-34438227-625-784.jpg"
      )
      .should(
        "have.value",
        "http://images6.fanpop.com/image/photos/34400000/Zac-Efron-With-No-Teeth-zac-efron-34438227-625-784.jpg"
      );
    cy.server();
    cy.route({
      url: "/settings",
      method: "POST",
      response: { status: "Movie created!", code: 200 },
    });
    cy.request("POST", "http://localhost:3000/settings", {
      Title: "La Pantoja ataca de nuevo",
    }).then((res) => {
      expect(res.body).to.have.property("Title", "La Pantoja ataca de nuevo");
    });
  });
});
