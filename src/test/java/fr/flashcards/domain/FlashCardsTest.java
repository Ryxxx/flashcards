package fr.flashcards.domain;

import static org.assertj.core.api.Assertions.assertThat;

import fr.flashcards.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class FlashCardsTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(FlashCards.class);
        FlashCards flashCards1 = new FlashCards();
        flashCards1.setId(1L);
        FlashCards flashCards2 = new FlashCards();
        flashCards2.setId(flashCards1.getId());
        assertThat(flashCards1).isEqualTo(flashCards2);
        flashCards2.setId(2L);
        assertThat(flashCards1).isNotEqualTo(flashCards2);
        flashCards1.setId(null);
        assertThat(flashCards1).isNotEqualTo(flashCards2);
    }
}
