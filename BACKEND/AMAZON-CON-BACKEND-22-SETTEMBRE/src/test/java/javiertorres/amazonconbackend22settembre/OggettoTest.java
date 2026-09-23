package javiertorres.amazonconbackend22settembre;

import javiertorres.amazonconbackend22settembre.entity.Oggetto;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;

import static org.assertj.core.api.Assertions.assertThat;

class OggettoTest {

    @Test
    void inEvidenzaDefaultsToFalse() {
        Oggetto oggetto = new Oggetto(
                "Jeans Baggy Off-White Y2K",
                new BigDecimal("159.00"),
                new BigDecimal("52.00"),
                "Studio Milano",
                true
        );

        assertThat(oggetto.isInEvidenza()).isFalse();
    }
}
