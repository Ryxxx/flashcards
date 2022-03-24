package fr.flashcards.service;

import fr.flashcards.domain.Variante;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link Variante}.
 */
public interface VarianteService {
    /**
     * Save a variante.
     *
     * @param variante the entity to save.
     * @return the persisted entity.
     */
    Variante save(Variante variante);

    /**
     * Partially updates a variante.
     *
     * @param variante the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Variante> partialUpdate(Variante variante);

    /**
     * Get all the variantes.
     *
     * @return the list of entities.
     */
    List<Variante> findAll();

    /**
     * Get the "id" variante.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Variante> findOne(Long id);

    /**
     * Delete the "id" variante.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
