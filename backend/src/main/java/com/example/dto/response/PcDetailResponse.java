package com.example.dto.response;

import java.math.BigDecimal;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** PCの詳細情報レスポンスを表すDTOクラス. */
@Getter
@Setter
@NoArgsConstructor
public class PcDetailResponse {
  private Integer pcId;
  private String name;
  private byte[] imageUrl;
  private Integer price;
  private Integer memory;
  private Integer storage;
  private BigDecimal deviceSize;
  private Integer deviceType;
  private String os;
  private String cpu;
  private String gpu;
  private String purpose;
}
