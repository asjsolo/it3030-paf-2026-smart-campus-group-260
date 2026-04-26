package com.smartcampus.security;

import com.smartcampus.model.Role;
import com.smartcampus.model.User;
import com.smartcampus.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String picture = oAuth2User.getAttribute("picture");
        String providerId = oAuth2User.getAttribute("sub");
        String provider = userRequest.getClientRegistration().getRegistrationId();

        userRepository.findByEmail(email).ifPresentOrElse(
                existing -> {
                    // Update name/picture on each login
                    existing.setName(name);
                    existing.setPicture(picture);
                    userRepository.save(existing);
                },
                () -> {
                    // First login: create user with USER role by default
                    User newUser = User.builder()
                            .email(email)
                            .name(name)
                            .picture(picture)
                            .provider(provider)
                            .providerId(providerId)
                            .role(Role.USER)
                            .build();
                    userRepository.save(newUser);
                }
        );

        return oAuth2User;
    }
}
