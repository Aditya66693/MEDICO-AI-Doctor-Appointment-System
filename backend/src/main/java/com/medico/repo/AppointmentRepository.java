package com.medico.repo;

import com.medico.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatientIdOrderByDateDescSlotDesc(Long patientId);
    List<Appointment> findByDoctorIdAndDate(Long doctorId, LocalDate date);
}
