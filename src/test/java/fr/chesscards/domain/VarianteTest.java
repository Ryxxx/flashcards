package fr.chesscards.domain;

import static org.assertj.core.api.Assertions.assertThat;

import fr.chesscards.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class VarianteTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Variante.class);
        Variante variante1 = new Variante();
        variante1.setId(1L);
        Variante variante2 = new Variante();
        variante2.setId(variante1.getId());
        assertThat(variante1).isEqualTo(variante2);
        variante2.setId(2L);
        assertThat(variante1).isNotEqualTo(variante2);
        variante1.setId(null);
        assertThat(variante1).isNotEqualTo(variante2);
    }
}
