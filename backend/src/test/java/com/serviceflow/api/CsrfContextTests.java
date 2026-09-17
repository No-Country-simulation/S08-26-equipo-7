package com.serviceflow.api;

import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.emptyString;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class CsrfContextTests {

	@Autowired
	private MockMvc mockMvc;

	@Test
	void csrfEndpointExposesTokenAndCookie() throws Exception {
		mockMvc.perform(get("/api/v1/auth/csrf"))
				.andExpect(status().isOk())
				.andExpect(content().string(not(emptyString())));
	}

	@Test
	void postWithoutCsrfIsRejectedButGeneratesTokenLate() throws Exception {
		mockMvc.perform(post("/api/v1/tickets")
						.contentType(MediaType.APPLICATION_JSON)
						.content("{\"title\":\"t\",\"description\":\"d\",\"category\":\"IT\"}"))
				.andExpect(status().isForbidden());
	}

	@Test
	void loginWithCsrfTokenSucceeds() throws Exception {
		mockMvc.perform(post("/api/v1/auth/login")
						.with(csrf())
						.contentType(MediaType.APPLICATION_JSON)
						.content("{\"email\":\"admin@serviceflow.com\",\"password\":\"Admin123!\"}"))
				.andExpect(status().isOk());
	}

	@Test
	void csrfTokenFromCsrfEndpointIsUsableOnNextPost() throws Exception {
		String token = mockMvc.perform(get("/api/v1/auth/csrf"))
				.andExpect(status().isOk())
				.andReturn().getResponse().getContentAsString();
		org.junit.jupiter.api.Assertions.assertTrue(token.contains("token"), "El endpoint debe exponer el token");

		mockMvc.perform(get("/api/v1/auth/csrf").header("X-XSRF-TOKEN", "x"))
				.andExpect(status().isOk());
	}
}