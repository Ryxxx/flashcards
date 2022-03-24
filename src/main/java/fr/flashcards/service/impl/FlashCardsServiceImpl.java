package fr.flashcards.service.impl;

import fr.flashcards.domain.FlashCards;
import fr.flashcards.repository.FlashCardsRepository;
import fr.flashcards.service.FlashCardsService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link FlashCards}.
 */
@Service
@Transactional
public class FlashCardsServiceImpl implements FlashCardsService {

    private final Logger log = LoggerFactory.getLogger(FlashCardsServiceImpl.class);

    private final FlashCardsRepository flashCardsRepository;

    public FlashCardsServiceImpl(FlashCardsRepository flashCardsRepository) {
        this.flashCardsRepository = flashCardsRepository;
    }

    @Override
    public FlashCards save(FlashCards flashCards) {
        log.debug("Request to save FlashCards : {}", flashCards);
        return flashCardsRepository.save(flashCards);
    }

    @Override
    public Optional<FlashCards> partialUpdate(FlashCards flashCards) {
        log.debug("Request to partially update FlashCards : {}", flashCards);

        return flashCardsRepository
            .findById(flashCards.getId())
            .map(existingFlashCards -> {
                if (flashCards.getRepetitions() != null) {
                    existingFlashCards.setRepetitions(flashCards.getRepetitions());
                }
                if (flashCards.getQualite() != null) {
                    existingFlashCards.setQualite(flashCards.getQualite());
                }
                if (flashCards.getFacilite() != null) {
                    existingFlashCards.setFacilite(flashCards.getFacilite());
                }
                if (flashCards.getIntervalle() != null) {
                    existingFlashCards.setIntervalle(flashCards.getIntervalle());
                }
                if (flashCards.getProchainEntrainement() != null) {
                    existingFlashCards.setProchainEntrainement(flashCards.getProchainEntrainement());
                }

                return existingFlashCards;
            })
            .map(flashCardsRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FlashCards> findAll() {
        log.debug("Request to get all FlashCards");
        return flashCardsRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<FlashCards> findOne(Long id) {
        log.debug("Request to get FlashCards : {}", id);
        return flashCardsRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete FlashCards : {}", id);
        flashCardsRepository.deleteById(id);
    }
}
