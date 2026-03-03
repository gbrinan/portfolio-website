# GitHub 저장소 생성 가이드

## 단계 1: GitHub 접속

1. 브라우저에서 https://github.com/new 접속

## 단계 2: 저장소 설정

### 필수 정보 입력
```
Repository name*: portfolio-website
Description*: AI Artist & AX Expert Portfolio Website
```

### 옵션 선택
```
☐ Public
☑ Private (나중에 공개로 변경 가능)
☐ Add a README file (체크 해제 - 이미 있음)
☐ Add .gitignore (체크 해제)
☐ Choose a license (선택: MIT License 권장)
```

## 단계 3: 저장소 생성

**"Create repository"** 버튼 클릭

## 단계 4: HTTPS URL 복사

생성 후 나오는 화면에서 HTTPS URL 복사:
```
https://github.com/gbrinan/portfolio-website.git
```

## 단계 5: PowerShell에서 푸시

저장소 생성 후 다음 명령어 실행:

```powershell
cd C:\Users\user\Downloads\portfolio-website
git remote add origin https://github.com/gbrinan/portfolio-website.git
git remote -v
```

## 단계 6: 코드 푸시

```powershell
git push -u origin main
```

---

# 완료 후 다음 단계

## Vercel 배포

### 방법 1: Vercel 웹 (권장)
1. https://vercel.com/new 접속
2. Import Git Repository
3. `gbrinan/portfolio-website` 선택
4. Deploy 클릭

### 방법 2: Vercel CLI
```powershell
npm install -g vercel
vercel login
vercel
```

---

# 예상 URL

배포 완료 후:
- https://portfolio-website.vercel.app
- 또는 커스텀 도메인 설정 가능
