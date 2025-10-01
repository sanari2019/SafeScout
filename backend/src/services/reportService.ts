import { FastifyInstance } from 'fastify';
import { z } from 'zod';

const reportSchema = z.object({
  summary: z.string(),
  conditionAssessment: z.string(),
  authenticityCheck: z.string(),
  recommendation: z.enum(['BUY', 'NEGOTIATE', 'REJECT'])
});

interface ReportInput {
  itemTitle: string;
  conditionGrade: string;
  defects: string[];
  marketPriceMin: number;
  marketPriceMax: number;
}

export const createReportService = (_app: FastifyInstance) => {
  const generateReport = async (input: ReportInput) => {
    return reportSchema.parse({
      summary: 'Verification summary for ' + input.itemTitle,
      conditionAssessment: 'Condition reported as ' + input.conditionGrade + '.',
      authenticityCheck: 'Authenticity checks pending AI integration.',
      recommendation: 'NEGOTIATE'
    });
  };

  return { generateReport };
};
