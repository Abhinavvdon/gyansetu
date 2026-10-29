package org.gyansetu.repository;

import org.gyansetu.model.Opportunity;
import org.gyansetu.model.OpportunityType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OpportunityRepository extends JpaRepository<Opportunity, String> {
    List<Opportunity> findByType(OpportunityType type);
}
