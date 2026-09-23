package javiertorres.amazonconbackend22settembre.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name="preferiti", uniqueConstraints=@UniqueConstraint(name="uk_preferito_utente_oggetto", columnNames={"utente_id","oggetto_id"}))
public class Preferito {
    @Id @GeneratedValue(strategy=GenerationType.UUID) private UUID id;
    @ManyToOne(fetch=FetchType.LAZY, optional=false) @JoinColumn(name="utente_id", nullable=false) private Utente utente;
    @ManyToOne(fetch=FetchType.LAZY, optional=false) @JoinColumn(name="oggetto_id", nullable=false) private Oggetto oggetto;
    @Column(nullable=false, updatable=false) private Instant createdAt;
    protected Preferito() {}
    public Preferito(Utente utente, Oggetto oggetto){this.utente=utente;this.oggetto=oggetto;}
    @PrePersist void onCreate(){createdAt=Instant.now();}
    public UUID getId(){return id;} public Utente getUtente(){return utente;} public Oggetto getOggetto(){return oggetto;} public Instant getCreatedAt(){return createdAt;}
}
