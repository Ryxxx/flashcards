package fr.flashcards.service;

import fr.flashcards.domain.Ouverture;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link Ouverture}.
 */
public interface OuvertureService {
    /**
     * Save a ouverture.
     *
     * @param ouverture the entity to save.
     * @return the persisted entity.
     */
    Ouverture save(Ouverture ouverture);

    /**
     * Partially updates a ouverture.
     *
     * @param ouverture the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Ouverture> partialUpdate(Ouverture ouverture);

    /**
     * Get all the ouvertures.
     *
     * @return the list of entities.
     */
    List<Ouverture> findAll();

    /**
     * Get the "id" ouverture.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Ouverture> findOne(Long id);

    /**
     * Delete the "id" ouverture.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
