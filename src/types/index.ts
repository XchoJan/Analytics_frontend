export interface SinglePrediction {
  type: 'single';
  match: string;
  prediction: string;
  odds: number;
  confidence: number;
}

export interface ExpressBet {
  match: string;
  prediction: string;
  odds: number;
}

export interface ExpressPrediction {
  type: 'express';
  bets: ExpressBet[];
  total_odds: number;
  confidence: number;
}

export interface Express5Prediction {
  type: 'express5';
  bets: ExpressBet[];
  total_odds: number;
  confidence: number;
}

export type Prediction = SinglePrediction | ExpressPrediction | Express5Prediction;

