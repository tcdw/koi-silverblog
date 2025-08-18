export interface GetPostsResponse {
    meta: Meta;
    post: PostSimple[];
}

export interface Meta {
    title: string;
    firstPostAt: number;
    latestPostAt: number;
    amount: number;
    id: string;
    locked: boolean;
    url: string;
}

export interface PostSimple {
    id: string;
    name: string;
    emailHashed: string;
    website: string;
    parent: string;
    parentPost?: PostSimple;
    content: string;
    hidden: boolean;
    byAdmin: boolean;
    createdAt: number;
    updatedAt: number;
    avatar: string;
}

export interface AddPostRequest {
    url: string;
    title: string;
    name: string;
    email: string;
    website?: string;
    content: string;
    receiveEmail: boolean;
    parent?: string;
    challengeResponse?: string;
}

export interface DisplayPost {
    parentPost: PostSimple;
    childPost: PostSimple[];
}
