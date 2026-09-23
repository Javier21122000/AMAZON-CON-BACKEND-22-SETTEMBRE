package javiertorres.amazonconbackend22settembre.service;

import javiertorres.amazonconbackend22settembre.dto.*;
import javiertorres.amazonconbackend22settembre.entity.Oggetto;
import javiertorres.amazonconbackend22settembre.exception.ApiExceptions;
import javiertorres.amazonconbackend22settembre.repository.OggettoRepository;
import java.util.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class OggettoService {
    private final OggettoRepository repo;
    public OggettoService(OggettoRepository repo) { this.repo = repo; }

    public List<OggettoPublicDto> publicList() { return repo.findByPubblicatoTrueOrderByCreatedAtDesc().stream().map(OggettoService::publicDto).toList(); }
    public OggettoPublicDto publicOne(UUID id) { return publicDto(repo.findByIdAndPubblicatoTrue(id).orElseThrow(() -> new ApiExceptions.NotFound("Oggetto non trovato"))); }
    public List<OggettoAdminDto> all() { return repo.findAll().stream().map(this::adminDto).toList(); }
    public OggettoAdminDto one(UUID id) { return adminDto(find(id)); }

    public OggettoAdminDto create(OggettoRequest input) {
        checkDuplicate(input.nome().trim(), input.variante(), null);
        Oggetto product = new Oggetto(input.nome().trim(), input.prezzo(), input.prezzoAcquisto(), input.fornitore().trim(), input.pubblicato(), input.inEvidenza(), input.immagineUrl());
        applyDetails(product, input);
        return adminDto(repo.save(product));
    }

    public OggettoAdminDto update(UUID id, OggettoRequest input) {
        Oggetto product = find(id);
        checkDuplicate(input.nome().trim(), input.variante() == null ? product.getVariante() : input.variante(), id);
        product.update(input.nome().trim(), input.prezzo(), input.prezzoAcquisto(), input.fornitore().trim(), input.pubblicato(), input.inEvidenza(), input.immagineUrl());
        applyDetails(product, input);
        return adminDto(repo.save(product));
    }

    private void applyDetails(Oggetto product, OggettoRequest input) {
        // Older clients can omit new fields without erasing catalog metadata.
        product.updateCatalogDetails(
                input.isSpecialEdition() == null ? product.isSpecialEdition() : input.isSpecialEdition(),
                input.rating() == null ? product.getRating() : input.rating(),
                input.numeroRecensioni() == null ? product.getNumeroRecensioni() : input.numeroRecensioni(),
                input.categoria() == null ? product.getCategoria() : input.categoria(),
                input.variante() == null ? product.getVariante() : input.variante());
    }

    private void checkDuplicate(String nome, String variante, UUID id) {
        repo.findByNomeIgnoreCaseAndVarianteIgnoreCase(nome, variante == null ? "" : variante.trim())
                .filter(existing -> !existing.getId().equals(id))
                .ifPresent(existing -> { throw new ApiExceptions.Duplicate("Nome e variante già presenti"); });
    }

    private Oggetto find(UUID id) { return repo.findById(id).orElseThrow(() -> new ApiExceptions.NotFound("Oggetto non trovato")); }
    public void delete(UUID id) { repo.delete(find(id)); }

    public static OggettoPublicDto publicDto(Oggetto product) {
        return new OggettoPublicDto(product.getId(), product.getNome(), product.getPrezzo(), product.isInEvidenza(), product.getImmagineUrl(), product.isSpecialEdition(), product.getRating(), product.getNumeroRecensioni(), product.getCategoria(), product.getVariante());
    }

    private OggettoAdminDto adminDto(Oggetto product) {
        return new OggettoAdminDto(product.getId(), product.getNome(), product.getPrezzo(), product.getPrezzoAcquisto(), product.getFornitore(), product.isPubblicato(), product.isInEvidenza(), product.getImmagineUrl(), product.getCreatedAt(), product.isSpecialEdition(), product.getRating(), product.getNumeroRecensioni(), product.getCategoria(), product.getVariante());
    }
}
