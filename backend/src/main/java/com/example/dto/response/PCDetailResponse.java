package com.example.dto.response;

import com.example.model.Cpu;
import com.example.model.Gpu;
import com.example.model.Os;
import com.example.model.Purpose;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** PCの詳細情報リクエストを表すDTOクラス. */
@Getter
@Setter
@NoArgsConstructor
public class PCDetailResponse {
  private int memory;
  private int storage;
  private double deviceSize;
  private int deviceType;
  private Os os;
  private Cpu cpu;
  private Gpu gpu;
  private Purpose purpose;
}
