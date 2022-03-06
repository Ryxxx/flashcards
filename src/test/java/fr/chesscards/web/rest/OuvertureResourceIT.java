package fr.chesscards.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import fr.chesscards.IntegrationTest;
import fr.chesscards.domain.Ouverture;
import fr.chesscards.domain.enumeration.Couleur;
import fr.chesscards.repository.OuvertureRepository;
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
 * Integration tests for the {@link OuvertureResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class OuvertureResourceIT {

    private static final String DEFAULT_NOM = "AAAAAAAAAA";
    private static final String UPDATED_NOM = "BBBBBBBBBB";

    private static final Couleur DEFAULT_COULEUR = Couleur.BLANC;
    private static final Couleur UPDATED_COULEUR = Couleur.NOIR;

    private static final String DEFAULT_PREMIER_COUPS = "AAAAAAAAAA";
    private static final String UPDATED_PREMIER_COUPS = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/ouvertures";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private OuvertureRepository ouvertureRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restOuvertureMockMvc;

    private Ouverture ouverture;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Ouverture createEntity(EntityManager em) {
        Ouverture ouverture = new Ouverture().nom(DEFAULT_NOM).couleur(DEFAULT_COULEUR).premierCoups(DEFAULT_PREMIER_COUPS);
        return ouverture;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Ouverture createUpdatedEntity(EntityManager em) {
        Ouverture ouverture = new Ouverture().nom(UPDATED_NOM).couleur(UPDATED_COULEUR).premierCoups(UPDATED_PREMIER_COUPS);
        return ouverture;
    }

    @BeforeEach
    public void initTest() {
        ouverture = createEntity(em);
    }

    @Test
    @Transactional
    void createOuverture() throws Exception {
        int databaseSizeBeforeCreate = ouvertureRepository.findAll().size();
        // Create the Ouverture
        restOuvertureMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(ouverture)))
            .andExpect(status().isCreated());

        // Validate the Ouverture in the database
        List<Ouverture> ouvertureList = ouvertureRepository.findAll();
        assertThat(ouvertureList).hasSize(databaseSizeBeforeCreate + 1);
        Ouverture testOuverture = ouvertureList.get(ouvertureList.size() - 1);
        assertThat(testOuverture.getNom()).isEqualTo(DEFAULT_NOM);
        assertThat(testOuverture.getCouleur()).isEqualTo(DEFAULT_COULEUR);
        assertThat(testOuverture.getPremierCoups()).isEqualTo(DEFAULT_PREMIER_COUPS);
    }

    @Test
    @Transactional
    void createOuvertureWithExistingId() throws Exception {
        // Create the Ouverture with an existing ID
        ouverture.setId(1L);

        int databaseSizeBeforeCreate = ouvertureRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restOuvertureMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(ouverture)))
            .andExpect(status().isBadRequest());

        // Validate the Ouverture in the database
        List<Ouverture> ouvertureList = ouvertureRepository.findAll();
        assertThat(ouvertureList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllOuvertures() throws Exception {
        // Initialize the database
        ouvertureRepository.saveAndFlush(ouverture);

        // Get all the ouvertureList
        restOuvertureMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(ouverture.getId().intValue())))
            .andExpect(jsonPath("$.[*].nom").value(hasItem(DEFAULT_NOM)))
            .andExpect(jsonPath("$.[*].couleur").value(hasItem(DEFAULT_COULEUR.toString())))
            .andExpect(jsonPath("$.[*].premierCoups").value(hasItem(DEFAULT_PREMIER_COUPS)));
    }

    @Test
    @Transactional
    void getOuverture() throws Exception {
        // Initialize the database
        ouvertureRepository.saveAndFlush(ouverture);

        // Get the ouverture
        restOuvertureMockMvc
            .perform(get(ENTITY_API_URL_ID, ouverture.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(ouverture.getId().intValue()))
            .andExpect(jsonPath("$.nom").value(DEFAULT_NOM))
            .andExpect(jsonPath("$.couleur").value(DEFAULT_COULEUR.toString()))
            .andExpect(jsonPath("$.premierCoups").value(DEFAULT_PREMIER_COUPS));
    }

    @Test
    @Transactional
    void getNonExistingOuverture() throws Exception {
        // Get the ouverture
        restOuvertureMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewOuverture() throws Exception {
        // Initialize the database
        ouvertureRepository.saveAndFlush(ouverture);

        int databaseSizeBeforeUpdate = ouvertureRepository.findAll().size();

        // Update the ouverture
        Ouverture updatedOuverture = ouvertureRepository.findById(ouverture.getId()).get();
        // Disconnect from session so that the updates on updatedOuverture are not directly saved in db
        em.detach(updatedOuverture);
        updatedOuverture.nom(UPDATED_NOM).couleur(UPDATED_COULEUR).premierCoups(UPDATED_PREMIER_COUPS);

        restOuvertureMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedOuverture.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedOuverture))
            )
            .andExpect(status().isOk());

        // Validate the Ouverture in the database
        List<Ouverture> ouvertureList = ouvertureRepository.findAll();
        assertThat(ouvertureList).hasSize(databaseSizeBeforeUpdate);
        Ouverture testOuverture = ouvertureList.get(ouvertureList.size() - 1);
        assertThat(testOuverture.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testOuverture.getCouleur()).isEqualTo(UPDATED_COULEUR);
        assertThat(testOuverture.getPremierCoups()).isEqualTo(UPDATED_PREMIER_COUPS);
    }

    @Test
    @Transactional
    void putNonExistingOuverture() throws Exception {
        int databaseSizeBeforeUpdate = ouvertureRepository.findAll().size();
        ouverture.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOuvertureMockMvc
            .perform(
                put(ENTITY_API_URL_ID, ouverture.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(ouverture))
            )
            .andExpect(status().isBadRequest());

        // Validate the Ouverture in the database
        List<Ouverture> ouvertureList = ouvertureRepository.findAll();
        assertThat(ouvertureList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchOuverture() throws Exception {
        int databaseSizeBeforeUpdate = ouvertureRepository.findAll().size();
        ouverture.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOuvertureMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(ouverture))
            )
            .andExpect(status().isBadRequest());

        // Validate the Ouverture in the database
        List<Ouverture> ouvertureList = ouvertureRepository.findAll();
        assertThat(ouvertureList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamOuverture() throws Exception {
        int databaseSizeBeforeUpdate = ouvertureRepository.findAll().size();
        ouverture.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOuvertureMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(ouverture)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Ouverture in the database
        List<Ouverture> ouvertureList = ouvertureRepository.findAll();
        assertThat(ouvertureList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateOuvertureWithPatch() throws Exception {
        // Initialize the database
        ouvertureRepository.saveAndFlush(ouverture);

        int databaseSizeBeforeUpdate = ouvertureRepository.findAll().size();

        // Update the ouverture using partial update
        Ouverture partialUpdatedOuverture = new Ouverture();
        partialUpdatedOuverture.setId(ouverture.getId());

        partialUpdatedOuverture.nom(UPDATED_NOM).premierCoups(UPDATED_PREMIER_COUPS);

        restOuvertureMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOuverture.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOuverture))
            )
            .andExpect(status().isOk());

        // Validate the Ouverture in the database
        List<Ouverture> ouvertureList = ouvertureRepository.findAll();
        assertThat(ouvertureList).hasSize(databaseSizeBeforeUpdate);
        Ouverture testOuverture = ouvertureList.get(ouvertureList.size() - 1);
        assertThat(testOuverture.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testOuverture.getCouleur()).isEqualTo(DEFAULT_COULEUR);
        assertThat(testOuverture.getPremierCoups()).isEqualTo(UPDATED_PREMIER_COUPS);
    }

    @Test
    @Transactional
    void fullUpdateOuvertureWithPatch() throws Exception {
        // Initialize the database
        ouvertureRepository.saveAndFlush(ouverture);

        int databaseSizeBeforeUpdate = ouvertureRepository.findAll().size();

        // Update the ouverture using partial update
        Ouverture partialUpdatedOuverture = new Ouverture();
        partialUpdatedOuverture.setId(ouverture.getId());

        partialUpdatedOuverture.nom(UPDATED_NOM).couleur(UPDATED_COULEUR).premierCoups(UPDATED_PREMIER_COUPS);

        restOuvertureMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedOuverture.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedOuverture))
            )
            .andExpect(status().isOk());

        // Validate the Ouverture in the database
        List<Ouverture> ouvertureList = ouvertureRepository.findAll();
        assertThat(ouvertureList).hasSize(databaseSizeBeforeUpdate);
        Ouverture testOuverture = ouvertureList.get(ouvertureList.size() - 1);
        assertThat(testOuverture.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testOuverture.getCouleur()).isEqualTo(UPDATED_COULEUR);
        assertThat(testOuverture.getPremierCoups()).isEqualTo(UPDATED_PREMIER_COUPS);
    }

    @Test
    @Transactional
    void patchNonExistingOuverture() throws Exception {
        int databaseSizeBeforeUpdate = ouvertureRepository.findAll().size();
        ouverture.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restOuvertureMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, ouverture.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(ouverture))
            )
            .andExpect(status().isBadRequest());

        // Validate the Ouverture in the database
        List<Ouverture> ouvertureList = ouvertureRepository.findAll();
        assertThat(ouvertureList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchOuverture() throws Exception {
        int databaseSizeBeforeUpdate = ouvertureRepository.findAll().size();
        ouverture.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOuvertureMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(ouverture))
            )
            .andExpect(status().isBadRequest());

        // Validate the Ouverture in the database
        List<Ouverture> ouvertureList = ouvertureRepository.findAll();
        assertThat(ouvertureList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamOuverture() throws Exception {
        int databaseSizeBeforeUpdate = ouvertureRepository.findAll().size();
        ouverture.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restOuvertureMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(ouverture))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Ouverture in the database
        List<Ouverture> ouvertureList = ouvertureRepository.findAll();
        assertThat(ouvertureList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteOuverture() throws Exception {
        // Initialize the database
        ouvertureRepository.saveAndFlush(ouverture);

        int databaseSizeBeforeDelete = ouvertureRepository.findAll().size();

        // Delete the ouverture
        restOuvertureMockMvc
            .perform(delete(ENTITY_API_URL_ID, ouverture.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Ouverture> ouvertureList = ouvertureRepository.findAll();
        assertThat(ouvertureList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
