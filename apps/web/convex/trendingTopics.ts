import { query } from "./_generated/server";

interface HashtagCount {
  hashtag: string;
  count: number;
}

export const getHashtagWordsWithFilterAndCount = query({
  args: {
    // Puedes añadir argumentos si necesitas filtrar más
  },
  handler: async (ctx) => {
    // Realiza una consulta que filtre directamente las palabras con "#"
    const summaries = await ctx.db
      .query("posts")
      .withSearchIndex("search_post", (q) => q.search("content", "#"))
      .collect();

    // Crear un mapa para contar las ocurrencias de hashtags
    const hashtagCountMap = new Map<string, number>();

    // Iterar sobre los registros filtrados
    summaries.forEach((summary) => {
      const words = summary.content.split(/\s+/);

      words
        .filter((word) => word.startsWith("#"))
        .forEach((hashtag) => {
          // Incrementa el contador para cada hashtag
          hashtagCountMap.set(hashtag, (hashtagCountMap.get(hashtag) || 0) + 1);
        });
    });

    // Convierte el mapa a un array y ordena por count de manera descendente
    const hashtagCountArray: HashtagCount[] = Array.from(
      hashtagCountMap,
      ([hashtag, count]) => ({ hashtag, count }),
    ).sort((a, b) => b.count - a.count);

    return hashtagCountArray;
  },
});
