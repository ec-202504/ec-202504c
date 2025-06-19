package com.example.dto.request;

import java.math.BigDecimal;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class AddPCRequest {
  private String name;
  private Integer price;
  private Integer memory;
  private Integer storage;
  private BigDecimal deviceSize;
  private Integer deviceType;
  private Integer osId;
  private Integer cpuId;
  private Integer gpuId;
  private Integer purposeId;
}
