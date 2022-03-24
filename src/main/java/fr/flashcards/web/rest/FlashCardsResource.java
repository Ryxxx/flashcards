package fr.flashcards.web.rest;

import fr.flashcards.domain.FlashCards;
import fr.flashcards.repository.FlashCardsRepository;
import fr.flashcards.service.FlashCardsService;
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
 * REST controller for managing {@link fr.flashcards.domain.FlashCards}.
 */
@RestController
@RequestMapping("/api")
public class FlashCardsResource {

    private final Logger log = LoggerFactory.getLogger(FlashCardsResource.class);

    private static final String ENTITY_NAME = "flashCards";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FlashCardsService flashCardsService;

    private final FlashCardsRepository flashCardsRepository;

    public FlashCardsResource(FlashCardsService flashCardsService, FlashCardsRepository flashCardsRepository) {
        this.flashCardsService = flashCardsService;
        this.flashCardsRepository = flashCardsRepository;
    }

    /**
     * {@code POST  /flash-cards} : Create a new flashCards.
     *
     * @param flashCards the flashCards to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new flashCards, or with status {@code 400 (Bad Request)} if the flashCards has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/flash-cards")
    public ResponseEntity<FlashCards> createFlashCards(@RequestBody FlashCards flashCards) throws URISyntaxException {
        log.debug("REST request to save FlashCards : {}", flashCards);
        if (flashCards.getId() != null) {
            throw new BadRequestAlertException("A new flashCards cannot already have an ID", ENTITY_NAME, "idexists");
        }
        FlashCards result = flashCardsService.save(flashCards);
        return ResponseEntity
            .created(new URI("/api/flash-cards/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /flash-cards/:id} : Updates an existing flashCards.
     *
     * @param id the id of the flashCards to save.
     * @param flashCards the flashCards to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated flashCards,
     * or with status {@code 400 (Bad Request)} if the flashCards is not valid,
     * or with status {@code 500 (Internal Server Error)} if the flashCards couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/flash-cards/{id}")
    public ResponseEntity<FlashCards> updateFlashCards(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody FlashCards flashCards
    ) throws URISyntaxException {
        log.debug("REST request to update FlashCards : {}, {}", id, flashCards);
        if (flashCards.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, flashCards.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!flashCardsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        FlashCards result = flashCardsService.save(flashCards);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, flashCards.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /flash-cards/:id} : Partial updates given fields of an existing flashCards, field will ignore if it is null
     *
     * @param id the id of the flashCards to save.
     * @param flashCards the flashCards to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated flashCards,
     * or with status {@code 400 (Bad Request)} if the flashCards is not valid,
     * or with status {@code 404 (Not Found)} if the flashCards is not found,
     * or with status {@code 500 (Internal Server Error)} if the flashCards couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/flash-cards/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<FlashCards> partialUpdateFlashCards(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody FlashCards flashCards
    ) throws URISyntaxException {
        log.debug("REST request to partial update FlashCards partially : {}, {}", id, flashCards);
        if (flashCards.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, flashCards.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!flashCardsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<FlashCards> result = flashCardsService.partialUpdate(flashCards);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, flashCards.getId().toString())
        );
    }

    /**
     * {@code GET  /flash-cards} : get all the flashCards.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of flashCards in body.
     */
    @GetMapping("/flash-cards")
    public List<FlashCards> getAllFlashCards() {
        log.debug("REST request to get all FlashCards");
        return flashCardsService.findAll();
    }

    /**
     * {@code GET  /flash-cards/:id} : get the "id" flashCards.
     *
     * @param id the id of the flashCards to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the flashCards, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/flash-cards/{id}")
    public ResponseEntity<FlashCards> getFlashCards(@PathVariable Long id) {
        log.debug("REST request to get FlashCards : {}", id);
        Optional<FlashCards> flashCards = flashCardsService.findOne(id);
        return ResponseUtil.wrapOrNotFound(flashCards);
    }

    /**
     * {@code DELETE  /flash-cards/:id} : delete the "id" flashCards.
     *
     * @param id the id of the flashCards to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/flash-cards/{id}")
    public ResponseEntity<Void> deleteFlashCards(@PathVariable Long id) {
        log.debug("REST request to delete FlashCards : {}", id);
        flashCardsService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
