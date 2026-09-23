package javiertorres.amazonconbackend22settembre.repository;

import javiertorres.amazonconbackend22settembre.entity.Oggetto;
import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OggettoRepository extends JpaRepository<Oggetto, UUID> {
    List<Oggetto> findByPubblicatoTrueOrderByCreatedAtDesc();
    Optional<Oggetto> findByIdAndPubblicatoTrue(UUID id);
    Optional<Oggetto> findBySeedKey(String seedKey);
    Optional<Oggetto> findByNomeIgnoreCaseAndVarianteIgnoreCase(String nome, String variante);
}
