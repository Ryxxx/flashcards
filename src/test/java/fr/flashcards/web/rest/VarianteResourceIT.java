package fr.flashcards.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import fr.flashcards.IntegrationTest;
import fr.flashcards.domain.Variante;
import fr.flashcards.repository.VarianteRepository;
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
 * Integration tests for the {@link VarianteResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class VarianteResourceIT {

    private static final String DEFAULT_NOM = "AAAAAAAAAA";
    private static final String UPDATED_NOM = "BBBBBBBBBB";

    private static final String DEFAULT_COUPS = "AAAAAAAAAA";
    private static final String UPDATED_COUPS = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/variantes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private VarianteRepository varianteRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restVarianteMockMvc;

    private Variante variante;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Variante createEntity(EntityManager em) {
        Variante variante = new Variante().nom(DEFAULT_NOM).coups(DEFAULT_COUPS);
        return variante;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Variante createUpdatedEntity(EntityManager em) {
        Variante variante = new Variante().nom(UPDATED_NOM).coups(UPDATED_COUPS);
        return variante;
    }

    @BeforeEach
    public void initTest() {
        variante = createEntity(em);
    }

    @Test
    @Transactional
    void createVariante() throws Exception {
        int databaseSizeBeforeCreate = varianteRepository.findAll().size();
        // Create the Variante
        restVarianteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(variante)))
            .andExpect(status().isCreated());

        // Validate the Variante in the database
        List<Variante> varianteList = varianteRepository.findAll();
        assertThat(varianteList).hasSize(databaseSizeBeforeCreate + 1);
        Variante testVariante = varianteList.get(varianteList.size() - 1);
        assertThat(testVariante.getNom()).isEqualTo(DEFAULT_NOM);
        assertThat(testVariante.getCoups()).isEqualTo(DEFAULT_COUPS);
    }

    @Test
    @Transactional
    void createVarianteWithExistingId() throws Exception {
        // Create the Variante with an existing ID
        variante.setId(1L);

        int databaseSizeBeforeCreate = varianteRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restVarianteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(variante)))
            .andExpect(status().isBadRequest());

        // Validate the Variante in the database
        List<Variante> varianteList = varianteRepository.findAll();
        assertThat(varianteList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllVariantes() throws Exception {
        // Initialize the database
        varianteRepository.saveAndFlush(variante);

        // Get all the varianteList
        restVarianteMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(variante.getId().intValue())))
            .andExpect(jsonPath("$.[*].nom").value(hasItem(DEFAULT_NOM)))
            .andExpect(jsonPath("$.[*].coups").value(hasItem(DEFAULT_COUPS)));
    }

    @Test
    @Transactional
    void getVariante() throws Exception {
        // Initialize the database
        varianteRepository.saveAndFlush(variante);

        // Get the variante
        restVarianteMockMvc
            .perform(get(ENTITY_API_URL_ID, variante.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(variante.getId().intValue()))
            .andExpect(jsonPath("$.nom").value(DEFAULT_NOM))
            .andExpect(jsonPath("$.coups").value(DEFAULT_COUPS));
    }

    @Test
    @Transactional
    void getNonExistingVariante() throws Exception {
        // Get the variante
        restVarianteMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewVariante() throws Exception {
        // Initialize the database
        varianteRepository.saveAndFlush(variante);

        int databaseSizeBeforeUpdate = varianteRepository.findAll().size();

        // Update the variante
        Variante updatedVariante = varianteRepository.findById(variante.getId()).get();
        // Disconnect from session so that the updates on updatedVariante are not directly saved in db
        em.detach(updatedVariante);
        updatedVariante.nom(UPDATED_NOM).coups(UPDATED_COUPS);

        restVarianteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedVariante.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedVariante))
            )
            .andExpect(status().isOk());

        // Validate the Variante in the database
        List<Variante> varianteList = varianteRepository.findAll();
        assertThat(varianteList).hasSize(databaseSizeBeforeUpdate);
        Variante testVariante = varianteList.get(varianteList.size() - 1);
        assertThat(testVariante.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testVariante.getCoups()).isEqualTo(UPDATED_COUPS);
    }

    @Test
    @Transactional
    void putNonExistingVariante() throws Exception {
        int databaseSizeBeforeUpdate = varianteRepository.findAll().size();
        variante.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVarianteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, variante.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(variante))
            )
            .andExpect(status().isBadRequest());

        // Validate the Variante in the database
        List<Variante> varianteList = varianteRepository.findAll();
        assertThat(varianteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchVariante() throws Exception {
        int databaseSizeBeforeUpdate = varianteRepository.findAll().size();
        variante.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVarianteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(variante))
            )
            .andExpect(status().isBadRequest());

        // Validate the Variante in the database
        List<Variante> varianteList = varianteRepository.findAll();
        assertThat(varianteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamVariante() throws Exception {
        int databaseSizeBeforeUpdate = varianteRepository.findAll().size();
        variante.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVarianteMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(variante)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Variante in the database
        List<Variante> varianteList = varianteRepository.findAll();
        assertThat(varianteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateVarianteWithPatch() throws Exception {
        // Initialize the database
        varianteRepository.saveAndFlush(variante);

        int databaseSizeBeforeUpdate = varianteRepository.findAll().size();

        // Update the variante using partial update
        Variante partialUpdatedVariante = new Variante();
        partialUpdatedVariante.setId(variante.getId());

        partialUpdatedVariante.nom(UPDATED_NOM).coups(UPDATED_COUPS);

        restVarianteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVariante.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedVariante))
            )
            .andExpect(status().isOk());

        // Validate the Variante in the database
        List<Variante> varianteList = varianteRepository.findAll();
        assertThat(varianteList).hasSize(databaseSizeBeforeUpdate);
        Variante testVariante = varianteList.get(varianteList.size() - 1);
        assertThat(testVariante.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testVariante.getCoups()).isEqualTo(UPDATED_COUPS);
    }

    @Test
    @Transactional
    void fullUpdateVarianteWithPatch() throws Exception {
        // Initialize the database
        varianteRepository.saveAndFlush(variante);

        int databaseSizeBeforeUpdate = varianteRepository.findAll().size();

        // Update the variante using partial update
        Variante partialUpdatedVariante = new Variante();
        partialUpdatedVariante.setId(variante.getId());

        partialUpdatedVariante.nom(UPDATED_NOM).coups(UPDATED_COUPS);

        restVarianteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVariante.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedVariante))
            )
            .andExpect(status().isOk());

        // Validate the Variante in the database
        List<Variante> varianteList = varianteRepository.findAll();
        assertThat(varianteList).hasSize(databaseSizeBeforeUpdate);
        Variante testVariante = varianteList.get(varianteList.size() - 1);
        assertThat(testVariante.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testVariante.getCoups()).isEqualTo(UPDATED_COUPS);
    }

    @Test
    @Transactional
    void patchNonExistingVariante() throws Exception {
        int databaseSizeBeforeUpdate = varianteRepository.findAll().size();
        variante.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVarianteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, variante.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(variante))
            )
            .andExpect(status().isBadRequest());

        // Validate the Variante in the database
        List<Variante> varianteList = varianteRepository.findAll();
        assertThat(varianteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchVariante() throws Exception {
        int databaseSizeBeforeUpdate = varianteRepository.findAll().size();
        variante.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVarianteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(variante))
            )
            .andExpect(status().isBadRequest());

        // Validate the Variante in the database
        List<Variante> varianteList = varianteRepository.findAll();
        assertThat(varianteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamVariante() throws Exception {
        int databaseSizeBeforeUpdate = varianteRepository.findAll().size();
        variante.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVarianteMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(variante)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Variante in the database
        List<Variante> varianteList = varianteRepository.findAll();
        assertThat(varianteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteVariante() throws Exception {
        // Initialize the database
        varianteRepository.saveAndFlush(variante);

        int databaseSizeBeforeDelete = varianteRepository.findAll().size();

        // Delete the variante
        restVarianteMockMvc
            .perform(delete(ENTITY_API_URL_ID, variante.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Variante> varianteList = varianteRepository.findAll();
        assertThat(varianteList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
