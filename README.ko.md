# TL;DR Terms

> 이용약관과 개인정보 처리방침을 AI로 분석하여 당신이 무엇에 동의하는지 이해할 수 있도록 돕는 서비스입니다.

**Language:** [English](./README.md) | 한국어

---

🔗 **라이브 데모:** [tldrterms.app](https://tldrterms.app)

![TL;DR Terms 미리보기](./public/preview.webp)

## 🎯 왜 이 프로젝트를 만들었나요?

오늘날 디지털 환경에서 사용자들은 긴 이용약관과 개인정보 처리방침을 읽지 않고 동의하는 경우가 많으며, 이로 인해 개인 데이터와 디지털 권리를 위협하는 심각한 개인정보 위험에 노출됩니다.

### 실제 사례:

**Roborock (2024년, 한국)**

- 사용자의 개인 데이터를 중국에서 수집 및 처리한다는 내용으로 개인정보 처리방침을 변경
- 대부분의 사람들은 개인정보 약관을 읽지 않아 이를 인지하지 못함

**WhatsApp (2021년, 글로벌)**

- Facebook과의 필수 데이터 공유 정책 발표 (거부 옵션 없음)
- 엄청난 반발로 며칠 만에 460만 명이 Signal로, 500만 명 이상이 Telegram으로 이동
- 대중의 반발로 정책 시행이 3개월 연기됨

**문제점:** 사람들은 약관이 너무 길고 복잡해서 읽지 않습니다. 하지만 바로 그때 기업들이 우려스러운 변경사항을 슬쩍 넣곤 합니다.

**해결책:** TL;DR Terms는 AI를 사용하여 이용약관을 대신 읽고, 분석하고, 평가합니다.

## ✨ 주요 기능

- 🔍 **URL 분석** - 약관/개인정보정책 URL만 입력하면 됩니다
- 🤖 **AI 기반 분석** - OpenAI GPT를 활용한 종합적인 평가
- 📊 **점수 시스템** - 0-100점 점수와 등급 제공
- 📝 **상세 분석** - 주요 우려사항에 대한 요약 및 분석
- 💾 **히스토리 추적** - 과거 분석 내역 저장 및 검토
- 🔎 **검색 기능** - 웹사이트 이름으로 이전 분석 검색
- 🔐 **사용자 인증** - 안전한 로그인 및 개인 분석 기록 관리

## 🛠 기술 스택

- **프레임워크:** [Next.js 15](https://nextjs.org/)
- **데이터베이스 & 인증:** [Supabase](https://supabase.com/)
- **AI:** OpenAI GPT
- **언어:** TypeScript
- **데이터 페칭:** [TanStack Query](https://tanstack.com/query)
- **유효성 검사:** [Zod](https://zod.dev/)
- **스타일링:** Tailwind CSS
- **배포:** [Vercel](https://vercel.com/)

## 🚀 시작하기

### 사전 요구사항

- Node.js 22+
- pnpm
- Supabase 계정
- OpenAI API 키

### 설치 방법

```bash
# 저장소 클론
git clone https://github.com/iianjun/tldrterms.git

# 프로젝트 디렉토리로 이동
cd tldrterms

# 의존성 설치
pnpm install

# 환경 변수 설정
cp .env.example .env.local
# Supabase와 OpenAI 자격증명 추가

# 개발 서버 실행
pnpm dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### 환경 변수

`.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_BASE_URL=your_base_url
API_URL=your_api_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## 📁 프로젝트 구조

```
tldr-terms/
├── src/
│   ├── app/              # Next.js 앱 디렉토리 (라우트 및 레이아웃)
│   ├── assets/           # Lottie 파일 & 아이콘 SVG
│   ├── components/       # React 컴포넌트
│   ├── constants/        # 상수
│   ├── hooks/            # 커스텀 React 훅
│   ├── lib/              # 유틸리티 함수 및 설정
│   ├── providers/        # React 프로바이더 (Query Client)
│   ├── services/         # API 호출 (apiClient)
│   ├── types/            # TypeScript 타입
│   ├── utils/            # 유틸리티 함수
│   └── validations/      # Zod 스키마
└── public/               # 정적 파일
```

## 🔒 개인정보 보호 & 보안

- 모든 분석 결과는 Supabase에 안전하게 저장됩니다
- Supabase Auth를 통한 사용자 인증
- 사용자 데이터는 제3자와 절대 공유되지 않습니다
- OpenAI API 호출은 서버 사이드에서만 이루어집니다

## 🌐 배포

이 프로젝트는 Vercel에 배포되어 있습니다. `main` 브랜치에 푸시하면 자동으로 배포됩니다.

## 🤝 기여하기

기여를 환영합니다! Pull Request를 자유롭게 제출해주세요.

## 📄 라이선스

이 프로젝트는 오픈소스이며 [MIT License](LICENSE) 하에 제공됩니다.

## 📫 연락처

- **웹사이트:** [tldrterms.app](https://tldrterms.app)
- **GitHub:** [@iianjun](https://github.com/iianjun)

---

⚠️ **면책 조항:** TL;DR Terms는 AI 기반 약관 분석을 제공하지만, 법률 자문으로 간주되어서는 안 됩니다. 중요한 결정을 내릴 때는 항상 법률 전문가와 상담하세요.

---

⭐ 이 프로젝트가 유용하다고 생각하신다면 GitHub에서 스타를 눌러주세요!
