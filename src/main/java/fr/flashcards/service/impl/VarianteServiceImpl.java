package fr.flashcards.service.impl;

import fr.flashcards.domain.Variante;
import fr.flashcards.repository.VarianteRepository;
import fr.flashcards.service.VarianteService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Variante}.
 */
@Service
@Transactional
public class VarianteServiceImpl implements VarianteService {

    private final Logger log = LoggerFactory.getLogger(VarianteServiceImpl.class);

    private final VarianteRepository varianteRepository;

    public VarianteServiceImpl(VarianteRepository varianteRepository) {
        this.varianteRepository = varianteRepository;
    }

    @Override
    public Variante save(Variante variante) {
        log.debug("Request to save Variante : {}", variante);
        return varianteRepository.save(variante);
    }

    @Override
    public Optional<Variante> partialUpdate(Variante variante) {
        log.debug("Request to partially update Variante : {}", variante);

        return varianteRepository
            .findById(variante.getId())
            .map(existingVariante -> {
                if (variante.getNom() != null) {
                    existingVariante.setNom(variante.getNom());
                }
                if (variante.getCoups() != null) {
                    existingVariante.setCoups(variante.getCoups());
                }

                return existingVariante;
            })
            .map(varianteRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Variante> findAll() {
        log.debug("Request to get all Variantes");
        return varianteRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Variante> findOne(Long id) {
        log.debug("Request to get Variante : {}", id);
        return varianteRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Variante : {}", id);
        varianteRepository.deleteById(id);
    }
}
