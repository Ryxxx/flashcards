package fr.flashcards.service.dto;

import java.time.LocalDate;
import lombok.Data;

@Data
public class FlashCardDto {

    private Long id;
    private Integer repetitions;
    private Integer qualite;
    private Double facilite;
    private Integer intervalle;
    private LocalDate prochainEntrainement;
}
