package fr.flashcards.repository;

import fr.flashcards.domain.FlashCards;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the FlashCards entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FlashCardsRepository extends JpaRepository<FlashCards, Long> {}
