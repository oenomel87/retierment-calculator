# Retire Cal (Wails)

대한민국 고용노동부 퇴직금 계산 공개 페이지를 참고해 만든 데스크톱 계산기입니다.

## 프로젝트 구조

- `wails-app/` Wails 앱 (Go 백엔드 + 프론트엔드 에셋 내장)
- `wails-app/frontend/dist/` Wails에서 사용하는 정적 프론트(HTML/CSS/JS)
- `retire_cal.html` 원본 참고 페이지(오프라인 스냅샷)
- `resources/` `retire_cal.html`에서 참조하는 정적 에셋
- `retirement_rules.md` 계산 규칙 메모

## 요구 사항

- Go 1.21+ (Go 모듈 사용)
- Wails CLI (패키징 시 필요): `go install github.com/wailsapp/wails/v2/cmd/wails@latest`
- macOS: Xcode(또는 전체 Xcode 툴체인) 필요
- Windows: 대상 머신에 WebView2 런타임 필요

## 실행 (개발)

프로젝트 루트에서:

```bash
cd wails-app
go run -tags dev .
```

Wails dev 모드:

```bash
cd wails-app
wails dev
```

## 빌드 (macOS)

Wails CLI 사용:

```bash
cd wails-app
wails build
```

Wails CLI 없이 빌드:

```bash
cd wails-app
go build -tags production -o ./build/retire-cal
```

## 빌드 (Windows)

Windows에서 직접 빌드(권장):

```bash
cd wails-app
wails build -platform windows/amd64
```

ARM64:

```bash
wails build -platform windows/arm64
```

NSIS 인스톨러(Windows에 NSIS 필요):

```bash
wails build -platform windows/amd64 -nsis
```

## macOS에서 Windows 크로스 빌드

> mac에서 Windows 실행 파일(.exe)만 생성합니다. 패키징(NSIS)은 Windows에서만 가능합니다.

1) mingw-w64 설치(예: Homebrew):

```bash
brew install mingw-w64
```

2) Windows AMD64 빌드:

```bash
cd wails-app
CGO_ENABLED=1 CC=x86_64-w64-mingw32-gcc CXX=x86_64-w64-mingw32-g++ \
wails build -platform windows/amd64 -nopackage
```

3) Windows ARM64 빌드(툴체인 설치 시):

```bash
cd wails-app
CGO_ENABLED=1 CC=aarch64-w64-mingw32-gcc CXX=aarch64-w64-mingw32-g++ \
wails build -platform windows/arm64 -nopackage
```

결과물은 보통 `wails-app/build/bin/retire-cal.exe`에 생성됩니다.

## 참고

- 프론트는 `wails-app/frontend/dist/`의 순수 HTML/CSS/JS입니다.
- 엑셀 내보내기는 Go의 `excelize`로 구현했습니다.
- `go run`/`go build`를 직접 사용할 때는 Wails 빌드 태그가 필요합니다.
