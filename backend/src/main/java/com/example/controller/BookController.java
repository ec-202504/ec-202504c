package com.example.controller;

import com.example.dto.request.AddBookRequest;
import com.example.dto.request.UpdateBookRequest;
import com.example.dto.response.BookDetailResponse;
import com.example.dto.response.OrderProductResponse;
import com.example.model.*;
import com.example.service.BookService;
import com.example.service.OrderService;
import com.example.service.UserService;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
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

/** Bookの操作を行うコントローラクラス. */
@RestController
@RequiredArgsConstructor
@RequestMapping("/books")
public class BookController {
  private final BookService bookService;
  private final UserService userService;
  private final OrderService orderService;

  /**
   * 条件に合致するPC一覧結果を取得するエンドポイント.
   *
   * @param sort ソート条件
   * @param page ページ番号
   * @param size 1ページあたりの表示件数
   * @param name 書籍名
   * @param price 価格
   * @param author 著者名
   * @param publishDate 出版年度
   * @param languageId プログラミング言語
   * @param difficultyId 難易度
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
      @RequestParam(required = false) String author,
      @RequestParam(required = false) LocalDate publishDate,
      @RequestParam(required = false) Integer languageId,
      @RequestParam(required = false) Integer purposeId,
      @RequestParam(required = false) Integer difficultyId) {
    Pageable pageable = PageRequest.of(page, size);
    return ResponseEntity.ok(
        bookService.findByMultipleConditions(
            sort, name, price, author, publishDate, languageId, purposeId, difficultyId, pageable));
  }

  /**
   * キーワードを含む書籍名のリストを取得するエンドポイント.
   *
   * <p>オートコンプリート機能で使用
   *
   * @param keyword 検索キーワード
   * @return キーワードを含む書籍名のリスト
   */
  @GetMapping("/suggestions")
  public ResponseEntity<?> getBookSuggestions(@RequestParam String keyword) {
    List<String> bookSuggestions =
        bookService.findBooksSuggestions(keyword).stream().map(Book::getName).toList();
    return ResponseEntity.ok(bookSuggestions);
  }

  /**
   * 言語一覧を取得するエンドポイント.
   *
   * @return 言語一覧
   */
  @GetMapping("/languages")
  public ResponseEntity<?> getLanguages() {
    return ResponseEntity.ok(bookService.getAllLanguages());
  }

  /**
   * 書籍の目的一覧を取得するエンドポイント.
   *
   * @return 書籍の目的一覧
   */
  @GetMapping("/purposes")
  public ResponseEntity<?> getPurposes() {
    return ResponseEntity.ok(bookService.getAllPurposes());
  }

  /**
   * Bookの詳細情報を取得するエンドポイント.
   *
   * @param bookId BookのID
   * @return Bookの詳細情報
   */
  @GetMapping("/{bookId}")
  public ResponseEntity<?> getDetailBook(@PathVariable Integer bookId) {
    return bookService
        .findById(bookId)
        .map(this::mapToBookDetailResponse)
        .map(ResponseEntity::ok)
        .orElse(ResponseEntity.notFound().build());
  }

  /**
   * BookをBookDetailResponseに変換するヘルパーメソッド.
   *
   * @param book Bookエンティティ
   * @return BookDetailResponse DTO
   */
  private BookDetailResponse mapToBookDetailResponse(Book book) {
    BookDetailResponse response = new BookDetailResponse();
    response.setBookId(book.getId());
    response.setName(book.getName());
    // TODO: 画像URLは実際の画像URLに置き換える必要があります
    response.setImageUrl("https://placehold.jp/150x100.png");
    response.setAuthor(book.getAuthor());
    response.setPublishDate(
        book.getPublishDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
    response.setPrice(book.getPrice());
    response.setLanguage(book.getLanguage().getName());
    response.setPurpose(book.getPurpose().getName());
    response.setDifficulty(book.getDifficulty().getTarget());
    return response;
  }

  /**
   * BookをBooksテーブルに追加するエンドポイント.
   *
   * @param request Book登録リクエスト
   * @return 登録されたBook情報
   */
  @PostMapping
  public ResponseEntity<?> addBook(@RequestBody AddBookRequest request) {
    Book book = new Book();
    book.setName(request.getName());
    book.setPrice(request.getPrice());
    book.setAuthor(request.getAuthor());
    book.setPublishDate(request.getPublishDate());

    Language language = new Language();
    language.setId(request.getLanguageId());
    book.setLanguage(language);

    Purpose purpose = new Purpose();
    purpose.setId(request.getPurposeId());
    book.setPurpose(purpose);

    Difficulty difficulty = new Difficulty();
    difficulty.setId(request.getDifficultyId());
    book.setDifficulty(difficulty);

    bookService.registerBook(book);

    return ResponseEntity.ok().build();
  }

  /**
   * Book情報を更新しBooksテーブルに登録するエンドポイント.
   *
   * @param bookId BookのID
   * @param request Book更新リクエスト
   * @return 更新されたBook情報
   */
  @PutMapping("/{bookId}")
  public ResponseEntity<?> updateBook(
      @PathVariable Integer bookId, @RequestBody UpdateBookRequest request) {
    return bookService
        .findById(bookId)
        .map(
            existBook -> {
              existBook.setName(request.getName());
              existBook.setPrice(request.getPrice());
              existBook.setAuthor(request.getAuthor());
              existBook.setPublishDate(request.getPublishDate());

              Language language = new Language();
              language.setId(request.getLanguageId());
              existBook.setLanguage(language);

              Purpose purpose = new Purpose();
              purpose.setId(request.getPurposeId());
              existBook.setPurpose(purpose);

              Difficulty difficulty = new Difficulty();
              difficulty.setId(request.getDifficultyId());
              existBook.setDifficulty(difficulty);

              bookService.registerBook(existBook);

              return ResponseEntity.ok().build();
            })
        .orElse(ResponseEntity.notFound().build());
  }

  /**
   * BookをBooksテーブルから削除するエンドポイント.
   *
   * @param bookId BookのID
   * @return 削除されたBook情報
   */
  @DeleteMapping("/{bookId}")
  public ResponseEntity<?> removeBook(@PathVariable Integer bookId) {
    bookService.removeBook(bookId);
    return ResponseEntity.noContent().build();
  }

  /**
   * コンテンツベースフィルタリングの結果を取得するエンドポイント.
   *
   * @param bookId BookのID
   * @return コンテンツベースフィルタリングによる商品の推薦結果のリスト
   */
  @GetMapping("/recommend/contentBase/{bookId}")
  public ResponseEntity<?> recommendByContentBaseBooks(@PathVariable Integer bookId) {
    // コンテンツベースフィルタリング
    Optional<Book> targetBook = bookService.findById(bookId);
    if (targetBook.isEmpty()) {
      return ResponseEntity.badRequest().build();
    }

    List<Book> allBooks = bookService.getAllBooks();
    List<Book> allBooksBySameAuthor = bookService.findByAuthor(targetBook.get().getAuthor());
    List<Book> allBooksBySamePublishDate =
        bookService.findByPublishDate(targetBook.get().getPublishDate());
    List<Book> allBooksBySameLanguage =
        bookService.findByLanguageId(targetBook.get().getLanguage().getId());
    List<Book> allBooksBySamePurpose =
        bookService.findByPurposeId(targetBook.get().getPurpose().getId());

    List<Book> allBooksSameDifficulty =
        bookService.findByDifficultyId(targetBook.get().getDifficulty().getId());

    Set<Integer> sameAuthors =
        allBooksBySameAuthor.stream().map(Book::getId).collect(Collectors.toSet());
    Set<Integer> samePublishDates =
        allBooksBySamePublishDate.stream().map(Book::getId).collect(Collectors.toSet());
    Set<Integer> sameLanguageIds =
        allBooksBySameLanguage.stream().map(Book::getId).collect(Collectors.toSet());
    Set<Integer> samePurposeIds =
        allBooksBySamePurpose.stream().map(Book::getId).collect(Collectors.toSet());
    Set<Integer> sameDifficultyIds =
        allBooksSameDifficulty.stream().map(Book::getId).collect(Collectors.toSet());

    List<Map<String, Object>> result = new ArrayList<>();

    for (Book book : allBooks) {
      if (book.getId().equals(targetBook.get().getId())) {
        continue;
      }

      int similarity = 0;
      if (sameAuthors.contains(book.getId())) {
        similarity++;
      }
      if (samePublishDates.contains(book.getId())) {
        similarity++;
      }
      if (sameLanguageIds.contains(book.getId())) {
        similarity++;
      }
      if (samePurposeIds.contains(book.getId())) {
        similarity++;
      }
      if (sameDifficultyIds.contains(book.getId())) {
        similarity++;
      }

      Map<String, Object> item = new HashMap<>();
      item.put("book", book);
      item.put("similarity", similarity);
      result.add(item);
    }

    // 類似度スコアで降順ソート
    result.sort((a, b) -> Integer.compare((int) b.get("similarity"), (int) a.get("similarity")));

    // 上位何件出すかをlimitで調整
    return ResponseEntity.ok(result.stream().limit(5));
  }

  /**
   * 協調フィルタリングの結果を取得するエンドポイント.
   *
   * @param userId ユーザID
   * @return 協調フィルタリングによる商品の推薦結果のリスト
   */
  @GetMapping("/recommend/userBase/{userId}")
  public ResponseEntity<?> recommendByUserBaseBooks(@PathVariable Integer userId) {
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
            .limit(5)
            .collect(Collectors.toList());

    return ResponseEntity.ok(recommendedProducts);
  }
}
