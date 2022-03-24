package fr.flashcards.service;

import fr.flashcards.service.dto.FlashCardDto;
import java.time.LocalDate;

public interface TrainingService {
    public LocalDate calculateNextTrainingDate(final FlashCardDto flashCardDto, final Integer qualite);
}
