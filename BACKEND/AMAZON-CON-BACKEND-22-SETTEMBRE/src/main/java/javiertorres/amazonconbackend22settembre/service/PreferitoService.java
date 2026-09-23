package javiertorres.amazonconbackend22settembre.service;

import jakarta.transaction.Transactional;
import javiertorres.amazonconbackend22settembre.dto.PreferitoDto;
import javiertorres.amazonconbackend22settembre.entity.*;
import javiertorres.amazonconbackend22settembre.exception.ApiExceptions;
import javiertorres.amazonconbackend22settembre.repository.*;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@Transactional
public class PreferitoService {
    private final PreferitoRepository preferiti;
    private final UtenteRepository utenti;
    private final OggettoRepository oggetti;

    public PreferitoService(PreferitoRepository p, UtenteRepository u, OggettoRepository o) {
        preferiti = p;
        utenti = u;
        oggetti = o;
    }

    public List<PreferitoDto> list(String email) {
        Utente u = utente(email);
        return preferiti.findByUtenteId(u.getId()).stream().map(this::dto).toList();
    }

    public PreferitoDto add(String email, UUID id) {
        Utente u = utente(email);
        if (preferiti.existsByUtenteIdAndOggettoId(u.getId(), id)) {
            throw new ApiExceptions.Duplicate("Oggetto già preferito");
        }
        Oggetto o = oggetti.findByIdAndPubblicatoTrue(id)
                .orElseThrow(() -> new ApiExceptions.NotFound("Oggetto non trovato"));
        return dto(preferiti.save(new Preferito(u, o)));
    }

    public void remove(String email, UUID id) {
        Utente u = utente(email);
        if (!preferiti.existsByUtenteIdAndOggettoId(u.getId(), id)) {
            throw new ApiExceptions.NotFound("Preferito non trovato");
        }
        preferiti.deleteByUtenteIdAndOggettoId(u.getId(), id);
    }

    private PreferitoDto dto(Preferito p) {
        Oggetto o = p.getOggetto();
        return new PreferitoDto(
                p.getId(),
                OggettoService.publicDto(o),
                p.getCreatedAt()
        );
    }

    private Utente utente(String e) {
        return utenti.findByEmailIgnoreCase(e)
                .orElseThrow(() -> new ApiExceptions.NotFound("Utente non trovato"));
    }
}
