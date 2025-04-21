import { Clock, FileText, HelpCircle, Mail, MessageCircle, Phone } from 'lucide-react';

import Link from 'next/link';

export const metadata = {
  title: '고객 지원 | QuizNote',
  description:
    'QuizNote의 고객 지원 서비스에 대해 알아보세요. 자주 묻는 질문, 문의 방법 등을 확인할 수 있습니다.',
};

export default function SupportPage() {
  return (
    <div className="bg-background py-16 sm:py-24">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl">고객 지원</h1>
          <p className="text-lg text-muted-foreground">
            <span className="font-bold text-primary">QuizNote</span>는 여러분의 학습 경험 향상을
            위해 항상 함께합니다.
          </p>
        </div>

        {/* 문의 방법 섹션 */}
        <section className="mb-16">
          <h2 className="mb-8 text-2xl font-bold text-foreground">문의 방법</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Mail className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">이메일 문의</h3>
              <p className="mb-4 text-muted-foreground">평일 09:00 - 18:00 이내 답변을 드립니다.</p>
              <a
                href="mailto:support@quiznote.com"
                className="text-primary hover:text-primary/90"
              >
                support@quiznote.com
              </a>
            </div>

            <div className="rounded-lg border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Phone className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">전화 문의</h3>
              <p className="mb-4 text-muted-foreground">평일 09:00 - 18:00 상담 가능합니다.</p>
              <a href="tel:02-1234-5678" className="text-primary hover:text-primary/90">
                02-1234-5678
              </a>
            </div>

            <div className="rounded-lg border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <MessageCircle className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">실시간 채팅</h3>
              <p className="mb-4 text-muted-foreground">평일 09:00 - 18:00 실시간 상담 가능합니다.</p>
              <Link href="/chat" className="text-primary hover:text-primary/90">
                채팅 시작하기
              </Link>
            </div>
          </div>
        </section>

        {/* 운영 시간 섹션 */}
        <section className="mb-16 rounded-lg bg-muted p-6">
          <div className="flex items-start">
            <div className="mt-1 mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h2 className="mb-4 text-xl font-bold text-foreground">고객 지원 운영 시간</h2>
              <div className="space-y-2 text-muted-foreground">
                <p>평일: 오전 9시 - 오후 6시</p>
                <p>점심시간: 오후 12시 - 오후 1시</p>
                <p>토요일, 일요일 및 공휴일: 휴무</p>
                <p className="mt-4 text-sm italic">
                  * 운영 시간 외 문의는 이메일로 접수해 주시면 다음 영업일에 순차적으로 답변
                  드리겠습니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 자주 묻는 질문 섹션 */}
        <section className="mb-16">
          <h2 className="mb-8 text-2xl font-bold text-foreground">자주 묻는 질문</h2>
          <div className="space-y-6">
            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="mb-3 text-lg font-semibold text-foreground">
                <span className="font-medium">QuizNote</span> 서비스는 어떻게 이용하나요?
              </h3>
              <p className="text-muted-foreground">
                <span className="font-medium">QuizNote</span>는 회원가입 후 바로 이용 가능합니다.
                메인 페이지에서 강의 녹음 파일을 업로드하거나, 텍스트로 직접 강의 내용을 입력할 수 있습니다.
                AI가 자동으로 강의 내용을 분석하여 요약 노트와 퀴즈를 생성해 드립니다. 
                생성된 자료는 대시보드에서 관리하고 언제든지 다시 볼 수 있습니다.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="mb-3 text-lg font-semibold text-foreground">
                무료로 이용할 수 있는 서비스가 있나요?
              </h3>
              <p className="text-muted-foreground">
                네, 기본적인 강의 변환 및 퀴즈 생성 기능은 월 5회까지 무료로 이용 가능합니다. 
                무료 계정에서도 기본적인 학습 이력 관리와 자동 요약 기능을 사용하실 수 있습니다.
                더 많은 기능과 무제한 사용을 원하시면 유료 요금제를 이용해 보세요.
                자세한 요금 정보는 요금제 페이지에서 확인하실 수 있습니다.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="mb-3 text-lg font-semibold text-foreground">
                개인정보는 어떻게 보호되나요?
              </h3>
              <p className="text-muted-foreground">
                <span className="font-medium">QuizNote</span>는 이용자의 개인정보 보호를 최우선으로
                생각합니다. 모든 개인정보는 암호화되어 안전하게 저장되며, 법률에서 정한 경우를
                제외하고는 제3자에게 제공되지 않습니다. 업로드된 강의 파일과 생성된 콘텐츠는 사용자 계정에만
                연결되어 안전하게 보관됩니다. 자세한 내용은 개인정보처리방침을 참고해 주세요.
              </p>
              <div className="mt-4">
                <Link href="/privacy" className="text-primary hover:text-primary/90">
                  개인정보처리방침 보기
                </Link>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="mb-3 text-lg font-semibold text-foreground">
                어떤 파일 형식을 지원하나요?
              </h3>
              <p className="text-muted-foreground">
                QuizNote는 mp3, wav, ogg, m4a와 같은 일반적인 오디오 파일 형식을 지원합니다. 
                최대 파일 크기는 무료 플랜의 경우 500MB, 유료 플랜은 최대 1GB까지 지원합니다.
                음질이 좋을수록 더 정확한 변환 결과를 얻을 수 있습니다.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <h3 className="mb-3 text-lg font-semibold text-foreground">
                환불 정책은 어떻게 되나요?
              </h3>
              <p className="text-muted-foreground">
                서비스 구독 시작 후 7일 이내에는 전액 환불이 가능합니다. 다만, 이미 서비스를 사용한 경우
                (강의 변환, 노트 생성 등)에는 해당 서비스 이용 금액을 제외한 금액이 환불됩니다. 
                자세한 환불 정책은 고객센터로 문의해 주세요.
              </p>
            </div>
          </div>
        </section>

        {/* 추가 지원 자료 섹션 */}
        <section className="mb-16">
          <h2 className="mb-8 text-2xl font-bold text-foreground">추가 지원 자료</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <FileText className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">이용 가이드</h3>
              <p className="mb-4 text-muted-foreground">
                <span className="font-medium">QuizNote</span> 서비스 이용 방법에 대한 상세한
                가이드를 제공합니다.
              </p>
              <Link
                href="/guide"
                className="inline-flex items-center text-primary hover:text-primary/90"
              >
                가이드 보기
              </Link>
            </div>

            <div className="rounded-lg border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <HelpCircle className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">학습 팁 모음</h3>
              <p className="mb-4 text-muted-foreground">
                효과적인 학습 방법과 QuizNote를 활용한 학습 전략을 제공합니다.
              </p>
              <Link
                href="/learning-tips"
                className="inline-flex items-center text-primary hover:text-primary/90"
              >
                학습 팁 보기
              </Link>
            </div>
          </div>
        </section>

        {/* 문의하기 섹션 */}
        <div className="rounded-lg bg-primary/5 p-8">
          <div className="text-center">
            <h2 className="mb-4 text-2xl font-bold text-primary">
              아직 궁금한 점이 있으신가요?
            </h2>
            <p className="mb-6 text-primary/90">
              문의 양식을 통해 질문을 남겨주시면 빠르게 답변 드리겠습니다.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center rounded-lg bg-primary px-6 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90"
            >
              문의하기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}