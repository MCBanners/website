export const transparentPngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII='

function layout (display) {
  return {
    max_chars: 24,
    enable: true,
    font_size: 24,
    display,
    x: 10,
    y: 10,
    font_bold: false,
    font_face: 'Inter',
    text_align: 'Center'
  }
}

function logo () {
  return {
    size: 64,
    x: 10,
    y: 10
  }
}

function stars () {
  return {
    gap: 4,
    x: 10,
    y: 10
  }
}

export const constants = {
  templates: {
    DARK_GUNMETAL: 'Dark Gunmetal',
    MALACHITE_GREEN: 'Malachite Green',
    PURPLE_TAUPE: 'Purple Taupe',
    ORANGE_RADIAL: 'Orange Radial',
    LIGHT_MODE: 'Light Mode',
    VELVET: 'Velvet',
    MANGO: 'Mango',
    MOONLIGHT_PURPLE: 'Moonlight Purple',
    BLUE_RADIAL: 'Blue Radial',
    YELLOW: 'Yellow',
    BURNING_ORANGE: 'Burning Orange'
  },
  text_alignments: {
    CENTER: 'Center',
    LEFT: 'Left',
    RIGHT: 'Right'
  },
  fonts: {
    ROBOTO: 'Roboto',
    POPPINS: 'Poppins',
    SOURCE_SANS_PRO: 'Source Sans Pro',
    INTER: 'Inter',
    MONTSERRAT: 'Montserrat',
    JETBRAINS_MONO: 'JetBrains Mono',
    OPEN_SANS: 'Open Sans',
    RALEWAY: 'Raleway'
  }
}

export const defaults = {
  resource: {
    author_name: layout('Example Author'),
    reviews: layout('128 Reviews'),
    downloads: layout('42,000 Downloads'),
    background: { template: 'Moonlight Purple' },
    price: layout('Free'),
    logo: logo(),
    stars: stars(),
    resource_name: layout('Example Resource'),
    updated: layout('Updated today')
  },
  author: {
    author_name: layout('Example Author'),
    reviews: layout('128 Reviews'),
    downloads: layout('42,000 Downloads'),
    background: { template: 'Moonlight Purple' },
    logo: logo(),
    resource_count: layout('12 Resources'),
    likes: layout('512 Likes')
  },
  server: {
    server_name: layout('Example Server'),
    motd: layout('A Minecraft server'),
    background: { template: 'Moonlight Purple' },
    players: layout('12 / 100'),
    logo: logo(),
    version: layout('1.21')
  }
}
