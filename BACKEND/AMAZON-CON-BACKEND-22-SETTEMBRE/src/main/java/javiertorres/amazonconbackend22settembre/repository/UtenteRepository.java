package javiertorres.amazonconbackend22settembre.repository;
import javiertorres.amazonconbackend22settembre.entity.Utente; import java.util.*; import org.springframework.data.jpa.repository.JpaRepository;
public interface UtenteRepository extends JpaRepository<Utente,UUID> { Optional<Utente> findByEmailIgnoreCase(String email); boolean existsByEmailIgnoreCase(String email); boolean existsByUsernameIgnoreCase(String username); }
