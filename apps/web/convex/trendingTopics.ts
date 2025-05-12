import { v } from "convex/values";

import { query } from "./_generated/server";

interface HashtagCount {
  hashtag: string;
  count: number;
}

export const getHashtagWordsWithFilterAndCount = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Get all posts that contain hashtags
    const posts = await ctx.db
      .query("posts")
      .withSearchIndex("search_post", (q) => q.search("content", "#"))
      .collect();

    console.log("Convex posts", posts);

    // Create a map to count hashtag occurrences
    const hashtagCountMap = new Map<string, number>();

    // Process each post to extract hashtags
    posts.forEach((post) => {
      // Use regex to find all hashtags in the content
      const hashtagRegex = /#[\w\u0590-\u05ff]+/g;
      const hashtags = post.content.match(hashtagRegex) || [];

      // Count each hashtag
      hashtags.forEach((hashtag) => {
        const normalizedHashtag = hashtag.toLowerCase();
        hashtagCountMap.set(
          normalizedHashtag,
          (hashtagCountMap.get(normalizedHashtag) || 0) + 1,
        );
      });
    });

    // Convert map to array and sort by count
    const hashtagCountArray: HashtagCount[] = Array.from(
      hashtagCountMap,
      ([hashtag, count]) => ({ hashtag, count }),
    ).sort((a, b) => b.count - a.count);

    // Apply limit if provided
    return args.limit
      ? hashtagCountArray.slice(0, args.limit)
      : hashtagCountArray;
  },
});
