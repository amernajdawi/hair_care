import React from 'react';

const styles = {
  container: {
    padding: '20px',
    backgroundImage: 'url("/images/wallpaper.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    borderRadius: '8px',
    boxShadow: '0 5px 15px rgba(247, 216, 216, 0.4)',
    position: 'relative',
    zIndex: 1,
    textAlign: 'right', // Ensure all text is right-aligned
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 240, 240, 0.7)',
    zIndex: -1,
  },
  heading: {
    fontSize: '24px',
    marginBottom: '16px',
    color: '#8B7E7E',
    textShadow: '1px 1px 2px rgba(255, 255, 255, 0.5)',
  },
  paragraph: {
    marginBottom: '16px',
    lineHeight: '1.6',
    color: '#8B7E7E',
  },
  list: {
    listStyleType: 'none',
    padding: 0,
  },
  listItem: {
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row-reverse', // Reverse the direction for Arabic
  },
  icon: {
    marginLeft: '10px', // Change marginRight to marginLeft
    color: '#F7D8D8',
    textShadow: '0 0 3px rgba(232, 180, 184, 0.5)',
  },
  bold: {
    fontWeight: 'bold',
    color: '#8B7E7E',
    textShadow: '0 0 1px rgba(0, 0, 0, 0.3)',
  },
};

function AboutAr() {
  return (
    <div style={styles.container}>
      <div style={styles.overlay}></div>
      <h2 style={styles.heading}>مرحبًا بك في رحلة العناية بشعرك</h2>
      <p style={styles.paragraph}>
        اكتشف المزيج المثالي بين العلم والجمال مع رفيقنا الذكي للعناية بالشعر المدعوم بالذكاء الاصطناعي.
      </p>
      <h3 style={styles.heading}>أطلق العنان لإمكانات شعرك:</h3>
      <ul style={styles.list}>
        <li style={styles.listItem}>
          <span style={styles.icon}>🔬</span>
          <span><span style={styles.bold}>تحليل الشعر الذكي:</span> اكتشف نوع شعرك الفريد واحصل على اقتراحات عناية مخصصة.</span>
        </li>
        <li style={styles.listItem}>
          <span style={styles.icon}>🤖</span>
          <span><span style={styles.bold}>خبير شعر ذكي متاح 24/7:</span> تحدث مع مساعدنا الذكي الودود للحصول على نصائح فورية ومخصصة للعناية بالشعر.</span>
        </li>
        <li style={styles.listItem}>
          <span style={styles.icon}>📸</span>
          <span><span style={styles.bold}>فحص توافق المنتجات:</span> التقط صورة لأي منتج للشعر للحصول على تحليل مدعوم بالذكاء الاصطناعي لمدى ملاءمته لشعرك.</span>
        </li>
      </ul>
      <p style={styles.paragraph}>
        من معالجة تحديات الشعر المستمرة إلى اكتشاف المنتج المثالي لك، منصتنا الذكية هي شريكك في تحقيق شعر صحي ورائع. نحن نجمع بين تكنولوجيا الذكاء الاصطناعي المتطورة ومعرفة خبراء العناية بالشعر لتزويدك بروتين مصمم خصيصًا لشعرك.
      </p>
      <p style={styles.paragraph}>
        قل وداعًا للحلول ذات المقاس الواحد الذي يناسب الجميع ومرحبًا بالعناية بالشعر الفريدة مثلك تمامًا. سواء كنت مبتدئًا في العناية بالشعر أو خبيرًا متمرسًا، سنساعدك على الوقوع في حب شعرك من جديد.
      </p>
      <p style={styles.bold}>
        هل أنت مستعد لبدء مغامرة العناية بالشعر المخصصة لك؟ ابدأ بتحديد نوع شعرك في علامة التبويب نوع الشعر!
      </p>
    </div>
  );
}

export default AboutAr;