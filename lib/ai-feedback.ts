import OpenAI from 'openai';

/**
 * AIフィードバックを生成
 */
export async function generateAIFeedback(
  missionTitle: string,
  missionDescription: string,
  submissionContent: string,
  aiRubricJson?: string | null
): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    return '**AIフィードバックは現在利用できません**\n\nOpenAI APIキーが設定されていません。';
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    let rubric = '';
    if (aiRubricJson) {
      try {
        const rubricObj = JSON.parse(aiRubricJson);
        rubric = `\n\n評価基準:\n${JSON.stringify(rubricObj, null, 2)}`;
      } catch {
        // JSON解析失敗時は無視
      }
    }

    const prompt = `あなたは経験豊富なメンターです。以下の課題提出物に対して、建設的で具体的なフィードバックを日本語で提供してください。

課題タイトル: ${missionTitle}

課題内容:
${missionDescription}
${rubric}

提出内容:
${submissionContent}

以下の構成でMarkdown形式でフィードバックを作成してください：

## 良かった点
- 具体的に良かった点を箇条書きで記載

## 改善点
- 建設的な改善提案を箇条書きで記載

## 次のステップ
- さらに学習を深めるための提案を箇条書きで記載

フィードバックは励ましと具体的なアドバイスのバランスを取り、学習者のモチベーションを高めるものにしてください。`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'あなたは優秀な教育者で、学習者を励まし成長を促すメンターです。',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return completion.choices[0]?.message?.content || 'フィードバックの生成に失敗しました。';
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return '**AIフィードバックの生成中にエラーが発生しました**\n\n後ほど再度お試しください。';
  }
}
