package com.example.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {
  String name;
  String email;
  String password;
  String zipcode;
  String prefecture;
  String municipalities;
  String address;
  String telephone;
}
