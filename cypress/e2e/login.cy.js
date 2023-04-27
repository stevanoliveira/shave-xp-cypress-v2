/// <reference types="Cypress" />

import loginPage from "../support/pages/login"
import shaversPage from "../support/pages/shavers"

describe("login", () => {
	context("when I submit the form", () => {
		it("should log in successfully", () => {
			const user = {
				name: "stevan",
				email: "stevan2@gmail.com",
				password: "pwd123",
			}

			loginPage.submit(user.email, user.password)
			shaversPage.header.userShouldBeLoggedIn(user.name)
		})

		it("should not log in with a wrong password", () => {
			const user = {
				name: "stevan",
				email: "stevan2@gmail.com",
				password: "wrongPass",
			}

			loginPage.submit(user.email, user.password)

			const message =
				"Ocorreu um erro ao fazer login, verifique suas credenciais."

			loginPage.noticeShouldBe(message)
		})

		it("should not log in with a non-existent email", () => {
			const user = {
				name: "stevan",
				email: "stevan2@404.com",
				password: "123456",
			}

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
		const passwords = ["1", "12", "123", "1234", "12345"]

		passwords.forEach((p) => {
			it(`must not log in with the password: ${p}`, () => {
				loginPage.submit("stevan2@gmail.com", p)

				loginPage.alertShouldBe("Pelo menos 6 caracteres")
			})
		})
	})

	context("email with incorrect format", () => {
		const emails = [
			"stevan&gmail.com",
			"stevan.com.br",
			"@gmail.com",
			"stevan@",
			"123123123",
			"@#$%¨&*",
			"xpto123",
		]

		emails.forEach((e) => {
			it(`must not log in with the email: ${e}`, () => {
				loginPage.submit(e, "pwd123")

				loginPage.alertShouldBe("Informe um email válido")
			})
		})
	})
})
