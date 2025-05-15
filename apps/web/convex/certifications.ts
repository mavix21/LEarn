import { ConvexError, v } from "convex/values";

import type { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";

// Get all certifications for the current user with their media
export const list = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const certifications = await ctx.db
      .query("certifications")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    // Get media for each certification
    const certificationsWithMedia = await Promise.all(
      certifications.map(async (certification) => {
        const media = await ctx.db
          .query("certification_media")
          .withIndex("by_certificationId", (q) =>
            q.eq("certificationId", certification._id),
          )
          .first();

        return {
          ...certification,
          media: media
            ? {
                storageId: media.storageId,
                type: media.type,
              }
            : null,
        };
      }),
    );

    return certificationsWithMedia;
  },
});

// Get a specific certification by ID with its media
export const get = query({
  args: {
    id: v.id("certifications"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const certification = await ctx.db.get(args.id);
    if (!certification) {
      throw new ConvexError("Certification not found");
    }

    // Verify ownership
    if (certification.userId !== identity.subject) {
      throw new ConvexError("Not authorized to view this certification");
    }

    // Get associated media
    const media = await ctx.db
      .query("certification_media")
      .withIndex("by_certificationId", (q) => q.eq("certificationId", args.id))
      .first();

    return {
      ...certification,
      media: media
        ? {
            storageId: media.storageId,
            type: media.type,
          }
        : null,
    };
  },
});

// Add a new certification
export const add = mutation({
  args: {
    name: v.string(),
    issuingCompany: v.string(),
    skills: v.array(v.string()),
    credentialId: v.optional(v.string()),
    credentialUrl: v.optional(v.string()),
    issueDate: v.optional(v.string()),
    mediaStorageId: v.optional(v.id("_storage")),
    mediaType: v.optional(v.union(v.literal("image"), v.literal("pdf"))),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Create the certification
    const certificationId = await ctx.db.insert("certifications", {
      userId: identity.subject as Id<"users">,
      name: args.name,
      issuingCompany: args.issuingCompany,
      skills: args.skills,
      credentialId: args.credentialId,
      credentialUrl: args.credentialUrl,
      issueDate: args.issueDate,
      isMinted: false,
    });

    // If there's media, create a media record
    if (args.mediaStorageId && args.mediaType) {
      await ctx.db.insert("certification_media", {
        certificationId,
        storageId: args.mediaStorageId,
        type: args.mediaType,
      });
    }

    return certificationId;
  },
});

// Update an existing certification
export const update = mutation({
  args: {
    id: v.id("certifications"),
    name: v.string(),
    issuingCompany: v.string(),
    skills: v.array(v.string()),
    credentialId: v.optional(v.string()),
    credentialUrl: v.optional(v.string()),
    issueDate: v.optional(v.string()),
    mediaStorageId: v.optional(v.id("_storage")),
    mediaType: v.optional(v.union(v.literal("image"), v.literal("pdf"))),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get the certification to verify ownership
    const certification = await ctx.db.get(args.id);
    if (!certification) {
      throw new ConvexError("Certification not found");
    }
    if (certification.userId !== identity.subject) {
      throw new ConvexError("Not authorized to update this certification");
    }

    // Update the certification
    await ctx.db.patch(args.id, {
      name: args.name,
      issuingCompany: args.issuingCompany,
      skills: args.skills,
      credentialId: args.credentialId,
      credentialUrl: args.credentialUrl,
      issueDate: args.issueDate,
    });

    // Handle media update
    if (args.mediaStorageId && args.mediaType) {
      // Delete existing media if any
      const existingMedia = await ctx.db
        .query("certification_media")
        .withIndex("by_certificationId", (q) =>
          q.eq("certificationId", args.id),
        )
        .first();

      if (existingMedia) {
        await ctx.db.delete(existingMedia._id);
      }

      // Add new media
      await ctx.db.insert("certification_media", {
        certificationId: args.id,
        storageId: args.mediaStorageId,
        type: args.mediaType,
      });
    }

    return args.id;
  },
});

export const updateMinted = mutation({
  args: { id: v.id("certifications"), isMinted: v.boolean() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    // Get the certification to verify ownership
    const certification = await ctx.db.get(args.id);
    if (!certification) {
      throw new ConvexError("Certification not found");
    }
    if (certification.userId !== identity.subject) {
      throw new ConvexError("Not authorized to update this certification");
    }
    // Update the certification
    await ctx.db.patch(args.id, {
      isMinted: args.isMinted,
    });
    return args.id;
  },
});
// Delete a certification and its associated media
export const remove = mutation({
  args: {
    id: v.id("certifications"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get the certification to verify ownership
    const certification = await ctx.db.get(args.id);
    if (!certification) {
      throw new ConvexError("Certification not found");
    }
    if (certification.userId !== identity.subject) {
      throw new ConvexError("Not authorized to delete this certification");
    }

    // Delete associated media
    const media = await ctx.db
      .query("certification_media")
      .withIndex("by_certificationId", (q) => q.eq("certificationId", args.id))
      .first();

    if (media) {
      await ctx.db.delete(media._id);
    }

    // Delete the certification
    await ctx.db.delete(args.id);
  },
});

export const addMinted = mutation({
  args: {
    certificationId: v.id("certifications"),
    tokenId: v.int64(),
    contractAddress: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("certifications_minted", {
      certificationId: args.certificationId,
      tokenId: args.tokenId,
      contractAddress: args.contractAddress,
    });
  },
});
