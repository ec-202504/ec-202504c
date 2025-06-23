package com.example.dto.security;

import java.util.Collection;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import org.springframework.security.core.CredentialsContainer;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

/** Spring Securityで資格情報を扱うカスタムクラス. */
@AllArgsConstructor
@Builder
public class CustomUserDetails implements UserDetails, CredentialsContainer {
  @Getter private final Integer userId;
  private final String username;
  @Getter private final String email;
  private String password;
  private final Collection<? extends GrantedAuthority> authorities;

  // UserDetailsの実装
  @Override
  public String getUsername() {
    return this.username;
  }

  @Override
  public String getPassword() {
    return this.password;
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return this.authorities;
  }

  // CredentialsContainerの実装
  /** 認証後パスワードの明示的な削除が必要. */
  @Override
  public void eraseCredentials() {
    this.password = null;
  }
}
