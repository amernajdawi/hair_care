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
      question: "كيف تحدد نوع شعرك؟💭",
      answer: (
        <Accordion defaultValue={[]} multiple>
          {["👩مستقيم", "👩‍🦰متموج", "👩‍🦱مجعد", "🧑‍🦱شديد التجعد"].map((type, index) => (
            <AccordionItem key={index} value={`hair-type-${index}`}>
              <AccordionHeader>{type}</AccordionHeader>
              <AccordionPanel>
                <ul className="list-disc pr-5 space-y-2">
                  {type === "👩مستقيم" && (
                    <>
                      <li>1A: مستقيم جدًا، ناعم ورقيق.</li>
                      <li>1B: مستقيم مع المزيد من الحجم والملمس.</li>
                      <li>1C: مستقيم ولكن خشن مع بعض الكثافة.</li>
                    </>
                  )}
                  {type === "👩‍🦰متموج" && (
                    <>
                      <li>2A: تموجات فضفاضة كشاطئ البحر، ملمس ناعم.</li>
                      <li>2B: تموجات متوسطة السمك مع تعريف أكثر.</li>
                      <li>2C: تموجات سميكة ومعرفة، عرضة للتجعد.</li>
                    </>
                  )}
                  {type === "👩‍🦱مجعد" && (
                    <>
                      <li>3A: تجاعيد فضفاضة، كبيرة ومرنة.</li>
                      <li>3B: تجاعيد أكثر ضيقًا وحجمًا.</li>
                      <li>3C: تجاعيد ضيقة جدًا على شكل سلك الهاتف، ملمس كثيف.</li>
                    </>
                  )}
                  {type === "🧑‍🦱شديد التجعد" && (
                    <>
                      <li>4A: تجاعيد ناعمة على شكل حرف S.</li>
                      <li>4B: تجاعيد على شكل حرف Z، أقل تعريفًا، عرضة للتجعد.</li>
                      <li>4C: تجاعيد ضيقة جدًا أو التواءات مع تعريف قليل وانكماش عالي.</li>
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
      question: "كيف تختبر مسامية شعرك؟💭",
      answer: (
        <div>
          <p className="mb-4">خذي خصلة نظيفة من الشعر وأسقطيها في كأس من الماء.</p>
          <ul className="list-disc pr-5 space-y-2">
            <li><strong>💧يطفو:</strong> مسامية منخفضة - شعرك لا يمتص الرطوبة بسهولة.</li>
            <li><strong>💧يغرق جزئيًا:</strong> مسامية متوسطة/عادية - شعرك يمتص الرطوبة بشكل جيد.</li>
            <li><strong>💧يغرق إلى القاع:</strong> مسامية عالية - شعرك يمتص الرطوبة بسرعة ولكن قد يفقدها بنفس السرعة.</li>
          </ul>
        </div>
      )
    },
    {
      question: "كيف تحدد نوع فروة رأسك؟💭",
      answer: (
        <ul className="space-y-2 list-none">
          <li>🌱<strong>فروة رأس عادية:</strong> متوازنة، ليست جافة جدًا ولا دهنية جدًا.</li>
          <li>🌱<strong>فروة رأس جافة:</strong> متقشرة، حكة، مشدودة، ويمكن أن تشعر بعدم الراحة.</li>
          <li>🌱<strong>فروة رأس دهنية:</strong> مظهر دهني، قد تشعر بالثقل أو الترهل.</li>
          <li>🌱<strong>فروة رأس حساسة:</strong> عرضة للتهيج، الاحمرار، أو ردود الفعل تجاه المنتجات.</li>
          <li>🌱<strong>فروة رأس عرضة للقشرة:</strong> جلد متقشر مع قشرة واضحة، قد تكون مصحوبة بحكة.</li>
          <li>🌱<strong>فروة رأس مختلطة:</strong> دهنية في بعض المناطق وجافة أو عادية في مناطق أخرى.</li>
        </ul>
      )
    },
    {
      question: "خصائص الشعر الرئيسية الأخرى التي يجب مراعاتها💭",
      answer: (
        <ul className="space-y-2 list-none">
          <li>✍️<strong>اللون:</strong> طبيعي أو مصبوغ.</li>
          <li>✍️<strong>كثافة الشعر وتساقطه:</strong> كمية الشعر على فروة الرأس ومعدل تساقطه.</li>
          <li>✍️<strong>صحة الشعر:</strong> المرونة (القدرة على التمدد) والتلف (تقصف الأطراف أو التكسر).</li>
        </ul>
      )
    },
  ];

  const platformItems: FAQItem[] = [
    {
      question: "ماذا ستكتشف في صفحة نوع الشعر؟💭",
      answer: (
        <div>
          <p className="mb-4">هنا تبدأ رحلتك!🚀</p>
          <ul className="space-y-2 list-none mb-4">
            <li>👧 <strong>نوع الشعر:</strong> اختاري نوع شعرك من بين 12 خيارًا فريدًا!</li>
            <li>💧 <strong>مسامية الشعر:</strong> اختاري مسامية شعرك من الفئات الثلاث، غالبًا ما يتم تجاهلها ولكنها ضرورية للعناية المثالية بالشعر!</li>
            <li>🌱 <strong>نوع فروة الرأس:</strong> اختاري نوع فروة رأسك من الأنواع الستة - فروة الرأس هي التربة التي تغذي شعرك!</li>
            <li>🎨 <strong>لون الشعر:</strong> أخبرينا إذا كان شعرك الجميل مصبوغًا، حيث يؤثر ذلك على كيفية عمل المنتجات!</li>
          </ul>
          <p className="mb-4">الآن أنت جاهزة للانطلاق! 🫡</p>
          <p className="mb-4">
            استعدي للحصول على نصائح وتوصيات مخصصة لك تمامًا وفريدة مثلك! 
            سواء كنت تبحثين عن رؤى حول الزيوت، المكونات، المنتجات، الكميات المناسبة، التكرار، إلخ، 
            نحن هنا لنقدم لك كل ما تحتاجين لمعرفته لتحقيق أهداف شعرك! ❤️
          </p>
          <p className="font-bold text-red-500">
            ⚠️ لا يمكنك الوصول إلى الصفحات التالية دون اختيار جميع العناصر هنا.
          </p>
        </div>
      )
    },
    {
      question: "ما هي المعلومات التي يمكن أن يقدمها الروبوت المحادث؟💭",
      answer: (
        <div>
          <p className="mb-4">🔮روبوتنا المحادث هنا لتقديم كل ما تحتاجين إليه والإجابة على أي أسئلة قد تكون لديك!</p>
          <p className="mb-4">🔮ليس هذا فحسب، بل إنه يخصص إجاباته بناءً على اختياراتك من الصفحة الأولى، مما يضمن أن الإجابات التي تتلقينها مخصصة لك تمامًا.</p>
          <p className="mb-4">🔮سواء كنت تتعاملين مع تساقط الشعر، القشرة، تقصف الأطراف، التكسر، بطء النمو، أو أي مشكلة أخرى، لا تترددي في السؤال! سنساعدك مع التركيز على نوع شعرك الفريد.</p>
        </div>
      )
    },
    {
      question: "ماذا تفعل صفحة تحليل المنتجات؟💭",
      answer: (
        <div>
          <p className="mb-4">🕵️‍♂️صفحة التحليل لدينا تتيح لك اختيار المنتجات مثل الخبير!</p>
          <p className="mb-4">🕵️‍♂️ما عليك سوى التقاط صورة لقسم المكونات لأي منتج تريدين وتحميلها هنا. سنقوم بفحصها بدقة من أجلك.</p>
          <p className="mb-4">🕵️‍♂️ستحصلين على نظرة عامة لكل مكون في المنتج، إلى جانب تقييم شامل لما إذا كان مناسبًا لشعرك الفريد بناءً على الخصائص التي اخترتها في الصفحة الأولى.</p>
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
        ✨️ تعمق في منصتنا✨️
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

const HomeAr: React.FC = () => {
  return (
    <div className="min-h-screen bg-[rgba(247,216,216,0.7)] py-16 px-4 sm:px-6 lg:px-8" style={{ direction: 'rtl' }}>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-[#8B7E7E] mb-4" style={{textShadow: '1px 1px 2px rgba(255, 255, 255, 0.5)'}}>
          مرحبًا بك في رحلة العناية بشعرك.
          لنبدأ!
        </h1>
        <h2 className="text-2xl font-semibold text-center text-[#A69999] mb-12" style={{textShadow: '1px 1px 2px rgba(255, 255, 255, 0.3)'}}>
          ✨تعرف على شعرك الفريد✨
        </h2>
        <FAQSection />
      </div>
    </div>
  );
};

export default HomeAr;