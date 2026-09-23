package javiertorres.amazonconbackend22settembre.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "oggetti", uniqueConstraints = @UniqueConstraint(name = "uk_oggetto_nome_variante", columnNames = {"nome", "variante"}))
public class Oggetto {
    public static final String DEFAULT_IMAGE_URL = "/assets/products/unavailable.svg";

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 180)
    private String nome;

    @Column(nullable = false, precision = 6, scale = 2)
    private BigDecimal prezzo;

    @Column(nullable = false, precision = 6, scale = 2)
    private BigDecimal prezzoAcquisto;

    @Column(nullable = false, length = 180)
    private String fornitore;

    @Column(nullable = false)
    private boolean pubblicato = false;

    @Column(nullable = false)
    private boolean inEvidenza = false;

    @Column(nullable = false, columnDefinition = "boolean default false")
    private boolean specialEdition = false;

    @Column(nullable = false, columnDefinition = "integer default 0")
    private int rating = 0;

    @Column(nullable = false, columnDefinition = "integer default 0")
    private int numeroRecensioni = 0;

    @Column(nullable = false, length = 80, columnDefinition = "varchar(80) default ''")
    private String categoria = "";

    @Column(nullable = false, length = 80, columnDefinition = "varchar(80) default ''")
    private String variante = "";

    @Column(unique = true, length = 100)
    private String seedKey;

    @Column(nullable = false, length = 500)
    private String immagineUrl = DEFAULT_IMAGE_URL;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    protected Oggetto() {
    }

    public Oggetto(String nome, BigDecimal prezzo, BigDecimal prezzoAcquisto, String fornitore, boolean pubblicato) {
        this(nome, prezzo, prezzoAcquisto, fornitore, pubblicato, false, DEFAULT_IMAGE_URL);
    }

    public Oggetto(String nome, BigDecimal prezzo, BigDecimal prezzoAcquisto, String fornitore, boolean pubblicato, boolean inEvidenza, String immagineUrl) {
        this.nome = nome;
        this.prezzo = prezzo;
        this.prezzoAcquisto = prezzoAcquisto;
        this.fornitore = fornitore;
        this.pubblicato = pubblicato;
        this.inEvidenza = inEvidenza;
        this.immagineUrl = immagineUrl == null || immagineUrl.isBlank() ? DEFAULT_IMAGE_URL : immagineUrl;
    }

    @PrePersist
    void onCreate() {
        createdAt = Instant.now();
    }

    public boolean isSpecialEdition() { return specialEdition; }
    public int getRating() { return rating; }
    public int getNumeroRecensioni() { return numeroRecensioni; }
    public String getCategoria() { return categoria; }
    public String getVariante() { return variante; }
    public String getSeedKey() { return seedKey; }
    public void setSeedKey(String seedKey) { this.seedKey = seedKey; }
    public void setPubblicato(boolean pubblicato) { this.pubblicato = pubblicato; }

    public void updateCatalogDetails(boolean specialEdition, int rating, int numeroRecensioni, String categoria, String variante) {
        if (rating < 0 || rating > 5 || numeroRecensioni < 0) throw new IllegalArgumentException("Recensioni non valide");
        this.specialEdition = specialEdition;
        this.rating = rating;
        this.numeroRecensioni = numeroRecensioni;
        this.categoria = categoria == null ? "" : categoria.trim();
        this.variante = variante == null ? "" : variante.trim();
    }

    public UUID getId() { return id; }
    public String getNome() { return nome; }
    public BigDecimal getPrezzo() { return prezzo; }
    public BigDecimal getPrezzoAcquisto() { return prezzoAcquisto; }
    public String getFornitore() { return fornitore; }
    public boolean isPubblicato() { return pubblicato; }
    public boolean isInEvidenza() { return inEvidenza; }
    public String getImmagineUrl() { return immagineUrl; }
    public Instant getCreatedAt() { return createdAt; }

    public void update(String nome, BigDecimal prezzo, BigDecimal prezzoAcquisto, String fornitore, boolean pubblicato, boolean inEvidenza, String immagineUrl) {
        this.nome = nome;
        this.prezzo = prezzo;
        this.prezzoAcquisto = prezzoAcquisto;
        this.fornitore = fornitore;
        this.pubblicato = pubblicato;
        this.inEvidenza = inEvidenza;
        this.immagineUrl = immagineUrl == null || immagineUrl.isBlank() ? DEFAULT_IMAGE_URL : immagineUrl;
    }
}
