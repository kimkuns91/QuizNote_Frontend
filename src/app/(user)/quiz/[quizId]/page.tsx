import { getQuiz } from '@/actions/quizActions';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{
    quizId: string;
  }>;
}

export default async function QuizPage({ params }: PageProps) {
  const { quizId } = await params;
  
  const result = await getQuiz(quizId);
  
  if (!result.success) {
    notFound();
  }
  
  const quiz = result.data;
  console.log(quiz);
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">{quiz.title}</h1>
      <p className="mb-8 text-gray-600">{quiz.description}</p>
      
      <div className="space-y-6">
        {quiz.questions.map((question, index) => (
          <div key={question.id} className="rounded-lg border border-gray-200 p-6">
            <h3 className="mb-4 text-xl font-semibold">
              {index + 1}. {question.question}
            </h3>
            <div className="space-y-3">
              {question.options.map((option) => (
                <div key={option.id} className="flex items-center">
                  <input
                    type="radio"
                    id={option.id}
                    name={`question-${question.id}`}
                    value={option.id}
                    className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor={option.id}
                    className="ml-3 block text-gray-700"
                  >
                    {option.text}
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

