package fr.flashcards.service.impl;

import fr.flashcards.domain.Ouverture;
import fr.flashcards.service.TrainingService;
import fr.flashcards.service.dto.FlashCardDto;
import java.time.LocalDate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for training methods
 */
@Service
@Transactional
public class TrainingServiceImpl implements TrainingService {

    @Override
    public LocalDate calculateNextTrainingDate(FlashCardDto flashCardDto, Integer quality) {
        if (quality == null || quality < 0 || quality > 5) {
            throw new IllegalStateException("Error with the quality");
        }

        // retrieve the stored values (default values if new cards)
        Integer repetitions = flashCardDto.getRepetitions();
        Double easiness = flashCardDto.getFacilite();
        Integer interval = flashCardDto.getIntervalle();

        // easiness factor
        easiness = (Double) Math.max(1.3, easiness + 0.1 - (5.0 - quality) * (0.08 + (5.0 - quality) * 0.02));

        // repetitions
        if (quality < 3) {
            repetitions = 0;
        } else {
            repetitions += 1;
        }

        // interval
        if (repetitions <= 1) {
            interval = 1;
        } else if (repetitions == 2) {
            interval = 6;
        } else {
            interval = Math.toIntExact(Math.round(interval * easiness));
        }

        // next practice
        Integer millisecondsInDay = 60 * 60 * 24 * 1000;
        return LocalDate.now().plusDays(millisecondsInDay);
    }
}
