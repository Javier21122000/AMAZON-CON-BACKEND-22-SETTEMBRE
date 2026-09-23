package javiertorres.amazonconbackend22settembre.dto;
import java.util.UUID;
import java.time.Instant;
public record PreferitoDto(UUID id, OggettoPublicDto oggetto, Instant createdAt) {}
