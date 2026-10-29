package org.gyansetu.repository;

import org.gyansetu.model.StudentDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentDocumentRepository extends JpaRepository<StudentDocument, Long> {
    List<StudentDocument> findByUserId(Long userId);
    Optional<StudentDocument> findByUserIdAndDocumentId(Long userId, String documentId);
}
