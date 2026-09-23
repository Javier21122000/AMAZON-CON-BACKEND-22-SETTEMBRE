package javiertorres.amazonconbackend22settembre.repository;
import javiertorres.amazonconbackend22settembre.entity.Role; import java.util.*; import org.springframework.data.jpa.repository.JpaRepository;
public interface RoleRepository extends JpaRepository<Role,UUID> { Optional<Role> findByName(String name); }
