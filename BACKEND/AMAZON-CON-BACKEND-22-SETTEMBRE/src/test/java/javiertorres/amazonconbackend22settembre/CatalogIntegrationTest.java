package javiertorres.amazonconbackend22settembre;

import com.fasterxml.jackson.databind.ObjectMapper;
import javiertorres.amazonconbackend22settembre.config.DataInitializer;
import javiertorres.amazonconbackend22settembre.dto.OggettoRequest;
import javiertorres.amazonconbackend22settembre.repository.OggettoRepository;
import javiertorres.amazonconbackend22settembre.service.OggettoService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.DefaultApplicationArguments;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
@Transactional
class CatalogIntegrationTest {
    @Autowired OggettoRepository products;
    @Autowired OggettoService service;
    @Autowired DataInitializer initializer;
    @Autowired ObjectMapper mapper;

    @Test
    void seedsExactNamesVariantsAndPublicMetadata() throws Exception {
        var catalog = service.publicList();
        assertThat(catalog).hasSize(28);
        assertThat(catalog.stream().filter(p -> p.isSpecialEdition())).hasSize(6);
        assertThat(catalog.stream().filter(p -> p.nome().equals("Vintage 00s Striped Shirt")))
                .hasSize(2).extracting(p -> p.variante()).doesNotHaveDuplicates();
        for (var product : catalog) {
            assertThat(product.rating()).isBetween(1, 5);
            assertThat(product.numeroRecensioni()).isPositive();
            assertThat(product.immagineUrl()).startsWith("/assets/products/").endsWith(".jpg");
        }
        var json = mapper.readTree(mapper.writeValueAsString(catalog.get(0)));
        assertThat(json.has("isSpecialEdition")).isTrue();
        assertThat(json.has("specialEdition")).isFalse();
        assertThat(json.has("prezzoAcquisto")).isFalse();
        assertThat(json.has("fornitore")).isFalse();
    }

    @Test
    void restartPreservesAdminChangesAndDoesNotDuplicateRenamedSeeds() {
        var product = products.findBySeedKey("beckham-denim").orElseThrow();
        var id = product.getId();
        service.update(id, new OggettoRequest("Beckham modificato", product.getPrezzo(), product.getPrezzoAcquisto(),
                product.getFornitore(), true, false, product.getImmagineUrl(), false, null, null, null, null));
        products.flush();
        initializer.run(new DefaultApplicationArguments());
        initializer.run(new DefaultApplicationArguments());
        assertThat(products.count()).isEqualTo(28);
        var updated = service.publicOne(id);
        assertThat(updated.nome()).isEqualTo("Beckham modificato");
        assertThat(updated.isSpecialEdition()).isFalse();
        assertThat(updated.inEvidenza()).isFalse();
        assertThat(updated.rating()).isPositive();
        assertThat(updated.categoria()).isEqualTo("Denim");
    }
}
