import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import PageTransition from '@/components/ui/PageTransition';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Track, useTracksByType } from '@/services/tracks';

const Index = () => {
  return <PageTransition>
      <HeroSection />
      <AboutSection />
      <ProgramsTabsSection />
      <AllProgramsSection />
    </PageTransition>;
};

const HeroSection = () => {
  return <section className="bg-gray-50 py-12 md:py-20">
      <div className="container-content flex flex-col md:flex-row-reverse items-center gap-8">
        {/* Hero Image */}
        <div className="w-full md:w-1/2">
          <img alt="Graduate Student" className="w-full h-auto rounded-md shadow-md" src="/images/924f47fb-e129-4626-a66e-f060fcc6a1e6.png" />
        </div>
        
        {/* Text Content */}
        <div className="w-full md:w-1/2 text-right">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#002b4e] mb-4">
            كلية الدراسات العليا للبحوث<br />الإحصائية
          </h1>
          <p className="text-base md:text-lg text-gray-600 mb-6">
            مرحباً بكم في كلية الدراسات العليا للبحوث الإحصائية بجامعة القاهرة. نقدم برامج
            تعليمية متميزة تلبي احتياجات سوق العمل.
          </p>
          <Button size="lg" className="rounded-md bg-[#002b4e] hover:bg-[#00375f]">
            <Link to="/tracks">استكشف البرامج</Link>
          </Button>
        </div>
      </div>
    </section>;
};

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true
  });
  return <section ref={ref} className="py-16 bg-white">
      <div className="container-content">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={isInView ? {
        opacity: 1,
        y: 0
      } : {
        opacity: 0,
        y: 20
      }} transition={{
        duration: 0.5
      }} className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#002b4e] mb-6">عن الكلية</h2>
          <p className="text-gray-600 leading-relaxed text-base md:text-lg">
            تعد كلية الدراسات العليا للبحوث الإحصائية بجامعة القاهرة إحدى أبرز المؤسسات الاكاديمية في مجال الإحصاء في مصر والمنطقة العربية منذ تأسيسها عام 1962 تحت اسم "معهد الدراسات والبحوث الإحصائية" وحتى تغيير اسمها إلى "كلية الدراسات العليا للبحوث الإحصائية" عام 2019. تسعى الكلية إلى إعداد كوادر مؤهلة على المستوى الوطني في مجالات متعددة تشمل الإحصاء، علوم الحاسب، نظم وتكنولوجيا المعلومات، وبحوث إدارة العمليات.
          </p>
        </motion.div>
      </div>
    </section>;
};

const ProgramsTabsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [activeTab, setActiveTab] = useState<'professional' | 'academic'>('academic');
  
  const { data: tracks = [], isLoading } = useTracksByType(activeTab);

  const handleTabChange = (value: string) => {
    setActiveTab(value as 'professional' | 'academic');
  };

  return (
    <section ref={ref} className="py-16 bg-gray-50">
      <div className="container-content">
        <h2 className="text-3xl font-bold text-[#002b4e] text-center mb-8">البرامج</h2>
        
        <Tabs defaultValue="academic" className="w-full" onValueChange={handleTabChange}>
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8 justify-end" dir="rtl">
            <TabsTrigger value="academic">البرامج الأكاديمية</TabsTrigger>
            <TabsTrigger value="professional">البرامج المهنية</TabsTrigger>
          </TabsList>
          
          <TabsContent value="academic">
            <ProgramsContent tracks={tracks.slice(0, 3)} isLoading={isLoading} isInView={isInView} />
          </TabsContent>

          <TabsContent value="professional">
            <ProgramsContent tracks={tracks.slice(0, 3)} isLoading={isLoading} isInView={isInView} />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

const ProgramsContent = ({ tracks, isLoading, isInView }) => {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-4">جاري تحميل البرامج...</p>
      </div>
    );
  }

  if (tracks.length === 0) {
    return (
      <div className="text-center py-12">
        <p>لم يتم العثور على برامج</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {tracks.map((program, index) => (
        <motion.div 
          key={program.id} 
          initial={{ opacity: 0, y: 20 }} 
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }} 
          transition={{ duration: 0.5, delay: index * 0.1 }} 
          className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full"
        >
          <div className="aspect-video relative overflow-hidden">
            <img src={program.image} alt={program.title} className="w-full h-full object-cover" />
          </div>
          <div className="p-6 flex flex-col flex-grow">
            <h3 className="text-xl font-bold mb-3 text-right">{program.title}</h3>
            <p className="text-gray-600 mb-4 line-clamp-3 text-right flex-grow">{program.shortDescription}</p>
            <div className="text-right mt-auto">
              <Link to={`/tracks/${program.id}`} className="text-primary hover:text-primary/80 font-medium inline-flex items-center">
                تفاصيل
              </Link>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const AllProgramsSection = () => {
  return <section className="pb-16 pt-4 bg-gray-50">
      <div className="container-content text-center">
        <Button variant="outline" size="lg" className="border-[#002b4e] text-[#002b4e] hover:bg-[#002b4e] hover:text-white">
          <Link to="/tracks">جميع البرامج</Link>
        </Button>
      </div>
    </section>;
};

export default Index;
