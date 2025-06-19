package com.example.controller;

import com.example.dto.request.AddPCRequest;
import com.example.model.*;
import com.example.service.PCService;
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
public class PCController {
  private final PCService pcService;

  /**
   * PC一覧を取得するエンドポイント
   *
   * @param sort ソート条件
   * @param limit 1ページあたりの表示件数
   * @param offset 次ページの開始位置
   * @param keyword 検索キーワード
   * @return PC一覧結果
   */
  @GetMapping
  public ResponseEntity<?> getPCs(
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
   * PCの詳細情報を取得するエンドポイント
   *
   * @param pcId PCのID
   * @return PCの詳細情報
   */
  @GetMapping("/{pcId}")
  public ResponseEntity<?> getDetailPC(@PathVariable Integer pcId) {
    return pcService
        .findById(pcId)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
  }

  /**
   * PCをPCsテーブルに追加するエンドポイント
   *
   * @param request PC登録リクエスト
   * @return 登録されたPC情報
   */
  @PostMapping
  public ResponseEntity<?> addPCToTable(@RequestBody AddPCRequest request) {
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

    pcService.registerPC(pc);

    return ResponseEntity.ok().build();
  }

  /**
   * PCをPCsテーブルから削除するエンドポイント
   *
   * @param pcId PCのID
   * @return 削除されたPC情報
   */
  @DeleteMapping("/{pcId}")
  public ResponseEntity<?> removePCFromTable(@PathVariable Integer pcId) {
    pcService.removePC(pcId);
    return ResponseEntity.noContent().build();
  }
}
