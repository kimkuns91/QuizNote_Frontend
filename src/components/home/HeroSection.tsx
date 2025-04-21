'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.8 }
    }
  };

  return (
    <section className="relative overflow-hidden bg-background py-20 md:py-32">
      {/* 배경 그라데이션 효과 */}
      <motion.div 
        className="absolute inset-0 z-0 bg-gradient-to-br from-primary/5 to-background" 
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      />

      {/* 장식용 원형 요소 */}
      <motion.div 
        className="absolute -top-24 -right-24 z-0 h-96 w-96 rounded-full bg-primary/10 opacity-70 blur-3xl" 
        animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.7, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute -bottom-24 -left-24 z-0 h-96 w-96 rounded-full bg-accent/20 opacity-70 blur-3xl" 
        animate={{ scale: [1, 1.2, 1], opacity: [0.6, 0.8, 0.6] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <div className="relative z-10 container mx-auto px-4">
        <motion.div 
          className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* 텍스트 섹션 */}
          <div className="max-w-2xl">
            <motion.h1 
              className="mb-6 text-4xl leading-tight font-bold text-foreground md:text-5xl lg:text-5xl"
              variants={itemVariants}
            >
              AI로 더 효율적인 <br />
              <span className="text-primary">스마트 학습 경험</span>
            </motion.h1>
            <motion.p 
              className="mb-8 text-xl text-muted-foreground"
              variants={itemVariants}
            >
              강의 파일이나 유튜브 URL을 업로드하면, <span className="font-bold text-primary">QuizNote</span>가 
              자동으로 요약과 퀴즈를 만들어 학습 효율을 높여드립니다.
            </motion.p>
            <motion.div 
              className="flex flex-col gap-4 sm:flex-row"
              variants={itemVariants}
            >
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-primary/25 transition-all duration-300">
                <Link href={`/dashboard`}>무료로 시작하기</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-primary text-primary hover:bg-primary/10 transition-all duration-300"
              >
                <Link href="/how-it-works">사용 방법 알아보기</Link>
              </Button>
            </motion.div>

            {/* 신뢰 지표 */}
            <motion.div 
              className="mt-12"
              variants={itemVariants}
            >
              <p className="mb-4 text-sm text-muted-foreground">주요 기능</p>
              <motion.div 
                className="flex flex-wrap items-center gap-8"
                variants={containerVariants}
              >
                <motion.div 
                  className="flex items-center gap-2"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-primary"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-foreground">AI 강의 요약</span>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-2"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-primary"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <span className="text-foreground">자동 퀴즈 생성</span>
                </motion.div>
                <motion.div 
                  className="flex items-center gap-2"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-primary"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6.625 2.655A9 9 0 0119 11a1 1 0 11-2 0 7 7 0 00-9.625-6.492 1 1 0 11-.75-1.853zM4.662 4.959A1 1 0 014.75 6.37 6.97 6.97 0 003 11a1 1 0 11-2 0 8.97 8.97 0 012.25-5.953 1 1 0 011.412-.088z"
                        clipRule="evenodd"
                      />
                      <path
                        fillRule="evenodd"
                        d="M5 11a5 5 0 1110 0 1 1 0 11-2 0 3 3 0 10-6 0c0 1.677-.345 3.276-.968 4.729a1 1 0 11-1.838-.789A9.964 9.964 0 005 11z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <span className="text-foreground">학습 진도 관리</span>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

          {/* 이미지 섹션 */}
          <motion.div 
            className="relative hidden lg:block"
            variants={itemVariants}
          >
            <motion.div 
              className="absolute inset-0 scale-105 rotate-3 transform rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20" 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1.05 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            />
            <motion.div 
              className="relative rounded-2xl bg-card p-2 shadow-xl"
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                <video
                  src="/videos/actions.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="rounded-xl object-cover w-full h-full"
                />
              </div>
            </motion.div>

            {/* 플로팅 카드 */}
            <motion.div 
              className="absolute -bottom-6 -left-12 rounded-lg bg-card p-4 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: [0, -10, 0],
                transition: {
                  y: {
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  },
                  opacity: { duration: 0.5, delay: 0.8 }
                }
              }}
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">맞춤형 학습 노트</p>
                  <p className="text-xs text-muted-foreground">핵심 개념 자동 추출</p>
                </div>
              </div>
            </motion.div>

            {/* 플로팅 카드 2 */}
            <motion.div 
              className="absolute -top-6 -right-12 rounded-lg bg-card p-4 shadow-lg"
              initial={{ opacity: 0, y: -20 }}
              animate={{ 
                opacity: 1, 
                y: [0, 10, 0],
                transition: {
                  y: {
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  },
                  opacity: { duration: 0.5, delay: 1 }
                }
              }}
              whileHover={{ y: 5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-primary"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">AI 퀴즈</p>
                  <p className="text-xs text-muted-foreground">자동 생성된 문제</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}