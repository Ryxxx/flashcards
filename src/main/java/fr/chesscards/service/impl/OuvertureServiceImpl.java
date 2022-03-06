package fr.chesscards.service.impl;

import fr.chesscards.domain.Ouverture;
import fr.chesscards.repository.OuvertureRepository;
import fr.chesscards.service.OuvertureService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Ouverture}.
 */
@Service
@Transactional
public class OuvertureServiceImpl implements OuvertureService {

    private final Logger log = LoggerFactory.getLogger(OuvertureServiceImpl.class);

    private final OuvertureRepository ouvertureRepository;

    public OuvertureServiceImpl(OuvertureRepository ouvertureRepository) {
        this.ouvertureRepository = ouvertureRepository;
    }

    @Override
    public Ouverture save(Ouverture ouverture) {
        log.debug("Request to save Ouverture : {}", ouverture);
        return ouvertureRepository.save(ouverture);
    }

    @Override
    public Optional<Ouverture> partialUpdate(Ouverture ouverture) {
        log.debug("Request to partially update Ouverture : {}", ouverture);

        return ouvertureRepository
            .findById(ouverture.getId())
            .map(existingOuverture -> {
                if (ouverture.getNom() != null) {
                    existingOuverture.setNom(ouverture.getNom());
                }
                if (ouverture.getCouleur() != null) {
                    existingOuverture.setCouleur(ouverture.getCouleur());
                }
                if (ouverture.getPremierCoups() != null) {
                    existingOuverture.setPremierCoups(ouverture.getPremierCoups());
                }

                return existingOuverture;
            })
            .map(ouvertureRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Ouverture> findAll() {
        log.debug("Request to get all Ouvertures");
        return ouvertureRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Ouverture> findOne(Long id) {
        log.debug("Request to get Ouverture : {}", id);
        return ouvertureRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Ouverture : {}", id);
        ouvertureRepository.deleteById(id);
    }
}
