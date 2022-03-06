package fr.chesscards.domain;

import static org.assertj.core.api.Assertions.assertThat;

import fr.chesscards.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class OuvertureTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Ouverture.class);
        Ouverture ouverture1 = new Ouverture();
        ouverture1.setId(1L);
        Ouverture ouverture2 = new Ouverture();
        ouverture2.setId(ouverture1.getId());
        assertThat(ouverture1).isEqualTo(ouverture2);
        ouverture2.setId(2L);
        assertThat(ouverture1).isNotEqualTo(ouverture2);
        ouverture1.setId(null);
        assertThat(ouverture1).isNotEqualTo(ouverture2);
    }
}
