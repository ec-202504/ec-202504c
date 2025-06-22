package com.example.controller;

import com.example.dto.request.AddPcRequest;
import com.example.dto.request.UpdatePcRequest;
import com.example.model.*;
import com.example.service.PcService;
import java.math.BigDecimal;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/** PCの操作を行うコントローラクラス. */
@RestController
@RequiredArgsConstructor
@RequestMapping("/pcs")
public class PcController {
  private final PcService pcService;

  /**
   * 条件に合致するPC一覧結果を取得するエンドポイント.
   *
   * @param sort ソート条件
   * @param page ページ番号
   * @param size 1ページあたりの表示件数
   * @param name デバイス名
   * @param price 価格
   * @param memory メモリ
   * @param storage ストレージ
   * @param deviceSize デバイスサイズ
   * @param deviceType デバイスタイプ
   * @param osId OS
   * @param cpuId CPU
   * @param gpuId GPU
   * @param purposeId 使用目的
   * @return 条件に合致するPC一覧結果
   */
  @GetMapping
  public ResponseEntity<?> getMultipleConditionsPcs(
      @RequestParam(defaultValue = "priceAsc") String sort,
      @RequestParam(defaultValue = "0") Integer page,
      @RequestParam(defaultValue = "20") Integer size,
      @RequestParam(required = false) String name,
      @RequestParam(required = false) Integer price,
      @RequestParam(required = false) Integer memory,
      @RequestParam(required = false) Integer storage,
      @RequestParam(required = false) BigDecimal deviceSize,
      @RequestParam(required = false) Integer deviceType,
      @RequestParam(required = false) Integer osId,
      @RequestParam(required = false) Integer cpuId,
      @RequestParam(required = false) Integer gpuId,
      @RequestParam(required = false) Integer purposeId) {
    Pageable pageable = PageRequest.of(page, size);
    return ResponseEntity.ok(
        pcService.findByMultipleConditions(
            sort,
            name,
            price,
            memory,
            storage,
            deviceSize,
            deviceType,
            osId,
            cpuId,
            gpuId,
            purposeId,
            pageable));
  }

  /**
   * PCのOS一覧を取得するエンドポイント.
   *
   * @return PCのOS一覧
   */
  @GetMapping("/oses")
  public ResponseEntity<?> getOses() {
    return ResponseEntity.ok(pcService.getAllOses());
  }

  /**
   * PCのCPU一覧を取得するエンドポイント.
   *
   * @return PCのCPU一覧
   */
  @GetMapping("/cpus")
  public ResponseEntity<?> getCpus() {
    return ResponseEntity.ok(pcService.getAllCpus());
  }

  /**
   * PCのGPU一覧を取得するエンドポイント.
   *
   * @return PCのGPU一覧
   */
  @GetMapping("/gpus")
  public ResponseEntity<?> getGpus() {
    return ResponseEntity.ok(pcService.getAllGpus());
  }

  /**
   * PCの目的一覧を取得するエンドポイント.
   *
   * @return PCの目的一覧
   */
  @GetMapping("/purposes")
  public ResponseEntity<?> getPurposes() {
    return ResponseEntity.ok(pcService.getAllPurposes());
  }

  //  /**
  //   * OSのIDと一致するPC一覧を取得するエンドポイント.
  //   *
  //   * @param osId OSのID
  //   * @return OSのIDと一致するPC一覧
  //   */
  //  @GetMapping("/oses/{osId}")
  //  public ResponseEntity<?> getPcsByOs(@PathVariable Integer osId) {
  //    List<Pc> pcListByOsId = pcService.findByOsId(osId);
  //    return ResponseEntity.ok(pcListByOsId);
  //  }
  //
  //  /**
  //   * CPUのIDと一致するPC一覧を取得するエンドポイント.
  //   *
  //   * @param cpuId 言語ID
  //   * @return 言語IDと一致する書籍一覧
  //   */
  //  @GetMapping("/cpus/{cpuId}")
  //  public ResponseEntity<?> getPcsByCpu(@PathVariable Integer cpuId) {
  //    List<Pc> pcListByCpuId = pcService.findByCpuId(cpuId);
  //    return ResponseEntity.ok(pcListByCpuId);
  //  }
  //
  //  /**
  //   * GPUのIDと一致するPC一覧を取得するエンドポイント.
  //   *
  //   * @param gpuId GPUのID
  //   * @return GPUのIDと一致するPC一覧
  //   */
  //  @GetMapping("/gpus/{gpuId}")
  //  public ResponseEntity<?> getPcsByGpu(@PathVariable Integer gpuId) {
  //    List<Pc> pcListByGpuId = pcService.findByGpuId(gpuId);
  //    return ResponseEntity.ok(pcListByGpuId);
  //  }
  //
  //  /**
  //   * 目的IDと一致するPC一覧を取得するエンドポイント.
  //   *
  //   * @param purposeId 目的ID
  //   * @return 目的IDと一致するPC一覧
  //   */
  //  @GetMapping("/purposes/{purposeId}")
  //  public ResponseEntity<?> getPcsByLanguage(@PathVariable Integer purposeId) {
  //    List<Pc> pcListByPurposeId = pcService.findByPurposeId(purposeId);
  //    return ResponseEntity.ok(pcListByPurposeId);
  //  }

  /**
   * PCの詳細情報を取得するエンドポイント.
   *
   * @param pcId PCのID
   * @return PCの詳細情報
   */
  @GetMapping("/{pcId}")
  public ResponseEntity<?> getDetailPc(@PathVariable Integer pcId) {
    return pcService
        .findById(pcId)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
  }

  /**
   * PCをPCsテーブルに追加するエンドポイント.
   *
   * @param request PC登録リクエスト
   * @return 登録されたPC情報
   */
  @PostMapping
  public ResponseEntity<?> addPc(@RequestBody AddPcRequest request) {
    Pc pc = new Pc();
    pc.setName(request.getName());
    pc.setPrice(request.getPrice());
    pc.setMemory(request.getMemory());
    pc.setStorage(request.getStorage());
    pc.setDeviceSize(request.getDeviceSize());
    pc.setDeviceType(request.getDeviceType());

    Os os = new Os();
    os.setId(request.getOsId());
    pc.setOs(os);

    Cpu cpu = new Cpu();
    cpu.setId(request.getCpuId());
    pc.setCpu(cpu);

    Gpu gpu = new Gpu();
    gpu.setId(request.getGpuId());
    pc.setGpu(gpu);

    Purpose purpose = new Purpose();
    purpose.setId(request.getPurposeId());
    pc.setPurpose(purpose);

    pcService.registerPc(pc);

    return ResponseEntity.ok().build();
  }

  /**
   * PCをPCsテーブルから削除するエンドポイント.
   *
   * @param pcId PCのID
   * @return 削除されたPC情報
   */
  @DeleteMapping("/{pcId}")
  public ResponseEntity<?> removePc(@PathVariable Integer pcId) {
    pcService.removePc(pcId);
    return ResponseEntity.noContent().build();
  }

  /**
   * PC情報を更新しPcsテーブルに登録するエンドポイント.
   *
   * @param pcId PCのID
   * @param request PC更新リクエスト
   * @return 更新されたPC情報
   */
  @PutMapping("/{pcId}")
  public ResponseEntity<?> updatePc(
      @PathVariable Integer pcId, @RequestBody UpdatePcRequest request) {
    return pcService
        .findById(pcId)
        .map(
            existPc -> {
              existPc.setName(request.getName());
              existPc.setPrice(request.getPrice());
              existPc.setMemory(request.getMemory());
              existPc.setStorage(request.getStorage());
              existPc.setDeviceSize(request.getDeviceSize());
              existPc.setDeviceType(request.getDeviceType());

              Os os = new Os();
              os.setId(request.getOsId());
              existPc.setOs(os);

              Cpu cpu = new Cpu();
              cpu.setId(request.getCpuId());
              existPc.setCpu(cpu);

              Gpu gpu = new Gpu();
              gpu.setId(request.getGpuId());
              existPc.setGpu(gpu);

              Purpose purpose = new Purpose();
              purpose.setId(request.getPurposeId());
              existPc.setPurpose(purpose);

              pcService.registerPc(existPc);

              return ResponseEntity.ok().build();
            })
        .orElse(ResponseEntity.notFound().build());
  }
}
