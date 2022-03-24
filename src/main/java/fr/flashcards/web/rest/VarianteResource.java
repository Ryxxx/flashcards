package fr.flashcards.web.rest;

import fr.flashcards.domain.Variante;
import fr.flashcards.repository.VarianteRepository;
import fr.flashcards.service.VarianteService;
import fr.flashcards.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link fr.flashcards.domain.Variante}.
 */
@RestController
@RequestMapping("/api")
public class VarianteResource {

    private final Logger log = LoggerFactory.getLogger(VarianteResource.class);

    private static final String ENTITY_NAME = "variante";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final VarianteService varianteService;

    private final VarianteRepository varianteRepository;

    public VarianteResource(VarianteService varianteService, VarianteRepository varianteRepository) {
        this.varianteService = varianteService;
        this.varianteRepository = varianteRepository;
    }

    /**
     * {@code POST  /variantes} : Create a new variante.
     *
     * @param variante the variante to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new variante, or with status {@code 400 (Bad Request)} if the variante has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/variantes")
    public ResponseEntity<Variante> createVariante(@RequestBody Variante variante) throws URISyntaxException {
        log.debug("REST request to save Variante : {}", variante);
        if (variante.getId() != null) {
            throw new BadRequestAlertException("A new variante cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Variante result = varianteService.save(variante);
        return ResponseEntity
            .created(new URI("/api/variantes/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /variantes/:id} : Updates an existing variante.
     *
     * @param id the id of the variante to save.
     * @param variante the variante to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated variante,
     * or with status {@code 400 (Bad Request)} if the variante is not valid,
     * or with status {@code 500 (Internal Server Error)} if the variante couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/variantes/{id}")
    public ResponseEntity<Variante> updateVariante(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Variante variante
    ) throws URISyntaxException {
        log.debug("REST request to update Variante : {}, {}", id, variante);
        if (variante.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, variante.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!varianteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Variante result = varianteService.save(variante);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, variante.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /variantes/:id} : Partial updates given fields of an existing variante, field will ignore if it is null
     *
     * @param id the id of the variante to save.
     * @param variante the variante to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated variante,
     * or with status {@code 400 (Bad Request)} if the variante is not valid,
     * or with status {@code 404 (Not Found)} if the variante is not found,
     * or with status {@code 500 (Internal Server Error)} if the variante couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/variantes/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Variante> partialUpdateVariante(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Variante variante
    ) throws URISyntaxException {
        log.debug("REST request to partial update Variante partially : {}, {}", id, variante);
        if (variante.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, variante.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!varianteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Variante> result = varianteService.partialUpdate(variante);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, variante.getId().toString())
        );
    }

    /**
     * {@code GET  /variantes} : get all the variantes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of variantes in body.
     */
    @GetMapping("/variantes")
    public List<Variante> getAllVariantes() {
        log.debug("REST request to get all Variantes");
        return varianteService.findAll();
    }

    /**
     * {@code GET  /variantes/:id} : get the "id" variante.
     *
     * @param id the id of the variante to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the variante, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/variantes/{id}")
    public ResponseEntity<Variante> getVariante(@PathVariable Long id) {
        log.debug("REST request to get Variante : {}", id);
        Optional<Variante> variante = varianteService.findOne(id);
        return ResponseUtil.wrapOrNotFound(variante);
    }

    /**
     * {@code DELETE  /variantes/:id} : delete the "id" variante.
     *
     * @param id the id of the variante to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/variantes/{id}")
    public ResponseEntity<Void> deleteVariante(@PathVariable Long id) {
        log.debug("REST request to delete Variante : {}", id);
        varianteService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
