'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HowToUseSection() {
  const steps = [
    {
      number: 1,
      title: '파일 업로드',
      description: '오디오 파일을 업로드하거나 URL을 입력하여 파일을 불러옵니다.',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
      ),
      bgColor: "bg-primary/10",
      decoration: (
        <motion.div 
          className="absolute -top-10 -right-10 h-20 w-20 rounded-full bg-primary/5 opacity-70 blur-lg"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.7, 0.5] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      ),
    },
    {
      number: 2,
      title: 'AI 변환',
      description: 'QuizWhiz가 음성을 분석하고 고정밀 텍스트로 변환합니다.',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-accent"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
          />
        </svg>
      ),
      bgColor: "bg-accent/10",
      decoration: (
        <motion.div 
          className="absolute -bottom-8 -left-8 h-16 w-16 rounded-full bg-accent/5 opacity-70 blur-lg"
          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.6, 0.4] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        />
      ),
    },
    {
      number: 3,
      title: '결과 확인',
      description: '변환된 텍스트를 확인하고 다운로드하거나 편집할 수 있습니다.',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
      bgColor: "bg-primary/10",
      decoration: (
        <motion.div 
          className="absolute -top-6 -left-6 h-12 w-12 rounded-full bg-primary/5 opacity-70 blur-lg"
          animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      ),
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };
  
  // 연결선을 위한 SVG 패스
  const connectorPath = {
    start: "M0,50 C40,30 60,70 100,50",
    end: "M0,50 C40,70 60,30 100,50"
  };
  
  return (
    <section className="bg-background py-20 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 max-w-3xl text-center"
        >
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">어떻게 사용하나요?</h2>
          <p className="text-xl text-muted-foreground">
            <span className="font-bold text-primary">QuizNote</span>는 누구나 쉽게 사용할 수
            있습니다. 단 세 단계로 음성을 텍스트로 변환해보세요.
          </p>
        </motion.div>

        {/* 데코레이션 요소 */}
        <motion.div 
          className="absolute right-0 top-1/4 -z-10 h-64 w-64 rounded-full bg-primary/5 opacity-50 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute left-0 bottom-1/3 -z-10 h-64 w-64 rounded-full bg-accent/5 opacity-50 blur-3xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="relative grid grid-cols-1 gap-8 md:grid-cols-3"
        >
          {/* 데스크탑 연결선 (md 이상 화면에서만 표시) */}
          <div className="absolute top-24 left-1/6 right-1/6 hidden md:block">
            <svg height="50" width="100%" className="absolute">
              <motion.path
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ 
                  pathLength: 1,
                  opacity: 1,
                  d: connectorPath.end
                }}
                transition={{ 
                  default: { duration: 2, ease: "easeInOut" },
                  d: { 
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 5,
                    ease: "easeInOut"
                  }
                }}
                viewport={{ once: true }}
                stroke="rgb(var(--color-primary) / 0.3)"
                strokeWidth="2"
                fill="none"
                d={connectorPath.start}
                style={{ width: '100%' }}
              />
            </svg>
          </div>

          {steps.map((step, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants} 
              className="relative text-center"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              {step.decoration}
              <div className="relative backdrop-blur-sm p-6 rounded-xl border border-border/30 shadow-sm hover:shadow-md transition-all duration-300 bg-card/30">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={`mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full ${step.bgColor} relative overflow-hidden`}
                >
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary/5 to-transparent"
                    animate={{ 
                      rotate: [0, 360],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      rotate: { duration: 10, repeat: Infinity, ease: "linear" },
                      scale: { duration: 5, repeat: Infinity, ease: "easeInOut" }
                    }}
                  />
                  <div className="relative">
                    {step.icon}
                    <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white text-xs font-bold">
                      {step.number}
                    </div>
                  </div>
                </motion.div>
                <h3 className="mb-3 text-xl font-semibold text-foreground">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <motion.div 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-primary/25 transition-all duration-300">
              <Link href={`/login?callbackUrl=${encodeURIComponent('/dashboard')}`}>
                <span className="flex items-center">
                  지금 시작하기
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="ml-2 h-5 w-5" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M13 7l5 5m0 0l-5 5m5-5H6" 
                    />
                  </svg>
                </span>
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
