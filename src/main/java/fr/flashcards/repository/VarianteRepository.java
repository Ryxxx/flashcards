package fr.flashcards.repository;

import fr.flashcards.domain.Variante;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Variante entity.
 */
@SuppressWarnings("unused")
@Repository
public interface VarianteRepository extends JpaRepository<Variante, Long> {}
