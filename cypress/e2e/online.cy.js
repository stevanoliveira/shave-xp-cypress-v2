/// <reference types="Cypress" />

describe("app", () => {
	it("deve estar online", () => {
		cy.visit("/")
	})
})
