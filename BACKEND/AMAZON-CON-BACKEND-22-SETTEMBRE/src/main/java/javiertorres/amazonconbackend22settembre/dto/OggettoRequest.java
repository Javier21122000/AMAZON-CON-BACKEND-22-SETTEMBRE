package javiertorres.amazonconbackend22settembre.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record OggettoRequest(
        @NotBlank @Size(max=180) String nome,
        @NotNull @PositiveOrZero @Digits(integer=4,fraction=2) BigDecimal prezzo,
        @NotNull @PositiveOrZero @Digits(integer=4,fraction=2) BigDecimal prezzoAcquisto,
        @NotBlank @Size(max=180) String fornitore,
        boolean pubblicato, boolean inEvidenza,
        @Size(max=500) String immagineUrl,
        @JsonProperty("isSpecialEdition") Boolean isSpecialEdition,
        @Min(0) @Max(5) Integer rating,
        @PositiveOrZero Integer numeroRecensioni,
        @Size(max=80) @Pattern(regexp="^(|Denim|Pelle|Top & Camicie|Trackwear|Outerwear|Pantaloni|Scarpe)$") String categoria,
        @Size(max=80) String variante
) {}
