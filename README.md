# StunStar Web

StunStar 게임의 웹 페이지입니다. 저장소 루트가 그대로 사이트입니다.

| 주소 | 파일 | 내용 |
|---|---|---|
| `/` | `index.html` | 게임 소개 (스토어 링크, 특징, 캐릭터) |
| `/privacy-policy/` | `privacy-policy/index.html` | 개인정보처리방침 (게임과 같은 원문, 10개 언어) |
| `/delete-account/` | `delete-account/index.html` | 계정 삭제 방법 (게임 안 / 메일 요청) |
| `/app-ads.txt` | `app-ads.txt` | AdMob 판매자 확인 (앱은 이 파일을 봄) |
| `/ads.txt` | `ads.txt` | 같은 내용 (웹사이트용) |

- 모든 페이지는 한국어·영어(개인정보처리방침은 10개 언어)를 담고, 위쪽 선택 상자로 바꿉니다. 처음에는 기기 언어로 보입니다.
- 휴대폰 화면(폭 390px)과 PC 화면에 맞게 만들었습니다.
- `assets/`의 그림은 게임의 `Art`에서 웹용으로 줄여 한 번 만든 것입니다.

## 다시 만들기

개인정보처리방침(게임 프로젝트의 `Assets/_Project/Data/PrivacyPolicy.xml`)이 바뀌면:

```
node tools/build-static.js                    (게임 프로젝트가 D:\Workspace\StunStar일 때)
node tools/build-static.js <게임 프로젝트 경로>
```

HTML, `assets/site.css`, `app-ads.txt`, `ads.txt`를 다시 씁니다(그림은 그대로). 다시 만든 뒤 커밋·푸시하면 됩니다.

## Cloudflare Pages로 올리기

1. Cloudflare 대시보드 → **Workers & Pages** → 만들기 → **Pages** → **Git에 연결**에서 이 저장소를 고릅니다.
2. 빌드 설정: 프레임워크 없음, **빌드 명령 비움**, **빌드 출력 디렉터리 `/`**.
3. 저장하면 `https://<프로젝트 이름>.pages.dev/`로 열립니다. 이후 `main`에 푸시할 때마다 자동으로 다시 올라갑니다.
4. 내 도메인이 있으면 프로젝트 → 사용자 지정 도메인에서 연결합니다(HTTPS 자동).

(Git 연결 대신 대시보드의 **직접 업로드**로 이 폴더를 끌어다 놓아도 됩니다.)

`/privacy-policy`처럼 끝에 `/` 없이 열어도 `privacy-policy/index.html`이 열립니다. `README.md`와 `tools/`도 사이트에 같이 올라가지만, 공개되어도 문제없는 내용입니다.

## 스토어에 넣을 주소

| 넣는 곳 | 주소 |
|---|---|
| Google Play / App Store 개인정보처리방침 | `https://<도메인>/privacy-policy/` |
| Google Play 데이터 보안 → 계정 삭제 URL | `https://<도메인>/delete-account/` |
| App Store 지원 URL | `https://<도메인>/` |
| 스토어 등록정보의 **웹사이트** | `https://<도메인>/` (AdMob이 여기의 `/app-ads.txt`를 읽음) |

- `app-ads.txt`는 스토어 등록정보의 웹사이트 주소 **루트**에 있어야 합니다. 등록 후 AdMob이 확인하기까지 하루 정도 걸립니다(AdMob → 앱 → app-ads.txt 탭에서 상태 확인).
- 내용: `google.com, pub-2075600345013086, DIRECT, f08c47fec0942fa0`
