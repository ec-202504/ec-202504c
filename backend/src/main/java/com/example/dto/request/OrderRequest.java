package com.example.dto.request;

import com.example.model.OrderProduct;
import java.util.List;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** 注文リクエストDTOクラス. 注文に必要な情報を保持する。 */
@Getter
@Setter
@NoArgsConstructor
public class OrderRequest {
  private Integer totalPrice;
  private String destinationName;
  private String destinationEmail;
  private String destinationZipcode;
  private String destinationPrefecture;
  private String destinationMunicipalities;
  private String destinationAddress;
  private String destinationTelephone;
  private String deliveryDateTime;
  private Integer paymentMethod;
  private Integer userId;
  private List<OrderProduct> productList;
}
