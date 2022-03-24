package fr.flashcards.repository;

import fr.flashcards.domain.Ouverture;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Ouverture entity.
 */
@SuppressWarnings("unused")
@Repository
public interface OuvertureRepository extends JpaRepository<Ouverture, Long> {}
