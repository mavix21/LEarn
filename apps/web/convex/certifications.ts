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

    return certifications;
  },
});

// Get a specific certification by ID with its media
export const get = query({
  args: {
    id: v.id("certifications"),
  },
  handler: async (ctx, args) => {
    const certification = await ctx.db.get(args.id);
    if (!certification) {
      throw new ConvexError({ message: "Certification not found" });
    }

    return certification;
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
    mediaStorageId: v.id("_storage"),
    mediaType: v.union(v.literal("image"), v.literal("pdf")),
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
      mintingStatus: {
        type: "not_minted",
      },
      media: {
        storageId: args.mediaStorageId,
        type: args.mediaType,
      },
    });

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
      throw new ConvexError({ message: "Certification not found" });
    }
    if (certification.userId !== identity.subject) {
      throw new ConvexError({
        message: "Not authorized to update this certification",
      });
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
      await ctx.db.patch(args.id, {
        media: {
          storageId: args.mediaStorageId,
          type: args.mediaType,
        },
      });
    }
    return args.id;
  },
});

export const updateMinted = mutation({
  args: {
    id: v.id("certifications"),
    contractAddress: v.string(),
    tokenId: v.int64(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Get the certification to verify ownership
    const certification = await ctx.db.get(args.id);
    if (!certification) {
      throw new ConvexError({ message: "Certification not found" });
    }
    if (certification.userId !== identity.subject) {
      throw new ConvexError({
        message: "Not authorized to update this certification",
      });
    }

    // Check if the certification is already minted
    if (certification.mintingStatus.type === "minted") {
      throw new ConvexError({ message: "Certification is already minted" });
    }

    // Update the certification
    await ctx.db.patch(args.id, {
      mintingStatus: {
        type: "minted",
        contractAddress: args.contractAddress,
        tokenId: args.tokenId,
        endorsements: [],
      },
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
      throw new ConvexError({ message: "Certification not found" });
    }
    if (certification.userId !== identity.subject) {
      throw new ConvexError({
        message: "Not authorized to delete this certification",
      });
    }

    // Delete the certification
    await ctx.db.delete(args.id);
  },
});

export const endorse = mutation({
  args: {
    id: v.id("certifications"),
    comment: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const currentUserId = identity.subject as Id<"users">;

    // Get the certification to verify ownership
    const certification = await ctx.db.get(args.id);

    if (!certification) {
      throw new ConvexError({ message: "Certification not found" });
    }

    if (certification.mintingStatus.type !== "minted") {
      throw new ConvexError({ message: "Certification is not minted" });
    }

    // Check if the endorsement already exists
    if (
      certification.mintingStatus.endorsements.some(
        (endorsement) => endorsement.userId === currentUserId,
      )
    ) {
      throw new ConvexError({ message: "Certification is already endorsed" });
    }

    // Add the endorsement
    await ctx.db.patch(args.id, {
      mintingStatus: {
        ...certification.mintingStatus,
        endorsements: [
          ...certification.mintingStatus.endorsements,
          {
            userId: currentUserId,
            endorserAddress: identity.subject,
            comment: args.comment,
          },
        ],
      },
    });
  },
});
