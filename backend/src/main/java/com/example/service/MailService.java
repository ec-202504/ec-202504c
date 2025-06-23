package com.example.service;

import com.example.model.Book;
import com.example.model.Order;
import com.example.model.OrderProduct;
import com.example.model.Pc;
import com.example.repository.BookRepository;
import com.example.repository.PcRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.text.NumberFormat;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

/** メール送信サービスクラス. */
@Service
@RequiredArgsConstructor
public class MailService {
  private final JavaMailSender mailSender;
  private final PcRepository pcRepository;
  private final BookRepository bookRepository;

  @Value("${MAIL_USERNAME}")
  private String mailUsername;

  /**
   * 注文確認メールを送信するメソッド.
   *
   * @param to 宛先のメールアドレス
   * @param order 注文情報
   * @throws MessagingException メール送信に失敗した場合
   */
  public void sendOrderConfirmationEmail(String to, Order order) throws MessagingException {
    String subject = "【TechMate】注文確認メール";
    String body = buildEmailBody(order);
    sendEmail(to, subject, body);
  }

  /**
   * 注文情報をHTML形式のメール本文に変換するヘルパーメソッド.
   *
   * @param order 注文情報
   * @return HTML形式のメール本文
   */
  private String buildEmailBody(Order order) {
    StringBuilder sb = new StringBuilder();

    // 注文日時をフォーマット
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy年MM月dd日 HH時mm分ss秒");
    String formattedDateTime = order.getOrderDateTime().format(formatter);

    sb.append("<html><body>");
    sb.append("<h2>ご注文ありがとうございます！</h2>");
    sb.append("<p>ご注文日時：").append(formattedDateTime).append("</p>");
    sb.append("<p>お支払い方法：")
        .append(order.getPaymentMethod() == 0 ? "現金支払い" : "クレジットカード")
        .append("</p>");
    sb.append("<h3>ご注文内容：</h3>");
    sb.append("<table border='1' cellpadding='5' cellspacing='0'>");
    sb.append("<tr><th>商品名</th><th>カテゴリ</th><th>数量</th></tr>");

    for (OrderProduct orderProduct : order.getOrderProductList()) {
      String category = orderProduct.getProductCategory() == 0 ? "PC" : "技術書";
      String productName = getProductName(orderProduct);
      sb.append("<tr>")
          .append("<td>")
          .append(productName)
          .append("</td>")
          .append("<td>")
          .append(category)
          .append("</td>")
          .append("<td>")
          .append(orderProduct.getQuantity())
          .append("</td>")
          .append("</tr>");
    }
    sb.append("</table>");

    // 金額をカンマ区切りでフォーマット
    NumberFormat numberFormat = NumberFormat.getNumberInstance(Locale.JAPAN);
    String formattedPrice = numberFormat.format(order.getTotalPrice());
    sb.append("<p>合計金額：").append(formattedPrice).append("円</p>");
    sb.append("</body></html>");

    return sb.toString();
  }

  /**
   * 注文商品から商品名を取得するヘルパーメソッド.
   *
   * @param orderProduct 注文商品情報
   * @return 商品名
   */
  private String getProductName(OrderProduct orderProduct) {
    if (orderProduct.getProductCategory() == 0) {
      return pcRepository.findById(orderProduct.getProductId()).map(Pc::getName).orElse("不明なPC");
    } else {
      return bookRepository
          .findById(orderProduct.getProductId())
          .map(Book::getName)
          .orElse("不明な技術書");
    }
  }

  /**
   * メールを送信するヘルパーメソッド.
   *
   * @param to 宛先のメールアドレス
   * @param subject メールの件名
   * @param body メールの本文
   * @throws MessagingException メール送信に失敗した場合
   */
  private void sendEmail(String to, String subject, String body) throws MessagingException {
    MimeMessage message = mailSender.createMimeMessage();
    MimeMessageHelper messageHelper =
        new MimeMessageHelper(message, true); // 第２引数をtrueにするとファイル添付などが可能になる
    messageHelper.setFrom(mailUsername);
    messageHelper.setTo(to);
    messageHelper.setSubject(subject);
    messageHelper.setText(body, true); // trueにするとHTML形式で送信される
    mailSender.send(message);
  }
}
