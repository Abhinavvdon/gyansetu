package org.gyansetu.service;

import org.gyansetu.model.StudentProfile;
import org.gyansetu.model.User;
import org.gyansetu.repository.StudentProfileRepository;
import org.gyansetu.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class StudentProfileService {

    private final StudentProfileRepository profileRepository;
    private final UserRepository userRepository;
    private final DataRepository dataRepository;

    public StudentProfileService(StudentProfileRepository profileRepository,
                                 UserRepository userRepository,
                                 DataRepository dataRepository) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
        this.dataRepository = dataRepository;
    }

    @Transactional
    public StudentProfile getOrCreateProfile(Long userId) {
        if (userId != null) {
            Optional<StudentProfile> existing = profileRepository.findByUserId(userId);
            if (existing.isPresent()) {
                return existing.get();
            }

            // Create new profile for this registered user
            StudentProfile profile = new StudentProfile();
            profile.setUserId(userId);
            User user = userRepository.findById(userId).orElse(null);
            if (user != null && user.getName() != null) {
                profile.setFullName(user.getName());
            }
            return profileRepository.save(profile);
        }

        // For unauthenticated or guest fallback, return an isolated empty/default template.
        // NEVER return another real student's persisted profile to a guest caller.
        return dataRepository.getDefaultProfile();
    }

    @Transactional
    public StudentProfile saveOrUpdateProfile(Long userId, StudentProfile updated) {
        if (userId == null) {
            throw new IllegalArgumentException("User ID is required to save or update profile");
        }

        StudentProfile target = profileRepository.findByUserId(userId).orElseGet(() -> {
            StudentProfile p = new StudentProfile();
            p.setUserId(userId);
            return p;
        });

        // Validate marks bounds (0 to 100)
        target.setTenthMarksPercent(clamp(updated.getTenthMarksPercent()));
        target.setTwelfthMarksPercent(clamp(updated.getTwelfthMarksPercent()));
        target.setDiplomaMarksPercent(clamp(updated.getDiplomaMarksPercent()));
        target.setUgMarksPercent(clamp(updated.getUgMarksPercent()));
        target.setPgMarksPercent(clamp(updated.getPgMarksPercent()));
        target.setCurrentCgpaOrAggregate(updated.getCurrentCgpaOrAggregate());

        target.setFullName(updated.getFullName());
        target.setEducationLevel(updated.getEducationLevel());

        target.setAlreadyPursuedLevel(updated.getAlreadyPursuedLevel());
        target.setAlreadyPursuedStream(updated.getAlreadyPursuedStream());
        target.setAlreadyPursuedCourse(updated.getAlreadyPursuedCourse());
        target.setPhdStatus(updated.getPhdStatus());

        target.setCurrentlyPursuingLevel(updated.getCurrentlyPursuingLevel());
        target.setCurrentlyPursuingCourse(updated.getCurrentlyPursuingCourse());
        target.setCurrentlyPursuingYear(updated.getCurrentlyPursuingYear());
        target.setCurrentlyPursuingStream(updated.getCurrentlyPursuingStream());

        target.setCurrentDegree(updated.getCurrentDegree());
        target.setCurrentYear(updated.getCurrentYear());
        target.setStream(updated.getStream());

        target.setCategory(updated.getCategory());
        target.setAnnualFamilyIncome(updated.getAnnualFamilyIncome());
        target.setStateDomicile(updated.getStateDomicile());
        target.setGender(updated.getGender());

        // DOB & Age auto-synchronization
        if (updated.getDateOfBirth() != null && !updated.getDateOfBirth().trim().isEmpty()) {
            target.setDateOfBirth(updated.getDateOfBirth().trim());
            try {
                LocalDate dob = LocalDate.parse(updated.getDateOfBirth().trim());
                int calculatedAge = (int) ChronoUnit.YEARS.between(dob, LocalDate.now(ZoneId.of("Asia/Kolkata")));
                if (calculatedAge > 10 && calculatedAge < 80) {
                    target.setAge(calculatedAge);
                } else {
                    target.setAge(updated.getAge());
                }
            } catch (Exception e) {
                target.setAge(updated.getAge());
            }
        } else {
            target.setAge(updated.getAge());
        }

        if (updated.getCareerGoals() != null) {
            target.setCareerGoals(new ArrayList<>(updated.getCareerGoals()));
        }
        if (updated.getPreferredLanguages() != null) {
            target.setPreferredLanguages(new ArrayList<>(updated.getPreferredLanguages()));
        }
        if (updated.getSavedOpportunityIds() != null) {
            target.setSavedOpportunityIds(new HashSet<>(updated.getSavedOpportunityIds()));
        }

        return profileRepository.save(target);
    }

    @Transactional
    public Map<String, Object> toggleSaveOpportunity(Long userId, String opportunityId) {
        StudentProfile profile = getOrCreateProfile(userId);
        boolean isSaved;
        Set<String> saved = profile.getSavedOpportunityIds();
        if (saved.contains(opportunityId)) {
            saved.remove(opportunityId);
            isSaved = false;
        } else {
            saved.add(opportunityId);
            isSaved = true;
        }
        profileRepository.save(profile);

        Map<String, Object> res = new HashMap<>();
        res.put("isSaved", isSaved);
        res.put("savedCount", saved.size());
        return res;
    }

    private double clamp(double value) {
        return Math.max(0.0, Math.min(100.0, value));
    }
}
