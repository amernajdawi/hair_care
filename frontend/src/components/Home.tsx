'use client'
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Accordion,
  AccordionContainer,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
  AccordionWrapper,
} from './accordion'
import { Plus } from 'lucide-react'

const TimelineContent: React.FC<{
  children: React.ReactNode;
  animationNum: number;
  timelineRef: React.RefObject<HTMLDivElement>;
}> = ({ children, animationNum, timelineRef }) => {
  const sequenceVariants = {
    visible: (i: number) => ({
      filter: 'blur(0px)',
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.3,
        duration: 0.5,
      },
    }),
    hidden: {
      filter: 'blur(20px)',
      y: 50,
      opacity: 0,
    },
  };
  const isInView = useInView(timelineRef, {
    once: false,
    margin: "-100px",
  });
  return (
    <motion.div
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      custom={animationNum}
      variants={sequenceVariants}
    >
      {children}
    </motion.div>
  );
};

interface FAQItem {
  question: string;
  answer: React.ReactNode | null;
}

const FAQSection: React.FC = () => {
  const faqRef = useRef<HTMLDivElement>(null);
  const faqItems: FAQItem[] = [
    {
      question: "How to Figure Out Your Hair Type💭",
      answer: (
        <Accordion defaultValue={[]} multiple>
          {["👩Straight", "👩‍🦰Wavy", "👩‍🦱Curly", "🧑‍🦱Coily"].map((type, index) => (
            <AccordionItem key={index} value={`hair-type-${index}`}>
              <AccordionHeader>{type}</AccordionHeader>
              <AccordionPanel>
                <ul className="list-disc pl-5 space-y-2">
                  {type === "👩Straight" && (
                    <>
                      <li>1A: Very straight, fine, and smooth.</li>
                      <li>1B: Straight with more volume and texture.</li>
                      <li>1C: Straight but coarse with some body.</li>
                    </>
                  )}
                  {type === "👩‍🦰Wavy" && (
                    <>
                      <li>2A: Loose, beachy waves, fine texture.</li>
                      <li>2B: Medium-thick waves with more definition.</li>
                      <li>2C: Thick, defined waves, prone to frizz.</li>
                    </>
                  )}
                  {type === "👩‍🦱Curly" && (
                    <>
                      <li>3A: Loose, large, springy curls.</li>
                      <li>3B: Tighter, voluminous curls.</li>
                      <li>3C: Very tight corkscrew curls, dense texture.</li>
                    </>
                  )}
                  {type === "🧑‍🦱Coily" && (
                    <>
                      <li>4A: Soft, defined S-shaped curls.</li>
                      <li>4B: Z-shaped curls, less defined, prone to frizz.</li>
                      <li>4C: Very tight curls or kinks with little definition and high shrinkage.</li>
                    </>
                  )}
                </ul>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      )
    },
    {
      question: "How to Test Your Hair Porosity💭",
      answer: (
        <div>
          <p className="mb-4">Take a clean strand of hair and drop it into a glass of water.</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>💧Floats:</strong> Low porosity - Your hair doesn't absorb moisture easily.</li>
            <li><strong>💧Sinks halfway:</strong> Medium/normal porosity - Your hair absorbs moisture well.</li>
            <li><strong>💧Sinks to the bottom:</strong> High porosity - Your hair absorbs moisture quickly but may also lose it just as fast.</li>
          </ul>
        </div>
      )
    },
    {
      question: "How to Determine Your Scalp Type💭",
      answer: (
        <ul className="space-y-2 list-none">
          <li>🌱<strong>Normal Scalp:</strong> Balanced, neither too dry nor too oily.</li>
          <li>🌱<strong>Dry Scalp:</strong> Flaky, itchy, tight, and can feel uncomfortable.</li>
          <li>🌱<strong>Oily Scalp:</strong> Greasy appearance, may feel heavy or limp.</li>
          <li>🌱<strong>Sensitive Scalp:</strong> Prone to irritation, redness, or reactions to products.</li>
          <li>🌱<strong>Dandruff-Prone Scalp:</strong> Flaky skin with visible dandruff, may be itchy.</li>
          <li>🌱<strong>Combination Scalp:</strong> Oily in some areas and dry or normal in others.</li>
        </ul>
      )
    },
    {
      question: "Other Key Hair Characteristics to Consider💭",
      answer: (
        <ul className="space-y-2 list-none">
          <li>✍️<strong>Colour:</strong> Natural or dyed.</li>
          <li>✍️<strong>Hair density and fall:</strong> The amount of hair on the scalp and the rate of shedding.</li>
          <li>✍️<strong>Hair health:</strong> Elasticity (ability to stretch) and damage (split ends or breakage).</li>
        </ul>
      )
    },
  ];

  const platformItems: FAQItem[] = [
    {
      question: "What to Discover on the Hair Type Page💭",
      answer: (
        <div>
          <p className="mb-4">Here is where your journey begins!🚀</p>
          <ul className="space-y-2 list-none mb-4">
            <li>👧 <strong>Hair Type:</strong> Select which hair type you're gifted with from the 12 unique options!</li>
            <li>💧 <strong>Hair Porosity:</strong> Pick your hair porosity from the 3 categories, often overlooked but a must for flawless hair care!</li>
            <li>🌱 <strong>Scalp Type:</strong> Choose your scalp type from the six varieties—as your scalp is the soil that nourishes your hair!</li>
            <li>🎨 <strong>Hair Color:</strong> Let us know if your beautiful hair is dyed, as it impacts how products work!</li>
          </ul>
          <p className="mb-4">Now you're good to go! 🫡</p>
          <p className="mb-4">
            Get ready for personalized advice and recommendations tailored just for you and as unique as you are! 
            Whether you're looking for insights on oils, ingredients, products, the right quantities, frequency, etc., 
            we're here to provide everything you need to know to achieve your hair goals! ❤️
          </p>
          <p className="font-bold text-red-500">
            ⚠️ You can't access the following pages without selecting all the items here.
          </p>
        </div>
      )
    },
    {
      question: "What information can the chatbot provide?💭",
      answer: (
        <div>
          <p className="mb-4">🔮Our chatbot is here to provide everything you need and answer any questions you may have!</p>
          <p className="mb-4">🔮Not only that, but it also tailors its responses based on your selections from the first page, ensuring that the answers you receive are personalized just for you.</p>
          <p className="mb-4">🔮Whether you're dealing with hair fall, dandruff, split ends, breakage, slow growth, or any other concern, feel free to ask! We'll help you while focusing on your unique hair type.</p>
        </div>
      )
    },
    {
      question: "What Does the Product Analysis page Do?💭",
      answer: (
        <div>
          <p className="mb-4">🕵️‍♂️Our analysis page lets you choose products like an expert!</p>
          <p className="mb-4">🕵️‍♂️Simply snap a picture of the ingredients section of any product you want and upload it here. We will thoroughly scan it for you.</p>
          <p className="mb-4">🕵️‍♂️You'll receive an overview of each ingredient in the product, along with an overall assessment of whether it's suitable for your unique hair based on the characteristics you selected on the first page.</p>
        </div>
      )
    }
  ];

  return (
    <section ref={faqRef} className="space-y-8">
      <AccordionContainer className="md:grid-cols-2 grid-cols-1 gap-8">
        <AccordionWrapper>
          <Accordion defaultValue={[]} multiple>
            {faqItems.map((item: FAQItem, index: number) => (
              <TimelineContent key={index} animationNum={index} timelineRef={faqRef}>
                <AccordionItem value={`item-${index}`}>
                  <AccordionHeader>
                    {item.question}
                  </AccordionHeader>
                  <AccordionPanel>
                    {typeof item.answer === 'string' ? (
                      <div className="whitespace-pre-line">{item.answer}</div>
                    ) : (
                      item.answer
                    )}
                  </AccordionPanel>
                </AccordionItem>
              </TimelineContent>
            ))}
          </Accordion>
        </AccordionWrapper>
      </AccordionContainer>
      
      <h2 className="text-3xl font-bold text-center text-[#8B7E7E] mt-16 mb-8" style={{textShadow: '1px 1px 2px rgba(255, 255, 255, 0.4)'}}>
        ✨️ Delve into Our Platform✨️
      </h2>

      <AccordionContainer className="md:grid-cols-2 grid-cols-1 gap-8">
        <AccordionWrapper>
          <Accordion defaultValue={[]} multiple>
            {platformItems.map((item: FAQItem, index: number) => (
              <TimelineContent key={index} animationNum={index} timelineRef={faqRef}>
                <AccordionItem value={`platform-item-${index}`}>
                  <AccordionHeader>
                    {item.question}
                  </AccordionHeader>
                  <AccordionPanel>
                    {typeof item.answer === 'string' ? (
                      <div className="whitespace-pre-line">{item.answer}</div>
                    ) : (
                      item.answer
                    )}
                  </AccordionPanel>
                </AccordionItem>
              </TimelineContent>
            ))}
          </Accordion>
        </AccordionWrapper>
      </AccordionContainer>
    </section>
  );
};

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-[rgba(247,216,216,0.7)] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-[#8B7E7E] mb-4" style={{textShadow: '1px 1px 2px rgba(255, 255, 255, 0.5)'}}>
          Welcome to Your Hair Care Journey.
          Let's Get Started!
        </h1>
        <h2 className="text-2xl font-semibold text-center text-[#A69999] mb-12" style={{textShadow: '1px 1px 2px rgba(255, 255, 255, 0.3)'}}>
          ✨Get to Know Your Unique Hair✨
        </h2>
        <FAQSection />
      </div>
    </div>
  );
};

export default Home;
