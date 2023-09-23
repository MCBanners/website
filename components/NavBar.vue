<template>
  <div class="w-full">
    <nav class>
      <div class="container mx-auto px-4 sm:px-6">
        <div class="flex h-24 items-center">
          <div class="flex w-full justify-evenly space-y-4">
            <div class="flex items-center text-gray-600 dark:text-gray-300">
              <NuxtLink to="/">
                <h5 class="font-bold mb-0 ml-4">
                  Home
                </h5>
              </NuxtLink>
              <NuxtLink to="/resources">
                <h5 class="font-bold mb-0 ml-4">
                  Resources
                </h5>
              </NuxtLink>
              <NuxtLink to="/authors">
                <h5 class="font-bold mb-0 ml-4">
                  Authors
                </h5>
              </NuxtLink>
              <NuxtLink to="/servers">
                <h5 class="font-bold mb-0 ml-4">
                  Servers
                </h5>
              </NuxtLink>
            </div>
          </div>
          <ColorModeButton />
          <GitHubButton />
        </div>
      </div>
    </nav>
  </div>
</template>
