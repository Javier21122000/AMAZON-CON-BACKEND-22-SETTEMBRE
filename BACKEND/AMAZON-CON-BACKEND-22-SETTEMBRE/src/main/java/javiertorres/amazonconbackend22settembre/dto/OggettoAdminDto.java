package javiertorres.amazonconbackend22settembre.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record OggettoAdminDto(UUID id, String nome, BigDecimal prezzo, BigDecimal prezzoAcquisto, String fornitore, boolean pubblicato, boolean inEvidenza, String immagineUrl, Instant createdAt,
        @JsonProperty("isSpecialEdition") boolean isSpecialEdition, int rating, int numeroRecensioni,
        String categoria, String variante) {}
