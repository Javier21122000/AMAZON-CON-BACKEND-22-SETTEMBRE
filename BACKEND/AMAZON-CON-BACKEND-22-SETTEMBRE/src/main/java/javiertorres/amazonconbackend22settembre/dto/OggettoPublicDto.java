package javiertorres.amazonconbackend22settembre.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record OggettoPublicDto(UUID id, String nome, BigDecimal prezzo, boolean inEvidenza, String immagineUrl,
        @JsonProperty("isSpecialEdition") boolean isSpecialEdition, int rating, int numeroRecensioni,
        String categoria, String variante) {}
