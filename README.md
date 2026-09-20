# Dungeon RPG Mobile v1

모바일 전용 브랜치입니다. PC판과 별도로 관리합니다.

## GitHub에서 APK 만들기
1. 이 폴더 안의 파일과 폴더를 GitHub 저장소 루트에 그대로 업로드합니다.
2. 저장소의 **Actions** 탭을 엽니다.
3. **Build Android APK** 워크플로를 선택합니다.
4. 자동 실행되지 않았다면 **Run workflow**를 누릅니다.
5. 빌드가 끝나면 실행 결과 페이지 아래 **Artifacts**에서
   `Dungeon-RPG-Mobile-v1`을 내려받습니다.
6. 압축 안의 `app-debug.apk`를 갤럭시로 옮겨 설치합니다.

## 게임 파일
실제 게임 HTML/CSS/JS 및 이미지는 `www/` 안에 있습니다.
모바일 v2부터는 이 폴더의 게임 파일을 업데이트하면 됩니다.

## 주의
현재 APK는 테스트용 debug APK입니다. Google Play 배포용 서명 APK/AAB는
추후 별도 release signing 설정이 필요합니다.
