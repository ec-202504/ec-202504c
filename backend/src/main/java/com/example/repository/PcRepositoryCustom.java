package com.example.repository;

import com.example.model.Pc;
import java.math.BigDecimal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PcRepositoryCustom {
  Page<Pc> findByMultipleConditions(
      String sort,
      String name,
      Integer price,
      Integer memory,
      Integer storage,
      BigDecimal deviceSize,
      Integer deviceType,
      Integer osId,
      Integer cpuId,
      Integer gpuId,
      Integer purposeId,
      Pageable pageable);
}
