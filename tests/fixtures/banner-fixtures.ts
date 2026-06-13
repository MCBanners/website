import type { Author, Resource, Server } from '~/types/banner'

function layout(display: string) {
  return {
    max_chars: 24,
    enable: true,
    font_size: 24,
    display,
    x: 10,
    y: 10,
    font_bold: false,
    font_face: 'Inter',
    text_align: 'Center',
  }
}

function logo() {
  return {
    size: 64,
    x: 10,
    y: 10,
  }
}

function stars() {
  return {
    gap: 4,
    x: 10,
    y: 10,
  }
}

export const fixtureConstants = {
  templates: {
    MOONLIGHT_PURPLE: 'Moonlight Purple',
    DARK_GUNMETAL: 'Dark Gunmetal',
  },
  text_alignments: {
    CENTER: 'Center',
    LEFT: 'Left',
    RIGHT: 'Right',
  },
  fonts: {
    INTER: 'Inter',
    ROBOTO: 'Roboto',
  },
}

export const fixtureResource: Resource = {
  author_name: layout('Example Author'),
  reviews: layout('128 Reviews'),
  downloads: layout('42,000 Downloads'),
  background: { template: 'Moonlight Purple' },
  price: layout('Free'),
  logo: logo(),
  stars: stars(),
  resource_name: layout('Example Resource'),
  updated: layout('Updated today'),
}

export const fixtureAuthor: Author = {
  author_name: layout('Example Author'),
  reviews: layout('128 Reviews'),
  downloads: layout('42,000 Downloads'),
  background: { template: 'Moonlight Purple' },
  logo: logo(),
  resource_count: layout('12 Resources'),
  likes: layout('512 Likes'),
}

export const fixtureServer: Server = {
  server_name: layout('Example Server'),
  motd: layout('A Minecraft server'),
  background: { template: 'Moonlight Purple' },
  players: layout('12 / 100'),
  logo: logo(),
  version: layout('1.21'),
}

export const fixtureDefaults = {
  resource: fixtureResource,
  author: fixtureAuthor,
  server: fixtureServer,
}
