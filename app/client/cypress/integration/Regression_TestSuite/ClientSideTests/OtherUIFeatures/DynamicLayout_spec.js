const commonlocators = require("../../../../locators/commonlocators.json");
const pages = require("../../../../locators/Pages.json");

<<<<<<< HEAD
describe("Dynamic Layout Functionality", function() {
  it("Dynamic Layout - Change Layout", function() {
    cy.get(commonlocators.layoutControls)
      .last()
      .click();
    cy.get(commonlocators.canvas)
      .invoke("width")
      .should("be.eq", 450);
  });
  it("Dynamic Layout - New Page should have selected Layout", function() {
    cy.get(pages.AddPage)
      .first()
      .click();

    cy.get(commonlocators.canvas)
      .invoke("width")
      .should("be.eq", 450);
=======
describe("Dynamic Layout Functionality", function () {
  it("Dynamic Layout - Change Layout", function () {
    cy.get(commonlocators.layoutControls).last().click();
    cy.get(commonlocators.canvas).invoke("width").should("be.eq", 450);

    //Dynamic Layout - New Page should have selected Layout
    cy.get(pages.AddPage).first().click();
    cy.get(commonlocators.canvas).invoke("width").should("be.eq", 450);
>>>>>>> 338ac9ccba622f75984c735f06e0aae847270a44
  });
});
