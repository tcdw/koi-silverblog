export interface ResponseRoot<T> {
    code: number
    data: T
}

export interface PostMeta {
    Excerpt: string
    Name: string
    Time: number
    Title: string
    UUID: string
}
