'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import { motion } from 'framer-motion';

export default function FaqSection() {
  const faqs = [
    {
      question: "'QuizNote'는 어떤 음성 파일 형식을 지원하나요?",
      answer:
        "'QuizNote'는 wav, mp3, m4a, ogg, aiff, caf 등 다양한 오디오 형식을 지원합니다. 파일 크기는 무료 계정은 1GB, 비즈니스 계정은 10GB까지 업로드 가능합니다.",
    },
    {
      question: "변환 정확도는 어느 정도인가요?",
      answer:
        "'QuizNote'는 자체 음성 분석 모델을 활용하여 매우 높은 정확도로 음성을 텍스트로 변환합니다. 다양한 언어와 억양, 배경 소음이 있는 환경에서도 우수한 성능을 보입니다.",
    },
    {
      question: '무료로 사용할 수 있나요?',
      answer:
        '기본적인 음성 변환 기능은 무료로 제공되며, 매월 일정 시간 분량의 오디오를 처리할 수 있습니다. 더 많은 사용량이나 고급 기능이 필요한 경우 프리미엄 요금제를 이용하실 수 있습니다.',
    },
    {
      question: '개인정보는 안전하게 보호되나요?',
      answer:
        "네, 'QuizNote'는 사용자의 개인정보와 오디오 파일을 철저히 보호합니다. 모든 데이터는 암호화되어 저장되며, 변환 완료 후 자동으로 삭제되거나 사용자가 원하는 기간 동안만 보관됩니다.",
    },
    {
      question: '변환된 텍스트는 어떻게 활용할 수 있나요?',
      answer:
        "'QuizNote'로 변환된 텍스트는 다운로드하거나 바로 편집할 수 있습니다. 회의록 작성, 인터뷰 기록, 강의 노트 정리 등 다양한 용도로 활용 가능합니다. 또한 자동 요약, 키워드 추출 등의 부가 기능도 제공합니다.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="bg-background py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">자주 묻는 질문</h2>
          <p className="text-xl text-muted-foreground">서비스에 대해 궁금한 점이 있으신가요?</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mx-auto max-w-3xl"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div key={index} variants={itemVariants} custom={index}>
                <AccordionItem
                  value={`item-${index}`}
                  className="overflow-hidden rounded-lg border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
                >
                  <AccordionTrigger className="cursor-pointer px-6 py-4 text-left text-lg font-semibold text-foreground hover:text-primary">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
