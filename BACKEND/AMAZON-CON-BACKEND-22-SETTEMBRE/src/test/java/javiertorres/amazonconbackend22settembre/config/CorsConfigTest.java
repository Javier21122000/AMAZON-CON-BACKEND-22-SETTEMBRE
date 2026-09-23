package javiertorres.amazonconbackend22settembre.config;

import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.web.filter.CorsFilter;

import static org.assertj.core.api.Assertions.assertThat;

class CorsConfigTest {
    private static final String FRONTEND = "https://archivio00-frontend.onrender.com";

    @Test
    void permitsFrontendPreflightWithAuthorization() throws Exception {
        MockHttpServletResponse response = preflight(FRONTEND);
        assertThat(response.getStatus()).isEqualTo(200);
        assertThat(response.getHeader("Access-Control-Allow-Origin")).isEqualTo(FRONTEND);
        assertThat(response.getHeader("Access-Control-Allow-Headers")).contains("Authorization");
    }

    @Test
    void rejectsOtherOrigins() throws Exception {
        MockHttpServletResponse response = preflight("https://untrusted.example");
        assertThat(response.getStatus()).isEqualTo(403);
        assertThat(response.getHeader("Access-Control-Allow-Origin")).isNull();
    }

    private MockHttpServletResponse preflight(String origin) throws Exception {
        MockHttpServletRequest request = new MockHttpServletRequest("OPTIONS", "/api/oggetti");
        request.addHeader("Origin", origin);
        request.addHeader("Access-Control-Request-Method", "POST");
        request.addHeader("Access-Control-Request-Headers", "Authorization, Content-Type");
        MockHttpServletResponse response = new MockHttpServletResponse();
        new CorsFilter(new CorsConfig().corsConfigurationSource(FRONTEND))
                .doFilter(request, response, (req, res) -> { });
        return response;
    }
}
