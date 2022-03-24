package fr.flashcards.domain;

import java.io.Serializable;
import java.time.LocalDate;
import javax.persistence.*;

/**
 * A FlashCards.
 */
@Entity
@Table(name = "flash_cards")
public class FlashCards implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "repetitions")
    private Integer repetitions;

    @Column(name = "qualite")
    private Integer qualite;

    @Column(name = "facilite")
    private Double facilite;

    @Column(name = "intervalle")
    private Integer intervalle;

    @Column(name = "prochain_entrainement")
    private LocalDate prochainEntrainement;

    @OneToOne
    @JoinColumn(unique = true)
    private User userId;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public FlashCards id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getRepetitions() {
        return this.repetitions;
    }

    public FlashCards repetitions(Integer repetitions) {
        this.setRepetitions(repetitions);
        return this;
    }

    public void setRepetitions(Integer repetitions) {
        this.repetitions = repetitions;
    }

    public Integer getQualite() {
        return this.qualite;
    }

    public FlashCards qualite(Integer qualite) {
        this.setQualite(qualite);
        return this;
    }

    public void setQualite(Integer qualite) {
        this.qualite = qualite;
    }

    public Double getFacilite() {
        return this.facilite;
    }

    public FlashCards facilite(Double facilite) {
        this.setFacilite(facilite);
        return this;
    }

    public void setFacilite(Double facilite) {
        this.facilite = facilite;
    }

    public Integer getIntervalle() {
        return this.intervalle;
    }

    public FlashCards intervalle(Integer intervalle) {
        this.setIntervalle(intervalle);
        return this;
    }

    public void setIntervalle(Integer intervalle) {
        this.intervalle = intervalle;
    }

    public LocalDate getProchainEntrainement() {
        return this.prochainEntrainement;
    }

    public FlashCards prochainEntrainement(LocalDate prochainEntrainement) {
        this.setProchainEntrainement(prochainEntrainement);
        return this;
    }

    public void setProchainEntrainement(LocalDate prochainEntrainement) {
        this.prochainEntrainement = prochainEntrainement;
    }

    public User getUserId() {
        return this.userId;
    }

    public void setUserId(User user) {
        this.userId = user;
    }

    public FlashCards userId(User user) {
        this.setUserId(user);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof FlashCards)) {
            return false;
        }
        return id != null && id.equals(((FlashCards) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "FlashCards{" +
            "id=" + getId() +
            ", repetitions=" + getRepetitions() +
            ", qualite=" + getQualite() +
            ", facilite=" + getFacilite() +
            ", intervalle=" + getIntervalle() +
            ", prochainEntrainement='" + getProchainEntrainement() + "'" +
            "}";
    }
}
