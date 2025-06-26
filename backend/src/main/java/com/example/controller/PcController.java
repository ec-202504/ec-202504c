package com.example.controller;

import com.example.dto.request.AddPcRequest;
import com.example.dto.request.UpdatePcRequest;
import com.example.dto.response.OrderProductResponse;
import com.example.dto.response.PcDetailResponse;
import com.example.model.Cpu;
import com.example.model.Gpu;
import com.example.model.Order;
import com.example.model.Os;
import com.example.model.Pc;
import com.example.model.ProductKey;
import com.example.model.Purpose;
import com.example.model.User;
import com.example.service.OrderService;
import com.example.service.PcService;
import com.example.service.UserService;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
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
  private final UserService userService;
  private final OrderService orderService;

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
   * キーワードを含むPC名のリストを取得するエンドポイント.
   *
   * <p>オートコンプリート機能で使用
   *
   * @param keyword 検索キーワード
   * @return キーワードを含むPC名のリスト
   */
  @GetMapping("/suggestions")
  public ResponseEntity<?> getPcSuggestions(@RequestParam String keyword) {
    List<String> pcSuggestions =
        pcService.findPcsSuggestions(keyword).stream().map(Pc::getName).toList();
    return ResponseEntity.ok(pcSuggestions);
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
        .map(this::mapToPcDetailResponse)
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

  /**
   * コンテンツベースフィルタリングの結果を取得するエンドポイント.
   *
   * @param pcId PCのID
   * @return コンテンツベースフィルタリングによる商品の推薦結果のリスト
   */
  @GetMapping("/recommend/contentBase/{pcId}")
  public ResponseEntity<?> recommendByContentBasePcs(@PathVariable Integer pcId) {
    // コンテンツベースフィルタリング
    Optional<Pc> targetPc = pcService.findById(pcId);
    if (targetPc.isEmpty()) {
      return ResponseEntity.badRequest().build();
    }

    List<Pc> allPcs = pcService.getAllPcs();
    List<Pc> allPcsBySameOs = pcService.findByOsId(targetPc.get().getOs().getId());
    List<Pc> allPcsBySameCpu = pcService.findByCpuId(targetPc.get().getCpu().getId());
    List<Pc> allPcsBySameGpu = pcService.findByGpuId(targetPc.get().getGpu().getId());
    List<Pc> allPcsBySamePurpose = pcService.findByPurposeId(targetPc.get().getPurpose().getId());

    Set<Integer> sameOsIds = allPcsBySameOs.stream().map(Pc::getId).collect(Collectors.toSet());
    Set<Integer> sameCpuIds = allPcsBySameCpu.stream().map(Pc::getId).collect(Collectors.toSet());
    Set<Integer> sameGpuIds = allPcsBySameGpu.stream().map(Pc::getId).collect(Collectors.toSet());
    Set<Integer> samePurposeIds =
        allPcsBySamePurpose.stream().map(Pc::getId).collect(Collectors.toSet());

    List<Map<String, Object>> result = new ArrayList<>();

    for (Pc pc : allPcs) {
      if (pc.getId().equals(targetPc.get().getId())) {
        continue;
      }

      int similarity = 0;
      if (sameOsIds.contains(pc.getId())) {
        similarity++;
      }
      if (sameCpuIds.contains(pc.getId())) {
        similarity++;
      }
      if (sameGpuIds.contains(pc.getId())) {
        similarity++;
      }
      if (samePurposeIds.contains(pc.getId())) {
        similarity++;
      }

      Map<String, Object> item = new HashMap<>();
      item.put("pc", pc);
      item.put("similarity", similarity);
      result.add(item);
    }

    // 類似度スコアで降順ソート
    result.sort((a, b) -> Integer.compare((int) b.get("similarity"), (int) a.get("similarity")));

    // 上位何件出すかをlimitで調整
    return ResponseEntity.ok(result.stream().limit(4));
  }

  /**
   * 協調フィルタリングの結果を取得するエンドポイント.
   *
   * @param userId ユーザID
   * @return 協調フィルタリングによる商品の推薦結果のリスト
   */
  @GetMapping("/recommend/userBase/{userId}")
  public ResponseEntity<?> recommendByUserBasePcs(@PathVariable Integer userId) {
    Optional<User> targetUser = userService.findById(userId);
    if (targetUser.isEmpty()) {
      return ResponseEntity.badRequest().build();
    }

    // ターゲットユーザの購入商品をキーとしてセット化（比較用）
    Set<ProductKey> targetProducts = new HashSet<>();
    for (Order order : targetUser.get().getOrderList()) {
      for (OrderProductResponse product :
          orderService.getOrderDetailsByOrderId(order.getOrderId()).getProducts()) {
        ProductKey key = new ProductKey(product.getProductId(), product.getProductCategory());
        targetProducts.add(key);
      }
    }

    // 推薦商品のスコア（類似度）を管理するMap<ProductKey, Integer>
    Map<ProductKey, Integer> recommendScoreMap = new HashMap<>();
    // 商品の名前を保持しておくMap（重複除去用）
    Map<ProductKey, String> recommendNameMap = new HashMap<>();

    // 全ユーザの購入履歴をチェック
    List<Order> orderList = orderService.getAllOrders();
    for (Order order : orderList) {
      Integer orderUserId = order.getUserId().getUserId();
      if (targetUser.get().getUserId().equals(orderUserId)) {
        continue; // ターゲットユーザはスキップ
      }

      List<OrderProductResponse> productResponses =
          orderService.getOrderDetailsByOrderId(order.getOrderId()).getProducts();
      Set<ProductKey> currentUserKeys =
          productResponses.stream()
              .map(p -> new ProductKey(p.getProductId(), p.getProductCategory()))
              .collect(Collectors.toSet());

      // ターゲットユーザとの共通商品数をカウント
      long commonCount = currentUserKeys.stream().filter(targetProducts::contains).count();

      if (commonCount > 0) { // 1個以上共通商品あればsimilar userとみなす
        for (OrderProductResponse product : productResponses) {
          ProductKey key = new ProductKey(product.getProductId(), product.getProductCategory());
          // ターゲットユーザが未購入の商品だけを推薦候補にする
          if (!targetProducts.contains(key)) {
            // スコアを加算（共通商品数だけ）
            recommendScoreMap.merge(key, (int) commonCount, Integer::sum);
            recommendNameMap.putIfAbsent(key, product.getProductName());
          }
        }
      }
    }

    // MapからList<Map<String,Object>>に変換し、similarityで降順ソート
    List<Map<String, Object>> recommendedProducts =
        recommendScoreMap.entrySet().stream()
            .map(
                e -> {
                  Map<String, Object> map = new HashMap<>();
                  map.put("productId", e.getKey().productId());
                  map.put("productCategory", e.getKey().productCategory());
                  map.put("productName", recommendNameMap.get(e.getKey()));
                  map.put("similarity", e.getValue());
                  return map;
                })
            .sorted((a, b) -> Integer.compare((int) b.get("similarity"), (int) a.get("similarity")))
            .limit(4)
            .collect(Collectors.toList());

    return ResponseEntity.ok(recommendedProducts);
  }

  /**
   * PCの詳細情報をPcDetailResponseにマッピングするヘルパーメソッド.
   *
   * @param pc PCオブジェクト
   * @return PcDetailResponseオブジェクト
   */
  private PcDetailResponse mapToPcDetailResponse(Pc pc) {
    PcDetailResponse response = new PcDetailResponse();
    response.setPcId(pc.getId());
    response.setName(pc.getName());
    response.setImage(pc.getImage());
    response.setPrice(pc.getPrice());
    response.setMemory(pc.getMemory());
    response.setStorage(pc.getStorage());
    response.setDeviceSize(pc.getDeviceSize());
    response.setDeviceType(pc.getDeviceType());

    response.setOs(pc.getOs().getName());
    response.setCpu(pc.getCpu().getName());
    response.setGpu(pc.getGpu().getName());
    response.setPurpose(pc.getPurpose().getName());
    return response;
  }
}
