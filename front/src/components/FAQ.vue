<template>
  <div class="relative bg-gray-900 min-h-screen pt-[60px] pb-[360px] overflow-y-auto">
    <!-- <div class="absolute top-0 w-full flex justify-center pt-4">
      <Navbar />
    </div> -->
    <div class="max-w-4xl w-full mx-auto px-4 py-8">
      <h2 class="text-3xl font-bold text-center text-white mb-8">Frequently Asked Questions</h2>
      <div class="space-y-4">
        <details
          v-for="(item, index) in faqItems"
          :key="index"
          class="overflow-hidden rounded border border-gray-700 [&_summary::-webkit-details-marker]:hidden"
        >
          <summary
            class="flex cursor-pointer items-center justify-between gap-2 bg-gray-800 p-4 text-white transition"
          >
            <span class="text-sm font-medium">{{ item.question }}</span>
            <span class="transition group-open:-rotate-180">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-4"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </span>
          </summary>
          <div class="border-t border-gray-700 bg-gray-800 p-4">
            <p class="text-sm text-gray-300" v-html="renderMath(item.answer)"></p>
          </div>
        </details>
      </div>
      <div class="absolute inset-x-0 bottom-0 flex justify-center pb-[80px]">
        <Navbar />
      </div>
      <!-- <span class="flex items-center pt-[40px]">
        <span class="h-px flex-1 bg-gray-700"></span>
        <span class="pl-6 text-gray-400">End of FAQ</span>
      </span> -->
    </div>
  </div>
</template>

<script setup>
import Navbar from './Navbar.vue';

const faqItems = [
    {
      question: "About Maya Fresco",
      answer: ` <p>
                This collection of digital algorithmic art pieces, themed around Maya Frasco, showcases the depth and mystery of Mayan culture 
                through the use of highly designed and artistic basic geometric shapes. Each artwork is a modern interpretation of Mayan murals, 
                seamlessly blending ancient symbols with modern digital technology. Here, you will witness the interplay of clean lines 
                and intricate patterns, creating a unique visual language that not only conveys the wisdom of the Mayan civilization 
                but also reflects the innovative spirit of contemporary art. Each piece is an exploration of the Mayan cosmology, 
                a profound contemplation of time, space, and existence.
                </p>`
    },
    {
      question: "Introduction to Algorithm Generative Art",
      answer: `<p>Besides playing an important role in science and industry, algorithms, as a form of intellectual tools represented by code, are also an important technical method in digital art.</p>
              <br/> 
              <p>Just like oil painting techniques in oil painting and ink techniques in Chinese painting, algorithmic programming is a skill that digital artists need years of training to master for artistic creation.</p>
              <br/>

              <p>Generative art, also known as algorithmic art or code art: After an artist designs and creates an algorithm or code, when the computer executes this code,the algorithm creates and generates a digital artwork displayed on the screen in real-time according to specified rules and a certain degree of randomness.</p>
              <br/>
              <p>Due to different random seed each time, collectors can also interact with the program to participate in the creation and collection of the artwork.</p>`
    },
    {
      question: "Our Perspective on Art",
      answer: `<p>Art has always been a brilliant jewel in the spiritual world of humanity. Science, philosophy, and art together fulfill humanity's spiritual pursuit of truth, goodness, and beauty.</p>
              <br/> 
              <p>Artists use their paintings or other techniques to express their spiritual selves and the appearance of the world, showing people the material and spiritual worlds that can be inherited. From the cave paintings created with stone knives in ancient times, to Da Vinci's perfect three-dimensional perspective paintings through mathematical calculations, to the Impressionist works of Monet and Cézanne completed with light and shadow theory, to Picasso's depiction of the cruelty of war through cubist and abstract techniques, and to modern times where Wu Guanzhong, Wu Changshuo, and Huang Binhong used ink and wash to complete Chinese abstract art works, all these record and express their spiritual sustenance and feelings towards the world and themselves at the time through art and aesthetics.</p>
              <br/>

              <p>Today, since Apple ushered in the era of personal computers, our world has gradually entered the digital age. From Yahoo and Google search engines to social networks like Facebook and Tencent, from Douyin to TikTok, and from Tesla to BYD, we are living in a digitally constructed world. In 2009, the Bitcoin network, which combines asymmetric encryption, distributed processing, consensus algorithms, and economic principles, emerged, providing a haven for assets in the digital world. Since then, digital artworks have gained value anchoring in this digital era. Artists can now put their works on the blockchain for copyright, finally offering a perfect solution for the ownership of digital works. In 2021, art pieces issued based on Ethereum smart contracts were auctioned multiple times at top auction houses like Sotheby's and Christie's, with some pieces reaching prices close to those of traditional art masters. After years of development, digital artworks have finally gained a foothold. Digital artworks, as contemporary art of the digital new world, will surely gain recognition in value with the maturity of blockchain technology and the popularization of digital currencies.</p>
              <br/>
              <p>This is our worldview on digital art.</p>`
    },
    {
      question: "What is Monad?",
      answer: `<p>Monad is a cutting-edge Layer 1 blockchain that leverages the Ethereum Virtual Machine (EVM)—the software that powers the Ethereum blockchain, and all networks built on top of it.</p>
              <br/> 
              <p>This approach enables Monad to support all existing Ethereum smart contracts and applications without any need for modification. This compatibility is crucial for encouraging adoption among Ethereum developers, who can migrate their applications to Monad with ease and without facing interoperability issues.</p>
              <br/>

              <p>Having said that, Monad is attempting to build a more streamlined version of the EVM from the ground up. The goal is to address the EVM's shortcomings, which have led to scalability and performance issues on the Ethereum blockchain, as well as relatively steep transaction costs.</p>
              <br/>`
    }
  // ... 其他FAQ项目 ...
];

const renderMath = (text) => {
  return text.replace(/\$\$(.*?)\$\$/g, (match, formula) => {
    try {
      return katex.renderToString(formula, { displayMode: true });
    } catch (error) {
      console.error('KaTeX渲染错误:', error);
      return match;
    }
  });
};
</script>