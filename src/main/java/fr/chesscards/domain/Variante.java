package fr.chesscards.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import javax.persistence.*;

/**
 * A Variante.
 */
@Entity
@Table(name = "variante")
public class Variante implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "nom")
    private String nom;

    @Column(name = "coups")
    private String coups;

    @ManyToOne
    @JsonIgnoreProperties(value = { "userId", "ouvertureIds" }, allowSetters = true)
    private Ouverture ouverture;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Variante id(Long id) {
        this.id = id;
        return this;
    }

    public String getNom() {
        return this.nom;
    }

    public Variante nom(String nom) {
        this.nom = nom;
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getCoups() {
        return this.coups;
    }

    public Variante coups(String coups) {
        this.coups = coups;
        return this;
    }

    public void setCoups(String coups) {
        this.coups = coups;
    }

    public Ouverture getOuverture() {
        return this.ouverture;
    }

    public Variante ouverture(Ouverture ouverture) {
        this.setOuverture(ouverture);
        return this;
    }

    public void setOuverture(Ouverture ouverture) {
        this.ouverture = ouverture;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Variante)) {
            return false;
        }
        return id != null && id.equals(((Variante) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Variante{" +
            "id=" + getId() +
            ", nom='" + getNom() + "'" +
            ", coups='" + getCoups() + "'" +
            "}";
    }
}
