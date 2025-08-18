import type { PostSimple } from "../types/comment";

export interface DisplayPost {
    parentPost: PostSimple;
    childPost: PostSimple[];
}

export function buildPostTree(posts: PostSimple[]): DisplayPost[] {
    const postParent: DisplayPost[] = [];
    const postParentMap = new Map<string, DisplayPost>();
    const postChild: PostSimple[] = [];

    // Build comment object key-value pairs (key is ID)
    const postMap = new Map<string, PostSimple>();
    posts.forEach(post => {
        postMap.set(post.id, post);
    });

    // Separate comments with parent and without parent into two arrays, and set references for comments with parent
    posts.forEach(post => {
        if (post.parent) {
            post.parentPost = postMap.get(post.parent);
            postChild.push(post);
        } else {
            // Keep reference consistent
            const obj = {
                parentPost: post,
                childPost: [],
            };
            postParent.push(obj);
            postParentMap.set(post.id, obj);
        }
    });

    // Find corresponding parent comment for child comments and append to display object array
    postChild.forEach(post => {
        let parent = post;
        while (parent.parentPost) {
            parent = parent.parentPost;
        }
        const target = postParentMap.get(parent.id);
        if (!target) {
            console.warn(`Parent comment ${parent.id} specified by child comment does not exist`);
            return;
        }
        target.childPost.push(post);
    });

    // Sort parent comments in descending order (newest first)
    postParent.sort((a, b) => {
        if (a.parentPost.createdAt > b.parentPost.createdAt) {
            return -1;
        }
        if (a.parentPost.createdAt < b.parentPost.createdAt) {
            return 1;
        }
        return 0;
    });

    // Sort child comments in ascending order (oldest first)
    postParent.forEach(parent => {
        parent.childPost.sort((a, b) => {
            if (a.createdAt > b.createdAt) {
                return 1;
            }
            if (a.createdAt < b.createdAt) {
                return -1;
            }
            return 0;
        });
    });

    return postParent;
}

export function applyPostToTree(post: PostSimple, tree: DisplayPost[]): DisplayPost[] {
    if (!post.parent) {
        tree.splice(0, 0, {
            parentPost: post,
            childPost: [],
        });
        return tree;
    }

    for (let i = 0; i < tree.length; i++) {
        const parent = tree[i];
        if (parent.parentPost.id === post.parent) {
            post.parentPost = parent.parentPost;
            parent.childPost.push(post);
            return tree;
        }
        for (let j = 0; j < parent.childPost.length; j++) {
            const child = parent.childPost[j];
            if (child.id === post.parent) {
                post.parentPost = child;
                parent.childPost.push(post);
                return tree;
            }
        }
    }
    return tree;
}
