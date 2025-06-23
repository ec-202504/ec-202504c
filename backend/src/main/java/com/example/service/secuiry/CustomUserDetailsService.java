package com.example.service.secuiry;

import com.example.dto.security.CustomUserDetails;
import com.example.model.User;
import com.example.repository.UserRepository;
import java.util.Collection;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/** 資格情報を取得するサービス. */
@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
  private final UserRepository userRepository;

  // 権限
  Collection<? extends GrantedAuthority> authorities =
      AuthorityUtils.createAuthorityList("ROLE_USER");

  /**
   * メールアドレスでユーザーを検索し、UserDetailsを返す.
   *
   * @param email メールアドレス
   * @return 資格情報
   * @throws UsernameNotFoundException ユーザーが見つからない場合にスローされる例外
   */
  @Override
  public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
    User user =
        userRepository
            .findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("ユーザーが見つかりません: " + email));
    return CustomUserDetails.builder()
        .userId(user.getUserId())
        .username(user.getName())
        .email(user.getEmail())
        .password(user.getPassword())
        .authorities(authorities)
        .build();
  }
}
