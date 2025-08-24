# 개발지상주의

## 💁 당신의 창업을 이끄는 통합 지원 플랫폼 Start Pointer
<img width="1920" height="1080" alt="Image" src="https://github.com/user-attachments/assets/828acacf-68de-4cd5-9cfe-76f7ff44b96f" />

## 🧑‍💻 팀원 및 역할 소개 👩‍💻

| BE | BE | FE | FE | FE | P&D |
|:------:|:------:|:------:|:------:|:------:|:------:|
| [차민경](https://github.com/chamingyeong00) | [손재희](https://github.com/JHEEE116) | [홍진성](https://github.com/gyeongsangseaman) | [김민정](https://github.com/minjeong517) |[강민혁](https://github.com/martinkang1234) |[조하영](https://github.com/haycho33) |
| <img src="https://avatars.githubusercontent.com/u/165614132?v=4" alt="차민경" width="110"> | <img src="https://avatars.githubusercontent.com/u/204812665?v=4" alt="손재희" width="110"> | <img src="https://avatars.githubusercontent.com/u/194925284?v=4" alt="홍진성" width="110"> | <img src="https://avatars.githubusercontent.com/u/120231104?v=4" alt="김민정" width="110"> |<img src="https://avatars.githubusercontent.com/u/205292832?v=4" alt="강민혁" width="110"> |<img src="https://avatars.githubusercontent.com/u/204812467?v=4" alt="조하영" width="110"> |<


## 💻 프로젝트 소개 
SPO(Start Pointer) 는 국내 최초로 경산 지역 청년 창업자를 위한 AI 기반 통합 지원 플랫폼입니다. 상권 분석, AI 창업 비서 (챗봇), 멘토 매칭을 통하여 시행착오가 많은 창업 과정에서
청년 창업가들이 머물고 성장할 수 있는 환경을 제공합니다.


## 💡 주요기능
<img width="1920" height="1080" alt="Image" src="https://github.com/user-attachments/assets/fd04ac59-b733-4022-af76-73614e5c10ba" />

## 📊 상권분석 및 상세분석 
<img width="1920" height="1080" alt="Image" src="https://github.com/user-attachments/assets/0284a1f0-d42a-4df6-8b9a-58158d203b2c" />

## 🗣️ 챗봇 및 FAQ
<img width="1920" height="1080" alt="Image" src="https://github.com/user-attachments/assets/9efaa417-0827-45ea-b2a0-44cf8172c9ab" />

## 👥 멘토매칭
<img width="1920" height="1862" alt="Image" src="https://github.com/user-attachments/assets/df03c5d6-f146-41be-8d70-cd342b7c994c" />



## 📌 프로젝트 아키텍처
<img width="8354" height="5800" alt="Image" src="https://github.com/user-attachments/assets/22ae6dfc-79bb-43e5-8f3a-b2cce012f37b" />

## 📖 디렉토리 구조
```
├── CONTRIBUTING.md
├── Dockerfile
├── README.md
├── build.gradle
├── docker-compose.yml
├── gradle
│   └── wrapper
│       ├── gradle-wrapper.jar
│       └── gradle-wrapper.properties
├── gradlew
├── gradlew.bat
├── settings.gradle
└── src
    ├── main
    │   ├── java
    │   │   └── startpointwas
    │   │       ├── StartPointWasApplication.java
    │   │       ├── config
    │   │       │   └── WebConfig.java
    │   │       ├── domain
    │   │       │   ├── chat
    │   │       │   │   ├── controller
    │   │       │   │   │   └── ChatController.java
    │   │       │   │   ├── dto
    │   │       │   │   │   └── ChatRequest.java
    │   │       │   │   ├── exception
    │   │       │   │   │   └── OpenAiApiException.java
    │   │       │   │   ├── repository
    │   │       │   │   │   └── ChatRedisRepository.java
    │   │       │   │   └── service
    │   │       │   │       └── ChatContextService.java
    │   │       │   ├── general
    │   │       │   │   ├── controller
    │   │       │   │   │   ├── FootTrafficController.java
    │   │       │   │   │   ├── SimpleAnlsController.java
    │   │       │   │   │   └── UpjongController.java
    │   │       │   │   ├── dto
    │   │       │   │   │   ├── FootTrafficDto.java
    │   │       │   │   │   ├── SimpleAnlsResponse.java
    │   │       │   │   │   └── UpjongDto.java
    │   │       │   │   └── service
    │   │       │   │       ├── FootTrafficService.java
    │   │       │   │       ├── SimpleAnlsService.java
    │   │       │   │       └── UpjongService.java
    │   │       │   ├── mentor
    │   │       │   │   ├── component
    │   │       │   │   │   └── EntrepreneurDataInitializer.java
    │   │       │   │   ├── controller
    │   │       │   │   │   └── EntrepreneurViewController.java
    │   │       │   │   ├── dto
    │   │       │   │   │   ├── EntrepreneurViewDto.java
    │   │       │   │   │   └── UpdateRegistrationTimeRequest.java
    │   │       │   │   ├── entity
    │   │       │   │   │   └── Entrepreneur.java
    │   │       │   │   └── repository
    │   │       │   │       └── EntrepreneurRepository.java
    │   │       │   ├── practical
    │   │       │   │   ├── DongCode.java
    │   │       │   │   ├── config
    │   │       │   │   │   └── AiConfig.java
    │   │       │   │   ├── controller
    │   │       │   │   │   └── PracticalController.java
    │   │       │   │   ├── dto
    │   │       │   │   │   ├── PracticalDongAnls.java
    │   │       │   │   │   └── PracticalDongAnlsSlim.java
    │   │       │   │   ├── mapper
    │   │       │   │   │   └── PracticalMapper.java
    │   │       │   │   └── service
    │   │       │   │       └── PracticalService.java
    │   │       │   └── user
    │   │       │       ├── controller
    │   │       │       │   └── UserController.java
    │   │       │       ├── dto
    │   │       │       │   ├── LoginDto.java
    │   │       │       │   ├── NameRoleRes.java
    │   │       │       │   ├── SignUpReq.java
    │   │       │       │   └── UserInfoDto.java
    │   │       │       ├── entity
    │   │       │       │   ├── Role.java
    │   │       │       │   └── User.java
    │   │       │       ├── repository
    │   │       │       │   └── UserRepository.java
    │   │       │       └── service
    │   │       │           └── UserService.java
    │   │       └── global
    │   │           └── SessionConst.java
    │   └── resources
    │       └── application.yml
    └── test
        └── java
            └── startpointwas
                └── general
                    └── UpjongDtoTest.java
```

## 브랜치 전략

- master: 최종 제출 브랜치
- develop: 통합 개발 브랜치
- feat: 기능 개발 브랜치

## 협업 가이드

상세한 협업 규칙은 [CONTRIBUTING.md](./CONTRIBUTING.md)를 참고
