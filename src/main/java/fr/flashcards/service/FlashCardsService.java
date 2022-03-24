package fr.flashcards.service;

import fr.flashcards.domain.FlashCards;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link FlashCards}.
 */
public interface FlashCardsService {
    /**
     * Save a flashCards.
     *
     * @param flashCards the entity to save.
     * @return the persisted entity.
     */
    FlashCards save(FlashCards flashCards);

    /**
     * Partially updates a flashCards.
     *
     * @param flashCards the entity to update partially.
     * @return the persisted entity.
     */
    Optional<FlashCards> partialUpdate(FlashCards flashCards);

    /**
     * Get all the flashCards.
     *
     * @return the list of entities.
     */
    List<FlashCards> findAll();

    /**
     * Get the "id" flashCards.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<FlashCards> findOne(Long id);

    /**
     * Delete the "id" flashCards.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
