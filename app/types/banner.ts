export type Layout = {
    max_chars: number;
    enable: boolean;
    font_size: number;
    display: string;
    x: number;
    y: number;
    font_bold: boolean;
    font_face: string;
    text_align: string;
}

export type Background = {
    template: string;
}

export type Logo = {
    size: number;
    x: number;
    y: number;
}

export type Stars = {
    gap: number;
    x: number;
    y: number;
}

export type Resource = {
    author_name: Layout;
    reviews: Layout;
    downloads: Layout;
    background: Background;
    price: Layout;
    logo: Logo;
    stars: Stars;
    resource_name: Layout;
    updated: Layout;
}

export type Author = {
    author_name: Layout;
    reviews: Layout;
    downloads: Layout;
    background: Background;
    logo: Logo;
    resource_count: Layout;
    likes: Layout;
}

export type Server = {
    server_name: Layout;
    motd: Layout;
    background: Background;
    players: Layout;
    logo: Logo;
    version: Layout;
}
