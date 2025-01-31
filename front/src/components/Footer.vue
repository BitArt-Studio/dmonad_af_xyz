<template>
  <footer class="bg-gray-900 text-white flex items-center justify-center min-h-[50vh]">
    <div class="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div class="flex flex-col items-center">
        <img src="../assets/logo.svg" alt="logo" class="w-32 h-32 text-violet-600">
        <!-- <h2>Art Fractal</h2> -->
      </div>

      <p class="mx-auto mt-6 max-w-md text-center leading-relaxed text-gray-300">
        The night gives us black eyes
        <br/>
        but we use them to chase the light. 
      </p>

      <ul class="mt-12 flex flex-wrap justify-center gap-6 md:gap-8 lg:gap-12">
        <li>
          <a @click="scrollTo('home')" class="text-white transition hover:text-gray-300 cursor-pointer">Home</a>
        </li>
    
        <li>
          <a @click="scrollTo('mint')" class="text-white transition hover:text-gray-300 cursor-pointer">Mint</a>
        </li>
    
        <li>
          <a @click="scrollTo('art-show')" class="text-white transition hover:text-gray-300 cursor-pointer">Art</a>
        </li>
    
        <li>
          <a @click="scrollTo('faq')"class="text-white transition hover:text-gray-300" href="#"> FAQ </a>
        </li>
    
        <!-- <li>
          <a class="text-white transition hover:text-gray-300" href="#"> About </a>
        </li> -->
      </ul>
      <ul class="mt-12 flex justify-center gap-6 md:gap-8">
        <li>
          <a
            href="https://t.me/colormasksat"
            rel="noreferrer"
            target="_blank"
            class="text-white transition hover:text-gray-300"
          >
            <span class="sr-only">Telegram</span>
            <svg class="size-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.07-.18-.04-.26-.02-.11.02-1.93 1.23-5.46 3.62-.52.36-.99.53-1.41.52-.47-.01-1.36-.26-2.02-.48-.82-.27-1.47-.42-1.42-.89.03-.25.34-.51.93-.78 3.63-1.58 6.06-2.62 7.28-3.13 3.45-1.44 4.16-1.69 4.63-1.7.1 0 .32.02.47.12.12.08.19.2.22.33.02.12.01.24 0 .26z"
              />
            </svg>
          </a>
        </li>
    
        <li>
          <a
            href="https://x.com/artfractal_xyz"
            rel="noreferrer"
            target="_blank"
            class="text-white transition hover:text-gray-300"
          >
            <span class="sr-only">Twitter</span>
            <svg class="size-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"
              />
            </svg>
          </a>
        </li>
    
        <!-- <li>
          <a
            href="https://github.com/BitArt-Studio"
            rel="noreferrer"
            target="_blank"
            class="text-white transition hover:text-gray-300"
          >
            <span class="sr-only">GitHub</span>
            <svg class="size-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill-rule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clip-rule="evenodd"
              />
            </svg>
          </a>
        </li> -->
    
        <li>
          <a
            href="https://rkstone.xyz/"
            rel="noreferrer"
            target="_blank"
            class="text-white transition hover:text-gray-300"
          >
            <span class="sr-only">Dribbble</span>
            <svg class="size-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill-rule="evenodd"
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"
                clip-rule="evenodd"
              />
            </svg>
          </a>
        </li>
      </ul>

      <!-- 修改支持信息 -->
      <div class="mt-8 text-center text-sm">
        Supported By 
        <a 
          href="https://tailwindcss.com/" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="text-blue-600 hover:text-blue-500 transition-colors"
        >
          Tailwind
        </a>
        & 
        <a 
          href="https://explorer.monad-devnet.devnet101.com/" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="text-blue-600 hover:text-blue-500 transition-colors"
        >
          Monad
        </a> 

        
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
  methods: {
    scrollTo(elementId) {
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
}
</script>