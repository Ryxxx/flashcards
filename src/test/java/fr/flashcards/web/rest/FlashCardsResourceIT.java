package fr.flashcards.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import fr.flashcards.IntegrationTest;
import fr.flashcards.domain.FlashCards;
import fr.flashcards.repository.FlashCardsRepository;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link FlashCardsResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class FlashCardsResourceIT {

    private static final Integer DEFAULT_REPETITIONS = 1;
    private static final Integer UPDATED_REPETITIONS = 2;

    private static final Integer DEFAULT_QUALITE = 1;
    private static final Integer UPDATED_QUALITE = 2;

    private static final Double DEFAULT_FACILITE = 1D;
    private static final Double UPDATED_FACILITE = 2D;

    private static final Integer DEFAULT_INTERVALLE = 1;
    private static final Integer UPDATED_INTERVALLE = 2;

    private static final LocalDate DEFAULT_PROCHAIN_ENTRAINEMENT = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_PROCHAIN_ENTRAINEMENT = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/flash-cards";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private FlashCardsRepository flashCardsRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restFlashCardsMockMvc;

    private FlashCards flashCards;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static FlashCards createEntity(EntityManager em) {
        FlashCards flashCards = new FlashCards()
            .repetitions(DEFAULT_REPETITIONS)
            .qualite(DEFAULT_QUALITE)
            .facilite(DEFAULT_FACILITE)
            .intervalle(DEFAULT_INTERVALLE)
            .prochainEntrainement(DEFAULT_PROCHAIN_ENTRAINEMENT);
        return flashCards;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static FlashCards createUpdatedEntity(EntityManager em) {
        FlashCards flashCards = new FlashCards()
            .repetitions(UPDATED_REPETITIONS)
            .qualite(UPDATED_QUALITE)
            .facilite(UPDATED_FACILITE)
            .intervalle(UPDATED_INTERVALLE)
            .prochainEntrainement(UPDATED_PROCHAIN_ENTRAINEMENT);
        return flashCards;
    }

    @BeforeEach
    public void initTest() {
        flashCards = createEntity(em);
    }

    @Test
    @Transactional
    void createFlashCards() throws Exception {
        int databaseSizeBeforeCreate = flashCardsRepository.findAll().size();
        // Create the FlashCards
        restFlashCardsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(flashCards)))
            .andExpect(status().isCreated());

        // Validate the FlashCards in the database
        List<FlashCards> flashCardsList = flashCardsRepository.findAll();
        assertThat(flashCardsList).hasSize(databaseSizeBeforeCreate + 1);
        FlashCards testFlashCards = flashCardsList.get(flashCardsList.size() - 1);
        assertThat(testFlashCards.getRepetitions()).isEqualTo(DEFAULT_REPETITIONS);
        assertThat(testFlashCards.getQualite()).isEqualTo(DEFAULT_QUALITE);
        assertThat(testFlashCards.getFacilite()).isEqualTo(DEFAULT_FACILITE);
        assertThat(testFlashCards.getIntervalle()).isEqualTo(DEFAULT_INTERVALLE);
        assertThat(testFlashCards.getProchainEntrainement()).isEqualTo(DEFAULT_PROCHAIN_ENTRAINEMENT);
    }

    @Test
    @Transactional
    void createFlashCardsWithExistingId() throws Exception {
        // Create the FlashCards with an existing ID
        flashCards.setId(1L);

        int databaseSizeBeforeCreate = flashCardsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restFlashCardsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(flashCards)))
            .andExpect(status().isBadRequest());

        // Validate the FlashCards in the database
        List<FlashCards> flashCardsList = flashCardsRepository.findAll();
        assertThat(flashCardsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllFlashCards() throws Exception {
        // Initialize the database
        flashCardsRepository.saveAndFlush(flashCards);

        // Get all the flashCardsList
        restFlashCardsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(flashCards.getId().intValue())))
            .andExpect(jsonPath("$.[*].repetitions").value(hasItem(DEFAULT_REPETITIONS)))
            .andExpect(jsonPath("$.[*].qualite").value(hasItem(DEFAULT_QUALITE)))
            .andExpect(jsonPath("$.[*].facilite").value(hasItem(DEFAULT_FACILITE.doubleValue())))
            .andExpect(jsonPath("$.[*].intervalle").value(hasItem(DEFAULT_INTERVALLE)))
            .andExpect(jsonPath("$.[*].prochainEntrainement").value(hasItem(DEFAULT_PROCHAIN_ENTRAINEMENT.toString())));
    }

    @Test
    @Transactional
    void getFlashCards() throws Exception {
        // Initialize the database
        flashCardsRepository.saveAndFlush(flashCards);

        // Get the flashCards
        restFlashCardsMockMvc
            .perform(get(ENTITY_API_URL_ID, flashCards.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(flashCards.getId().intValue()))
            .andExpect(jsonPath("$.repetitions").value(DEFAULT_REPETITIONS))
            .andExpect(jsonPath("$.qualite").value(DEFAULT_QUALITE))
            .andExpect(jsonPath("$.facilite").value(DEFAULT_FACILITE.doubleValue()))
            .andExpect(jsonPath("$.intervalle").value(DEFAULT_INTERVALLE))
            .andExpect(jsonPath("$.prochainEntrainement").value(DEFAULT_PROCHAIN_ENTRAINEMENT.toString()));
    }

    @Test
    @Transactional
    void getNonExistingFlashCards() throws Exception {
        // Get the flashCards
        restFlashCardsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewFlashCards() throws Exception {
        // Initialize the database
        flashCardsRepository.saveAndFlush(flashCards);

        int databaseSizeBeforeUpdate = flashCardsRepository.findAll().size();

        // Update the flashCards
        FlashCards updatedFlashCards = flashCardsRepository.findById(flashCards.getId()).get();
        // Disconnect from session so that the updates on updatedFlashCards are not directly saved in db
        em.detach(updatedFlashCards);
        updatedFlashCards
            .repetitions(UPDATED_REPETITIONS)
            .qualite(UPDATED_QUALITE)
            .facilite(UPDATED_FACILITE)
            .intervalle(UPDATED_INTERVALLE)
            .prochainEntrainement(UPDATED_PROCHAIN_ENTRAINEMENT);

        restFlashCardsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedFlashCards.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedFlashCards))
            )
            .andExpect(status().isOk());

        // Validate the FlashCards in the database
        List<FlashCards> flashCardsList = flashCardsRepository.findAll();
        assertThat(flashCardsList).hasSize(databaseSizeBeforeUpdate);
        FlashCards testFlashCards = flashCardsList.get(flashCardsList.size() - 1);
        assertThat(testFlashCards.getRepetitions()).isEqualTo(UPDATED_REPETITIONS);
        assertThat(testFlashCards.getQualite()).isEqualTo(UPDATED_QUALITE);
        assertThat(testFlashCards.getFacilite()).isEqualTo(UPDATED_FACILITE);
        assertThat(testFlashCards.getIntervalle()).isEqualTo(UPDATED_INTERVALLE);
        assertThat(testFlashCards.getProchainEntrainement()).isEqualTo(UPDATED_PROCHAIN_ENTRAINEMENT);
    }

    @Test
    @Transactional
    void putNonExistingFlashCards() throws Exception {
        int databaseSizeBeforeUpdate = flashCardsRepository.findAll().size();
        flashCards.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFlashCardsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, flashCards.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(flashCards))
            )
            .andExpect(status().isBadRequest());

        // Validate the FlashCards in the database
        List<FlashCards> flashCardsList = flashCardsRepository.findAll();
        assertThat(flashCardsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchFlashCards() throws Exception {
        int databaseSizeBeforeUpdate = flashCardsRepository.findAll().size();
        flashCards.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFlashCardsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(flashCards))
            )
            .andExpect(status().isBadRequest());

        // Validate the FlashCards in the database
        List<FlashCards> flashCardsList = flashCardsRepository.findAll();
        assertThat(flashCardsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamFlashCards() throws Exception {
        int databaseSizeBeforeUpdate = flashCardsRepository.findAll().size();
        flashCards.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFlashCardsMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(flashCards)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the FlashCards in the database
        List<FlashCards> flashCardsList = flashCardsRepository.findAll();
        assertThat(flashCardsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateFlashCardsWithPatch() throws Exception {
        // Initialize the database
        flashCardsRepository.saveAndFlush(flashCards);

        int databaseSizeBeforeUpdate = flashCardsRepository.findAll().size();

        // Update the flashCards using partial update
        FlashCards partialUpdatedFlashCards = new FlashCards();
        partialUpdatedFlashCards.setId(flashCards.getId());

        partialUpdatedFlashCards.facilite(UPDATED_FACILITE).intervalle(UPDATED_INTERVALLE);

        restFlashCardsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFlashCards.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFlashCards))
            )
            .andExpect(status().isOk());

        // Validate the FlashCards in the database
        List<FlashCards> flashCardsList = flashCardsRepository.findAll();
        assertThat(flashCardsList).hasSize(databaseSizeBeforeUpdate);
        FlashCards testFlashCards = flashCardsList.get(flashCardsList.size() - 1);
        assertThat(testFlashCards.getRepetitions()).isEqualTo(DEFAULT_REPETITIONS);
        assertThat(testFlashCards.getQualite()).isEqualTo(DEFAULT_QUALITE);
        assertThat(testFlashCards.getFacilite()).isEqualTo(UPDATED_FACILITE);
        assertThat(testFlashCards.getIntervalle()).isEqualTo(UPDATED_INTERVALLE);
        assertThat(testFlashCards.getProchainEntrainement()).isEqualTo(DEFAULT_PROCHAIN_ENTRAINEMENT);
    }

    @Test
    @Transactional
    void fullUpdateFlashCardsWithPatch() throws Exception {
        // Initialize the database
        flashCardsRepository.saveAndFlush(flashCards);

        int databaseSizeBeforeUpdate = flashCardsRepository.findAll().size();

        // Update the flashCards using partial update
        FlashCards partialUpdatedFlashCards = new FlashCards();
        partialUpdatedFlashCards.setId(flashCards.getId());

        partialUpdatedFlashCards
            .repetitions(UPDATED_REPETITIONS)
            .qualite(UPDATED_QUALITE)
            .facilite(UPDATED_FACILITE)
            .intervalle(UPDATED_INTERVALLE)
            .prochainEntrainement(UPDATED_PROCHAIN_ENTRAINEMENT);

        restFlashCardsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFlashCards.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFlashCards))
            )
            .andExpect(status().isOk());

        // Validate the FlashCards in the database
        List<FlashCards> flashCardsList = flashCardsRepository.findAll();
        assertThat(flashCardsList).hasSize(databaseSizeBeforeUpdate);
        FlashCards testFlashCards = flashCardsList.get(flashCardsList.size() - 1);
        assertThat(testFlashCards.getRepetitions()).isEqualTo(UPDATED_REPETITIONS);
        assertThat(testFlashCards.getQualite()).isEqualTo(UPDATED_QUALITE);
        assertThat(testFlashCards.getFacilite()).isEqualTo(UPDATED_FACILITE);
        assertThat(testFlashCards.getIntervalle()).isEqualTo(UPDATED_INTERVALLE);
        assertThat(testFlashCards.getProchainEntrainement()).isEqualTo(UPDATED_PROCHAIN_ENTRAINEMENT);
    }

    @Test
    @Transactional
    void patchNonExistingFlashCards() throws Exception {
        int databaseSizeBeforeUpdate = flashCardsRepository.findAll().size();
        flashCards.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFlashCardsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, flashCards.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(flashCards))
            )
            .andExpect(status().isBadRequest());

        // Validate the FlashCards in the database
        List<FlashCards> flashCardsList = flashCardsRepository.findAll();
        assertThat(flashCardsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchFlashCards() throws Exception {
        int databaseSizeBeforeUpdate = flashCardsRepository.findAll().size();
        flashCards.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFlashCardsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(flashCards))
            )
            .andExpect(status().isBadRequest());

        // Validate the FlashCards in the database
        List<FlashCards> flashCardsList = flashCardsRepository.findAll();
        assertThat(flashCardsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamFlashCards() throws Exception {
        int databaseSizeBeforeUpdate = flashCardsRepository.findAll().size();
        flashCards.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFlashCardsMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(flashCards))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the FlashCards in the database
        List<FlashCards> flashCardsList = flashCardsRepository.findAll();
        assertThat(flashCardsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteFlashCards() throws Exception {
        // Initialize the database
        flashCardsRepository.saveAndFlush(flashCards);

        int databaseSizeBeforeDelete = flashCardsRepository.findAll().size();

        // Delete the flashCards
        restFlashCardsMockMvc
            .perform(delete(ENTITY_API_URL_ID, flashCards.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<FlashCards> flashCardsList = flashCardsRepository.findAll();
        assertThat(flashCardsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
