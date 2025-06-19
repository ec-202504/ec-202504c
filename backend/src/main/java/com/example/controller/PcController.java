package com.example.controller;

import com.example.dto.request.AddPcRequest;
import com.example.dto.request.UpdatePcRequest;
import com.example.model.Cpu;
import com.example.model.Gpu;
import com.example.model.Os;
import com.example.model.Pc;
import com.example.model.Purpose;
import com.example.service.PcService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/** PCの操作を行うコントローラクラス. */
@RestController
@RequiredArgsConstructor
@RequestMapping("/pcs")
public class PcController {
  private final PcService pcService;

  /**
   * PC一覧を取得するエンドポイント.
   *
   * @param sort ソート条件
   * @param limit 1ページあたりの表示件数
   * @param offset 次ページの開始位置
   * @param keyword 検索キーワード
   * @return PC一覧結果
   */
  @GetMapping
  public ResponseEntity<?> getPcs(
      @RequestParam(defaultValue = "priceAsc") String sort,
      @RequestParam(defaultValue = "0") Integer limit,
      @RequestParam(defaultValue = "20") Integer offset,
      @RequestParam(defaultValue = "") String keyword) {
    Sort sorting =
        switch (sort) {
          case "priceAsc" -> Sort.by(Sort.Direction.ASC, "price");
          case "priceDesc" -> Sort.by(Sort.Direction.DESC, "price");
          default -> Sort.by("id");
        };
    Pageable pageable = PageRequest.of(limit, offset, sorting);

    return ResponseEntity.ok(pcService.findPcs(keyword, pageable));
  }

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
  public ResponseEntity<?> addPcToTable(@RequestBody AddPcRequest request) {
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
  public ResponseEntity<?> removePcFromTable(@PathVariable Integer pcId) {
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
