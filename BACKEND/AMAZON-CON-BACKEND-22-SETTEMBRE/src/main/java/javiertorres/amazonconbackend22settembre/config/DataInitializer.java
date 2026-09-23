package javiertorres.amazonconbackend22settembre.config;

import javiertorres.amazonconbackend22settembre.entity.Oggetto;
import javiertorres.amazonconbackend22settembre.entity.Role;
import javiertorres.amazonconbackend22settembre.entity.Utente;
import javiertorres.amazonconbackend22settembre.repository.OggettoRepository;
import javiertorres.amazonconbackend22settembre.repository.RoleRepository;
import javiertorres.amazonconbackend22settembre.repository.UtenteRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Component
public class DataInitializer implements ApplicationRunner {

    private final JdbcTemplate jdbc;
    private final OggettoRepository oggetti;
    private final UtenteRepository utenti;
    private final RoleRepository ruoli;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(OggettoRepository oggetti, UtenteRepository utenti, RoleRepository ruoli, PasswordEncoder passwordEncoder, JdbcTemplate jdbc) {
        this.jdbc = jdbc;
        this.oggetti = oggetti;
        this.utenti = utenti;
        this.ruoli = ruoli;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        ensureRoles();
        ensureUsers();
        migrateVariantConstraint();
        seedCatalogo();
    }

    private void ensureRoles() {
        ensureRole("USER");
        ensureRole("ADMIN");
    }

    private Role ensureRole(String name) {
        return ruoli.findByName(name).orElseGet(() -> ruoli.save(new Role(name)));
    }

    private void ensureUsers() {
        ensureUser(
                "utente.archivio00",
                "utente@archivio00.it",
                "password123",
                "Utente",
                "Archivio",
                "USER"
        );

        ensureUser(
                "javier.archivio00",
                "javier@archivio00.it",
                "admin123",
                "Javier",
                "Torres",
                "ADMIN"
        );
    }

    private void ensureUser(String username, String email, String password, String firstName, String lastName, String roleName) {
        if (utenti.existsByEmailIgnoreCase(email) || utenti.existsByUsernameIgnoreCase(username)) {
            return;
        }

        Utente utente = new Utente(username, email.toLowerCase(), passwordEncoder.encode(password), firstName, lastName);
        utente.getRoles().add(ensureRole(roleName));
        if ("ADMIN".equalsIgnoreCase(roleName)) {
            utente.getRoles().add(ensureRole("USER"));
        }
        utenti.save(utente);
    }

    private void migrateVariantConstraint() {
        jdbc.execute("""
            DO $$ DECLARE old_constraint record;
            BEGIN
              FOR old_constraint IN
                SELECT c.conname FROM pg_constraint c
                JOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = c.conkey[1]
                WHERE c.conrelid = 'oggetti'::regclass AND c.contype = 'u'
                  AND array_length(c.conkey, 1) = 1 AND a.attname = 'nome'
              LOOP
                EXECUTE format('ALTER TABLE oggetti DROP CONSTRAINT %I', old_constraint.conname);
              END LOOP;
            END $$;
            """);
    }

    private void seedCatalogo() {
        List<ProductSeed> prodotti = List.of(
                new ProductSeed("beckham-denim", "Beckham Baggy Denim Collab", "Denim", "", 750, true, true, 5, 7, "Denim Baggy - Beckham Edition"),
                new ProductSeed("artistic-denim", "Artistic Renaissance Denim (Spezzettata)", "Denim", "", 380, false, true, 4, 14, "Denim Ricamato Y2K Style"),
                new ProductSeed("cargo-denim", "Jeans Cargo Wide Leg '04", "Denim", "", 198, false, false, 4, 21, "Jeans Cargo Ripped '04"),
                new ProductSeed("acid-denim", "Denim Lavaggio Acido Vintage", "Denim", "", 214, false, false, 5, 28, "Denim Lavaggio Acido Wide Leg"),
                new ProductSeed("carpenter-denim", "Denim Carpenter Loose Fit", "Denim", "", 205, false, false, 4, 35, ""),
                new ProductSeed("cristiano-leather", "Cristiano Biker Leather Collab", "Pelle", "", 440, true, true, 4, 42, "Giacca in Pelle Biker - Cristiano Edition"),
                new ProductSeed("henry-varsity", "Varsity Jacket Henry Collab", "Pelle", "", 380, true, false, 5, 10, ""),
                new ProductSeed("chiodo-leather", "Chiodo in Pelle Vissuta Oversized", "Pelle", "", 389, false, false, 4, 17, "Chiodo in Pelle Biker Oversized"),
                new ProductSeed("trench-leather", "Trench Pelle Matrice '01", "Pelle", "", 365, false, false, 4, 24, "Trench in Pelle Matrice"),
                new ProductSeed("biposto-leather", "Giacca Pelle Biposto Y2K", "Pelle", "", 410, false, false, 5, 31, "Giacca Pelle Biposto '02"),
                new ProductSeed("ronaldinho-tee", "Ronaldinho Graphic Tee", "Top & Camicie", "", 180, true, true, 4, 38, ""),
                new ProductSeed("striped-brown", "Vintage 00s Striped Shirt", "Top & Camicie", "Marrone / panna", 170, false, false, 4, 45, ""),
                new ProductSeed("striped-grey", "Vintage 00s Striped Shirt", "Top & Camicie", "Grigio / nero", 175, false, false, 5, 13, ""),
                new ProductSeed("oldculture-cream", "Oldculture Graphic Sweatshirt", "Top & Camicie", "Panna / marrone", 270, false, false, 4, 20, ""),
                new ProductSeed("oldculture-black", "Oldculture Graphic Sweatshirt", "Top & Camicie", "Nero", 280, false, false, 4, 27, ""),
                new ProductSeed("balotelli-velour", "Balotelli Velour Tracktop Collab", "Trackwear", "", 310, true, true, 5, 34, "Tuta Velluto - Balotelli Edition"),
                new ProductSeed("satin-tracksuit", "Tuta Tecnico-Satinata Y2K", "Trackwear", "", 255, false, false, 4, 41, ""),
                new ProductSeed("wind-shell", "Technical Utility Wind Shell Jacket", "Outerwear", "", 215, false, false, 4, 9, "Giubbotto in Nylon Technical"),
                new ProductSeed("salvador-zip", "Salvador Corduroy Zip Jacket", "Outerwear", "", 245, false, false, 5, 16, ""),
                new ProductSeed("salvador-y2k", "Salvador Corduroy Y2K Jacket", "Outerwear", "", 265, false, false, 4, 23, ""),
                new ProductSeed("pirlo-corduroy", "Pirlo Corduroy Collab", "Pantaloni", "", 380, true, false, 4, 30, ""),
                new ProductSeed("dunk-low", "Nike Dunk Low Retro 'Y2K' Edition", "Scarpe", "", 220, false, false, 5, 37, ""),
                new ProductSeed("air-max", "Nike Air Max 95 Y2K Edition", "Scarpe", "", 240, false, false, 4, 44, "Nike Air Max 95 Y2K"),
                new ProductSeed("jordan-4", "Jordan 4 Retro Vintage '06", "Scarpe", "", 268, false, false, 4, 12, ""),
                new ProductSeed("metallic-puffer", "Puffer Jacket Metallizzato '01", "Outerwear", "", 298, false, false, 5, 19, "Puffer Jacket Metallizzato"),
                new ProductSeed("utility-parka", "Parka Tecnico Multi-Pockets", "Outerwear", "", 272, false, false, 4, 26, "Parka Tecnico '01"),
                new ProductSeed("padded-bomber", "Bomber Padded Y2K", "Outerwear", "", 286, false, false, 4, 33, "Giacca Bomber Padded"),
                new ProductSeed("climacool", "Adidas Climacool 2000 Archive", "Scarpe", "", 225, false, false, 5, 40, "Adidas Climacool 2000 Edition")
        );
        for (ProductSeed seed : prodotti) {
            // Stable key: restarting never overwrites admin edits, even after a rename.
            if (oggetti.findBySeedKey(seed.key()).isPresent()) continue;
            Oggetto product = oggetti.findByNomeIgnoreCaseAndVarianteIgnoreCase(seed.nome(), seed.variante())
                    .orElseGet(() -> seed.legacyName().isBlank() ? null :
                            oggetti.findByNomeIgnoreCaseAndVarianteIgnoreCase(seed.legacyName(), "").orElse(null));
            if (product != null && product.getSeedKey() != null) continue;
            String image = "/assets/products/" + seed.key() + ".jpg";
            if (product == null) {
                product = new Oggetto(seed.nome(), BigDecimal.valueOf(seed.prezzo()),
                        BigDecimal.valueOf(Math.round(seed.prezzo() * .35)), "Archivio 00 Studio", true, seed.featured(), image);
            } else if (product.getImmagineUrl().contains("images.unsplash.com")) {
                product.update(seed.nome(), product.getPrezzo(), product.getPrezzoAcquisto(), product.getFornitore(),
                        product.isPubblicato(), product.isInEvidenza(), image);
            }
            product.updateCatalogDetails(seed.special(), seed.rating(), seed.reviews(), seed.categoria(), seed.variante());
            product.setSeedKey(seed.key());
            oggetti.saveAndFlush(product);
        }
        // Retire only untouched legacy stock entries; retain IDs and favorite relationships.
        List<String> legacyNames = List.of(
                "Jeans Baggy Off-White Y2K",
                "Denim Lavaggio Acido Wide Leg",
                "Jeans Cargo Ripped '04",
                "Denim Ricamato Y2K Style",
                "Jeans Slim Vintage Wash",
                "Denim Bicolor 2001 Straight",
                "Denim Baggy - Beckham Edition",
                "Chiodo in Pelle Biker Oversized",
                "Giacca Pelle Biposto '02",
                "Trench in Pelle Matrice",
                "Gilet in Pelle Vintage",
                "Giacca in Pelle Biker - Cristiano Edition",
                "Pelle Stretch Moto '01",
                "Piumino in Pelle Soft",
                "Cappotto in Pelle Nero Vintage",
                "Tuta in Velluto Zip-Up",
                "Tracktop Bicolore Y2K",
                "Pantaloni Tuta Baggy Side-Stripe",
                "Tuta Velluto - Balotelli Edition",
                "Jersey Tecnico Oversized '03",
                "Puffer Jacket Metallizzato",
                "Parka Tecnico '01",
                "Giacca Bomber Padded",
                "Parka Oversized Fleece",
                "Giubbotto in Nylon Technical",
                "Nike Air Max 95 Y2K",
                "Jordan 4 Retro Vintage '06",
                "Adidas Climacool 2000 Edition"
        );
        for (Oggetto product : oggetti.findAll()) {
            if (product.getSeedKey() == null && legacyNames.contains(product.getNome())
                    && product.getImmagineUrl().contains("images.unsplash.com")) {
                product.update(product.getNome(), product.getPrezzo(), product.getPrezzoAcquisto(), product.getFornitore(),
                        false, false, Oggetto.DEFAULT_IMAGE_URL);
                oggetti.save(product);
            }
        }
    }

    private record ProductSeed(String key, String nome, String categoria, String variante, int prezzo,
                               boolean special, boolean featured, int rating, int reviews, String legacyName) {}
}
