package fr.chesscards.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import fr.chesscards.domain.enumeration.Couleur;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A Ouverture.
 */
@Entity
@Table(name = "ouverture")
public class Ouverture implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Column(name = "nom")
    private String nom;

    @Enumerated(EnumType.STRING)
    @Column(name = "couleur")
    private Couleur couleur;

    @Column(name = "premier_coups")
    private String premierCoups;

    @OneToOne
    @JoinColumn(unique = true)
    private User userId;

    @OneToMany(mappedBy = "ouverture")
    @JsonIgnoreProperties(value = { "ouverture" }, allowSetters = true)
    private Set<Variante> ouvertureIds = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Ouverture id(Long id) {
        this.id = id;
        return this;
    }

    public String getNom() {
        return this.nom;
    }

    public Ouverture nom(String nom) {
        this.nom = nom;
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public Couleur getCouleur() {
        return this.couleur;
    }

    public Ouverture couleur(Couleur couleur) {
        this.couleur = couleur;
        return this;
    }

    public void setCouleur(Couleur couleur) {
        this.couleur = couleur;
    }

    public String getPremierCoups() {
        return this.premierCoups;
    }

    public Ouverture premierCoups(String premierCoups) {
        this.premierCoups = premierCoups;
        return this;
    }

    public void setPremierCoups(String premierCoups) {
        this.premierCoups = premierCoups;
    }

    public User getUserId() {
        return this.userId;
    }

    public Ouverture userId(User user) {
        this.setUserId(user);
        return this;
    }

    public void setUserId(User user) {
        this.userId = user;
    }

    public Set<Variante> getOuvertureIds() {
        return this.ouvertureIds;
    }

    public Ouverture ouvertureIds(Set<Variante> variantes) {
        this.setOuvertureIds(variantes);
        return this;
    }

    public Ouverture addOuvertureId(Variante variante) {
        this.ouvertureIds.add(variante);
        variante.setOuverture(this);
        return this;
    }

    public Ouverture removeOuvertureId(Variante variante) {
        this.ouvertureIds.remove(variante);
        variante.setOuverture(null);
        return this;
    }

    public void setOuvertureIds(Set<Variante> variantes) {
        if (this.ouvertureIds != null) {
            this.ouvertureIds.forEach(i -> i.setOuverture(null));
        }
        if (variantes != null) {
            variantes.forEach(i -> i.setOuverture(this));
        }
        this.ouvertureIds = variantes;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Ouverture)) {
            return false;
        }
        return id != null && id.equals(((Ouverture) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Ouverture{" +
            "id=" + getId() +
            ", nom='" + getNom() + "'" +
            ", couleur='" + getCouleur() + "'" +
            ", premierCoups='" + getPremierCoups() + "'" +
            "}";
    }
}
