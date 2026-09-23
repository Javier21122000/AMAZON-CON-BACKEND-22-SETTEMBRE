package javiertorres.amazonconbackend22settembre.repository;

import javiertorres.amazonconbackend22settembre.entity.Preferito;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.*;

public interface PreferitoRepository extends JpaRepository<Preferito, UUID> {
    @EntityGraph(attributePaths = "oggetto")
    List<Preferito> findByUtenteId(UUID utenteId);

    Optional<Preferito> findByUtenteIdAndOggettoId(UUID utenteId, UUID oggettoId);
    boolean existsByUtenteIdAndOggettoId(UUID utenteId, UUID oggettoId);
    void deleteByUtenteIdAndOggettoId(UUID utenteId, UUID oggettoId);
}
