'use client';

import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface IPricingFeature {
  text: string;
  included: boolean;
}

interface IPricingPlan {
  name: string;
  price: string;
  description: string;
  features: IPricingFeature[];
  buttonText: string;
  popular?: boolean;
}

interface IFaqItem {
  question: string;
  answer: string;
}

export default function PricingPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const pricingPlans: IPricingPlan[] = [
    {
      name: '무료 체험',
      price: '0원',
      description: 'AI 기반 학습 서비스를 처음 이용해보는 분들을 위한 기본 플랜',
      features: [
        { text: '월 5개 강의 업로드', included: true },
        { text: '기본 음성-텍스트 변환', included: true },
        { text: '자동 강의 요약', included: true },
        { text: '기본 퀴즈 생성', included: true },
        { text: '학습 이력 관리', included: true },
        { text: '고급 분석 기능', included: false },
      ],
      buttonText: '무료로 시작하기',
    },
    {
      name: '스탠다드',
      price: '19,900원',
      description: '학생과 개인 학습자를 위한 최적화된 서비스',
      features: [
        { text: '월 30개 강의 업로드', included: true },
        { text: '고품질 음성-텍스트 변환', included: true },
        { text: '상세 강의 요약 및 노트', included: true },
        { text: '다국어 자동 감지 및 변환', included: true },
        { text: '맞춤형 퀴즈 생성', included: true },
        { text: '고급 학습 분석', included: false },
      ],
      buttonText: '스탠다드 시작하기',
      popular: true,
    },
    {
      name: '프리미엄',
      price: '39,900원',
      description: '전문가 및 교육자를 위한 고급 학습 지원 서비스',
      features: [
        { text: '무제한 강의 업로드', included: true },
        { text: '최고품질 음성-텍스트 변환', included: true },
        { text: '고급 강의 요약 및 개념 추출', included: true },
        { text: '다국어 지원 및 번역', included: true },
        { text: '고급 퀴즈 생성 및 커스터마이징', included: true },
        { text: '심층 학습 분석 및 리포트', included: true },
      ],
      buttonText: '프리미엄 시작하기',
    },
  ];

  const faqItems: IFaqItem[] = [
    {
      question: '어떤 종류의 강의 파일을 업로드할 수 있나요?',
      answer:
        'QuizNote는 wav, mp3, m4a, ogg 등 다양한 오디오 형식을 지원합니다. 무료 계정은 파일당 최대 1GB, 유료 계정은 더 큰 용량의 파일을 업로드할 수 있습니다.',
    },
    {
      question: 'AI 음성 인식의 정확도는 어느 정도인가요?',
      answer:
        'QuizNote는 OpenAI의 Whisper AI 모델을 활용하여 최첨단 음성 인식 기술을 제공합니다. 다양한 억양과 배경 소음이 있는 환경에서도 높은 정확도를 보장합니다.',
    },
    {
      question: '요금제는 언제든지 변경할 수 있나요?',
      answer:
        '네, 언제든지 요금제를 업그레이드하거나 다운그레이드할 수 있습니다. 변경 사항은 다음 결제 주기부터 적용됩니다.',
    },
    {
      question: '생성된 퀴즈와 노트는 어떻게 활용할 수 있나요?',
      answer:
        'QuizNote에서 생성된 강의 노트와 퀴즈는 웹 플랫폼에서 바로 사용하거나 다운로드할 수 있습니다. 학습 진도를 추적하고, 노트를 편집하며, 퀴즈 결과를 분석할 수 있습니다. 또한 다른 사용자들과 노트와 퀴즈를 공유하는 커뮤니티 기능도 제공합니다.',
    },
  ];

  return (
    <div className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            스마트한 학습을 위한 가격 플랜
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            학습 스타일에 맞는 플랜을 선택하세요. 언제든지 업그레이드하거나 다운그레이드할 수 있습니다.
          </p>
        </motion.div>

        <div className="mx-auto mt-16 grid max-w-lg grid-cols-1 items-center gap-y-10 sm:mt-20 sm:gap-y-8 lg:max-w-4xl lg:grid-cols-3 lg:gap-x-8">
          {pricingPlans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className={`relative flex h-full flex-col rounded-3xl p-8 ${
                plan.popular
                  ? 'z-10 bg-card shadow-xl ring-1 ring-primary/20 sm:-mx-4 sm:rounded-xl lg:-mx-4 lg:rounded-3xl'
                  : 'bg-card/60 ring-1 ring-border hover:shadow-md sm:mx-0 lg:mx-0'
              }`}
            >
              {plan.popular && (
                <motion.div
                  className="absolute -top-5 right-0 left-0 mx-auto w-36 rounded-full bg-primary px-4 py-2 text-center text-sm font-bold text-primary-foreground shadow-md"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  인기 선택
                </motion.div>
              )}

              <div className="mb-6">
                <h3 className="text-xl leading-8 font-bold text-foreground">{plan.name}</h3>
                <p className="mt-4 flex items-baseline gap-x-2">
                  <span className="text-4xl font-extrabold tracking-tight text-foreground">
                    {plan.price}
                  </span>
                  <span className="text-sm leading-6 font-semibold text-muted-foreground">/ 월</span>
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{plan.description}</p>
              </div>

              <div className="mt-2 flex-1">
                <ul role="list" className="space-y-4">
                  {plan.features.map((feature, index) => (
                    <motion.li
                      key={feature.text}
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 * index }}
                    >
                      <motion.div
                        className={`flex h-6 w-6 flex-none items-center justify-center rounded-full ${
                          feature.included ? 'bg-primary' : 'bg-muted'
                        }`}
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                      >
                        <Check
                          className={`h-4 w-4 ${feature.included ? 'text-primary-foreground' : 'text-muted-foreground'}`}
                          aria-hidden="true"
                        />
                      </motion.div>
                      <span
                        className={`text-sm leading-6 font-medium ${
                          feature.included ? 'text-foreground' : 'text-muted-foreground'
                        }`}
                      >
                        {feature.text}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                className="mt-8"
              >
                <Button
                  className={`w-full cursor-pointer rounded-xl py-6 text-base font-bold ${
                    plan.popular
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'bg-primary/10 text-primary hover:bg-primary/20'
                  }`}
                >
                  {plan.buttonText}
                </Button>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mx-auto mt-24 max-w-2xl rounded-3xl bg-gradient-to-r from-primary/5 to-accent/10 p-8 text-center shadow-sm sm:p-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            교육 기관을 위한 맞춤형 요금제
          </h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            대학, 학원, 기업 교육팀을 위한 특별한 요구사항이 있으신가요?
          </p>
          <motion.div
            className="mt-6"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <Button
              variant="outline"
              className="cursor-pointer border-2 border-primary bg-card px-6 py-5 text-base font-bold text-primary hover:bg-primary/5"
            >
              교육 기관 맞춤 요금제 문의하기
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          className="mx-auto mt-24 max-w-4xl rounded-3xl bg-muted p-8 ring-1 ring-border sm:p-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold tracking-tight text-foreground">자주 묻는 질문</h2>
          <div className="mt-8 grid gap-y-6">
            {faqItems.map((item, index) => (
              <motion.div
                key={index}
                className="rounded-xl border border-border bg-card shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                whileHover={{ scale: 1.01 }}
              >
                <motion.button
                  onClick={() => toggleFaq(index)}
                  className="flex w-full cursor-pointer items-center justify-between p-6 text-left"
                  whileTap={{ scale: 0.98 }}
                >
                  <h3 className="text-base leading-7 font-semibold text-foreground">
                    {item.question}
                  </h3>
                  <motion.span
                    animate={{ rotate: expandedFaq === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-2xl text-primary"
                  >
                    ↓
                  </motion.span>
                </motion.button>
                <motion.div
                  animate={{
                    height: expandedFaq === index ? 'auto' : 0,
                    opacity: expandedFaq === index ? 1 : 0,
                  }}
                  initial={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden px-6"
                  style={{ paddingBottom: expandedFaq === index ? '1.5rem' : 0 }}
                >
                  <p className="text-sm leading-7 text-muted-foreground">{item.answer}</p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          className="mx-auto mt-24 max-w-2xl text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            지금 바로 <span className="font-bold text-primary">QuizNote</span>와 함께하세요
          </h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            효율적인 학습 경험을 위한 첫 걸음,{' '}
            <span className="font-bold text-primary">QuizNote</span>이 함께합니다.
          </p>
          <motion.div
            className="mt-6"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <Link href="/dashboard">
              <Button className="cursor-pointer bg-primary px-8 py-6 text-base font-bold text-primary-foreground hover:bg-primary/90">
                무료로 시작하기
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}