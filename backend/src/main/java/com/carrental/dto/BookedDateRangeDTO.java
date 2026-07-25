package com.carrental.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

/**
 * Public-safe view of a booking's date range for a given car —
 * deliberately excludes any customer info so it can be shown to
 * anyone browsing cars, not just admins.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookedDateRangeDTO {
    private LocalDate startDate;
    private LocalDate endDate;
}
