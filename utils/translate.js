export async function translateToEnglish(text, lang) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Translate medical symptoms to English accurately",
        },
        { role: "user", content: text },
      ],
    }),
  });

  const data = await res.json();
  return data.choices[0].message.content;
}
