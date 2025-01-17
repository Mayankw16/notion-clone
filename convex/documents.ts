import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

export const create = mutation({
  args: {
    title: v.string(),
    parentDocument: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity)
      throw new ConvexError({ message: "Unauthenticated!", code: 401 });

    const userId = identity.subject;

    const document = await ctx.db.insert("documents", {
      title: args.title,
      parentDocument: args.parentDocument,
      userId,
      isArchived: false,
      isPublished: false,
    });

    return document;
  },
});

export const getSidebar = query({
  args: {
    parentDocument: v.optional(v.id("documents")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity)
      throw new ConvexError({ message: "Unauthenticated!", code: 401 });

    const userId = identity.subject;

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user_parent", (q) =>
        q.eq("userId", userId).eq("parentDocument", args.parentDocument)
      )
      .filter((q) => q.eq(q.field("isArchived"), false))
      .order("desc")
      .collect();

    return documents;
  },
});

export const archive = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity)
      throw new ConvexError({ message: "Unauthenticated!", code: 401 });

    const userId = identity.subject;

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument)
      throw new ConvexError({ message: "Not Found!", code: 404 });

    if (existingDocument.userId !== userId)
      throw new ConvexError({ message: "Forbidden!", code: 403 });

    const recursiveArchive = async (documentId: Id<"documents">) => {
      const children = await ctx.db
        .query("documents")
        .withIndex("by_user_parent", (q) =>
          q.eq("userId", userId).eq("parentDocument", documentId)
        )
        .collect();

      for (const child of children) {
        await ctx.db.patch(child._id, {
          isArchived: true,
        });

        await recursiveArchive(child._id);
      }
    };

    const document = await ctx.db.patch(args.id, {
      isArchived: true,
    });

    recursiveArchive(args.id);

    return document;
  },
});

export const getTrash = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity)
      throw new ConvexError({ message: "Unauthenticated!", code: 401 });

    const userId = identity.subject;

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), true))
      .order("desc")
      .collect();

    return documents;
  },
});

export const restore = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity)
      throw new ConvexError({ message: "Unauthenticated!", code: 401 });

    const userId = identity.subject;

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument)
      throw new ConvexError({ message: "Not Found!", code: 404 });

    if (existingDocument.userId !== userId)
      throw new ConvexError({ message: "Forbidden!", code: 403 });

    const recursiveRestore = async (documentId: Id<"documents">) => {
      const children = await ctx.db
        .query("documents")
        .withIndex("by_user_parent", (q) =>
          q.eq("userId", userId).eq("parentDocument", documentId)
        )
        .collect();

      for (const child of children) {
        await ctx.db.patch(child._id, { isArchived: false });
        await recursiveRestore(child._id);
      }
    };

    const options: Partial<Doc<"documents">> = {
      isArchived: false,
    };

    if (existingDocument.parentDocument) {
      const parent = await ctx.db.get(existingDocument.parentDocument);
      if (parent?.isArchived) options.parentDocument = undefined;
    }

    const document = await ctx.db.patch(args.id, options);
    recursiveRestore(args.id);

    return document;
  },
});

export const remove = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity)
      throw new ConvexError({ message: "Unauthenticated!", code: 401 });

    const userId = identity.subject;

    const existingDocument = await ctx.db.get(args.id);

    if (!existingDocument)
      throw new ConvexError({ message: "Not Found!", code: 404 });

    if (existingDocument.userId !== userId)
      throw new ConvexError({ message: "Forbidden!", code: 403 });

    const document = await ctx.db.delete(args.id);

    return document;
  },
});

export const getSearch = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity)
      throw new ConvexError({ message: "Unauthenticated!", code: 401 });

    const userId = identity.subject;

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("isArchived"), false))
      .order("desc")
      .collect();

    return documents;
  },
});

export const getById = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const documentId = ctx.db.normalizeId("documents", args.id);

    if (!documentId) return null;

    const document = await ctx.db.get(documentId);

    if (!document) return null;

    if (!document.isArchived && document.isPublished) return document;

    const identity = await ctx.auth.getUserIdentity();

    if (!identity)
      throw new ConvexError({ message: "Unauthenticated!", code: 401 });

    const userId = identity.subject;

    if (document.userId !== userId)
      throw new ConvexError({ message: "Forbidden!", code: 403 });

    return document;
  },
});

export const update = mutation({
  args: {
    id: v.id("documents"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    coverImage: v.optional(v.string()),
    icon: v.optional(v.string()),
    isPublished: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity)
      throw new ConvexError({ message: "Unauthenticated!", code: 401 });

    const userId = identity.subject;

    const document = await ctx.db.get(args.id);

    if (!document) throw new ConvexError({ message: "Not Found!", code: 404 });

    if (document.userId !== userId)
      throw new ConvexError({ message: "Forbidden!", code: 403 });

    const { id, ...rest } = args;

    await ctx.db.patch(id, rest);
  },
});

export const removeIcon = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity)
      throw new ConvexError({ message: "Unauthenticated!", code: 401 });

    const userId = identity.subject;

    const document = await ctx.db.get(args.id);

    if (!document) throw new ConvexError({ message: "Not Found!", code: 404 });

    if (document.userId !== userId)
      throw new ConvexError({ message: "Forbidden!", code: 403 });

    await ctx.db.patch(args.id, {
      icon: undefined,
    });
  },
});

export const removeCoverImage = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity)
      throw new ConvexError({ message: "Unauthenticated!", code: 401 });

    const userId = identity.subject;

    const document = await ctx.db.get(args.id);

    if (!document) throw new ConvexError({ message: "Not Found!", code: 404 });

    if (document.userId !== userId)
      throw new ConvexError({ message: "Forbidden!", code: 403 });

    await ctx.db.patch(args.id, {
      coverImage: undefined,
    });
  },
});
