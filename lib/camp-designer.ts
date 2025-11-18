import OpenAI from 'openai';

export interface CampDesign {
  title: string;
  description: string;
  modules: {
    title: string;
    order: number;
    missions: {
      title: string;
      description: string;
      aiRubricJson?: string;
    }[];
  }[];
}

/**
 * AIでキャンプの設計を生成
 */
export async function designCamp(
  goal: string,
  duration: string,
  targetAudience: string
): Promise<CampDesign> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OpenAI APIキーが設定されていません');
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const prompt = `あなたは教育カリキュラムの設計エキスパートです。以下の条件に基づいて、学習キャンプ（ブートキャンプ・講座）の詳細なカリキュラムを設計してください。

【条件】
- 目標: ${goal}
- 期間: ${duration}
- 対象者: ${targetAudience}

以下のJSON形式で出力してください：

{
  "title": "キャンプのタイトル",
  "description": "キャンプの詳細説明（2-3文）",
  "modules": [
    {
      "title": "モジュール1のタイトル",
      "order": 1,
      "missions": [
        {
          "title": "ミッション1のタイトル",
          "description": "ミッションの詳細説明（具体的な課題内容、成果物、学習目標を含む）",
          "aiRubricJson": "{\\"criteria\\": [\\"基準1\\", \\"基準2\\"], \\"weights\\": [0.5, 0.5]}"
        }
      ]
    }
  ]
}

注意事項：
- モジュールは3-5個程度が適切
- 各モジュールには2-4個のミッションを含める
- ミッションは段階的に難易度が上がるように設計
- 各ミッションは具体的で実践的な内容にする
- aiRubricJsonには評価基準を含める（JSON形式の文字列として）`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'あなたは経験豊富な教育カリキュラムデザイナーです。実践的で効果的な学習プログラムを設計します。',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('AIからの応答が空です');
    }

    const design = JSON.parse(content) as CampDesign;

    // バリデーション
    if (!design.title || !design.description || !design.modules || design.modules.length === 0) {
      throw new Error('生成されたカリキュラムの形式が不正です');
    }

    return design;
  } catch (error) {
    console.error('Camp design generation error:', error);
    throw new Error('キャンプ設計の生成に失敗しました');
  }
}
