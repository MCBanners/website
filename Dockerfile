# Prepare environment
FROM alpine:3.13
RUN apk add yarn git

# Download source code
RUN git clone https://github.com/MCBanners/website.git /app
WORKDIR /app

# Build the source into a binary
RUN yarn install
RUN yarn build

# Package the application
CMD /bin/sh -c "yarn start"