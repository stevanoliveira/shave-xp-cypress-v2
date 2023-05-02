/// <reference types="Cypress" />

import loginPage from "../support/pages/login"
import shaversPage from "../support/pages/shavers"

import data from "../fixtures/users-login.json"

describe("login", () => {
	context("when I submit the form", () => {
		it.only("should log in successfully", () => {
			const user = data.sucess

			cy.createUser(user)

			loginPage.submit(user.email, user.password)
			shaversPage.header.userShouldBeLoggedIn(user.name)
		})

		it("should not log in with a wrong password", () => {
			const user = data.invpass

			loginPage.submit(user.email, user.password)

			const message =
				"Ocorreu um erro ao fazer login, verifique suas credenciais."

			loginPage.noticeShouldBe(message)
		})

		it("should not log in with a non-existent email", () => {
			const user = data.email404

			cy.visit("http://localhost:3000")

			cy.get("input[placeholder$=email]").type(user.email)

			cy.get("input[placeholder*=senha]").type(user.password)

			cy.contains("button", "Entrar").click()

			const message =
				"Ocorreu um erro ao fazer login, verifique suas credenciais."

			loginPage.noticeShouldBe(message)
		})

		it("mandatories fields", () => {
			loginPage.submit()

			loginPage.requiredFields(
				"E-mail é obrigatório",
				"Senha é obrigatória",
			)
		})
	})

	context("password too short", () => {
		data.shortpass.forEach((p) => {
			it(`must not log in with the password: ${p}`, () => {
				loginPage.submit("stevan2@gmail.com", p)

				loginPage.alertShouldBe("Pelo menos 6 caracteres")
			})
		})
	})

	context("email with incorrect format", () => {
		data.invemails.forEach((e) => {
			it(`must not log in with the email: ${e}`, () => {
				loginPage.submit(e, "pwd123")

				loginPage.alertShouldBe("Informe um email válido")
			})
		})
	})
})
