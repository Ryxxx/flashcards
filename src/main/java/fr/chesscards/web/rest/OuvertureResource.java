package fr.chesscards.web.rest;

import fr.chesscards.domain.Ouverture;
import fr.chesscards.repository.OuvertureRepository;
import fr.chesscards.service.OuvertureService;
import fr.chesscards.web.rest.errors.BadRequestAlertException;
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
 * REST controller for managing {@link fr.chesscards.domain.Ouverture}.
 */
@RestController
@RequestMapping("/api")
public class OuvertureResource {

    private final Logger log = LoggerFactory.getLogger(OuvertureResource.class);

    private static final String ENTITY_NAME = "ouverture";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final OuvertureService ouvertureService;

    private final OuvertureRepository ouvertureRepository;

    public OuvertureResource(OuvertureService ouvertureService, OuvertureRepository ouvertureRepository) {
        this.ouvertureService = ouvertureService;
        this.ouvertureRepository = ouvertureRepository;
    }

    /**
     * {@code POST  /ouvertures} : Create a new ouverture.
     *
     * @param ouverture the ouverture to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new ouverture, or with status {@code 400 (Bad Request)} if the ouverture has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/ouvertures")
    public ResponseEntity<Ouverture> createOuverture(@RequestBody Ouverture ouverture) throws URISyntaxException {
        log.debug("REST request to save Ouverture : {}", ouverture);
        if (ouverture.getId() != null) {
            throw new BadRequestAlertException("A new ouverture cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Ouverture result = ouvertureService.save(ouverture);
        return ResponseEntity
            .created(new URI("/api/ouvertures/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /ouvertures/:id} : Updates an existing ouverture.
     *
     * @param id the id of the ouverture to save.
     * @param ouverture the ouverture to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated ouverture,
     * or with status {@code 400 (Bad Request)} if the ouverture is not valid,
     * or with status {@code 500 (Internal Server Error)} if the ouverture couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/ouvertures/{id}")
    public ResponseEntity<Ouverture> updateOuverture(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Ouverture ouverture
    ) throws URISyntaxException {
        log.debug("REST request to update Ouverture : {}, {}", id, ouverture);
        if (ouverture.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, ouverture.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!ouvertureRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Ouverture result = ouvertureService.save(ouverture);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, ouverture.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /ouvertures/:id} : Partial updates given fields of an existing ouverture, field will ignore if it is null
     *
     * @param id the id of the ouverture to save.
     * @param ouverture the ouverture to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated ouverture,
     * or with status {@code 400 (Bad Request)} if the ouverture is not valid,
     * or with status {@code 404 (Not Found)} if the ouverture is not found,
     * or with status {@code 500 (Internal Server Error)} if the ouverture couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/ouvertures/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Ouverture> partialUpdateOuverture(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Ouverture ouverture
    ) throws URISyntaxException {
        log.debug("REST request to partial update Ouverture partially : {}, {}", id, ouverture);
        if (ouverture.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, ouverture.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!ouvertureRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Ouverture> result = ouvertureService.partialUpdate(ouverture);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, ouverture.getId().toString())
        );
    }

    /**
     * {@code GET  /ouvertures} : get all the ouvertures.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of ouvertures in body.
     */
    @GetMapping("/ouvertures")
    public List<Ouverture> getAllOuvertures() {
        log.debug("REST request to get all Ouvertures");
        return ouvertureService.findAll();
    }

    /**
     * {@code GET  /ouvertures/:id} : get the "id" ouverture.
     *
     * @param id the id of the ouverture to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the ouverture, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/ouvertures/{id}")
    public ResponseEntity<Ouverture> getOuverture(@PathVariable Long id) {
        log.debug("REST request to get Ouverture : {}", id);
        Optional<Ouverture> ouverture = ouvertureService.findOne(id);
        return ResponseUtil.wrapOrNotFound(ouverture);
    }

    /**
     * {@code DELETE  /ouvertures/:id} : delete the "id" ouverture.
     *
     * @param id the id of the ouverture to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/ouvertures/{id}")
    public ResponseEntity<Void> deleteOuverture(@PathVariable Long id) {
        log.debug("REST request to delete Ouverture : {}", id);
        ouvertureService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
