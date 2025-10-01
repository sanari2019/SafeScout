import { FastifyInstance } from 'fastify';
import { z } from 'zod';

const riskResponseSchema = z.object({
  riskScore: z.number().min(0).max(100),
  signals: z.array(z.string()),
  recommendation: z.enum(['LOW_RISK', 'MEDIUM_RISK', 'HIGH_RISK']),
  explanation: z.string()
});

interface RiskAnalysisInput {
  title: string;
  price: number;
  description: string;
  sellerAge: number;
  photoCount: number;
}

export const createRiskService = (_app: FastifyInstance) => {
  const analyzeListing = async (input: RiskAnalysisInput) => {
    const heuristics: string[] = [];
    let score = 20;

    if (input.price < 0.6 * 1000) {
      heuristics.push('Price significantly below market average');
      score += 30;
    }

    if (input.sellerAge < 30) {
      heuristics.push('Seller account is new');
      score += 20;
    }

    if (input.photoCount <= 2) {
      heuristics.push('Limited photo evidence');
      score += 10;
    }

    const boundedScore = Math.min(score, 95);
    const recommendation = boundedScore > 70 ? 'HIGH_RISK' : boundedScore > 40 ? 'MEDIUM_RISK' : 'LOW_RISK';

    return riskResponseSchema.parse({
      riskScore: boundedScore,
      signals: heuristics,
      recommendation,
      explanation: 'Heuristic risk assessment placeholder. Replace with OpenAI integration when keys are provisioned.'
    });
  };

  return { analyzeListing };
};
