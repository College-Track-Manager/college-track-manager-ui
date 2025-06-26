import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import PageTransition from '@/components/ui/PageTransition';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from 'axios';
import { API_BASE_URL } from '@/services/config';
import { Track, TrackType } from '@/services/tracks';

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

const AcademicPrograms = ({ isInView }: { isInView: boolean }) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAcademicTracks = async () => {
      console.log('AcademicPrograms: Fetching tracks. API_BASE_URL:', API_BASE_URL);
      setIsLoading(true);
      setError(null); // Reset error state before new fetch
      try {
        const response = await axios.get<Track[]>(`${API_BASE_URL}/api/Tracks?tracktype=1`); 
        setTracks(response.data);
        console.log('Academic tracks data (direct fetch):', response.data);
      } catch (err) {
        console.error('Error fetching academic tracks (direct fetch):', err);
        setError(err as Error);
        setTracks([]); // Clear tracks on error
      } finally {
        setIsLoading(false);
      }
    };
    fetchAcademicTracks();
  }, []);

  if (error) {
    console.error('Render error for academic tracks:', error);
  }

  return <ProgramsContent tracks={tracks} isLoading={isLoading} isInView={isInView} />;
};

const ProfessionalPrograms = ({ isInView }: { isInView: boolean }) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProfessionalTracks = async () => {
      console.log('ProfessionalPrograms: Fetching tracks. API_BASE_URL:', API_BASE_URL);
      setIsLoading(true);
      setError(null); // Reset error state before new fetch
      try {
        const response = await axios.get<Track[]>(`${API_BASE_URL}/api/Tracks?tracktype=2`); // Changed from 1 to 2 for professional
        setTracks(response.data);
        console.log('Professional tracks data (direct fetch):', response.data);
      } catch (err) {
        console.error('Error fetching professional tracks (direct fetch):', err);
        setError(err as Error);
        setTracks([]); // Clear tracks on error
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfessionalTracks();
  }, []);

  if (error) {
    console.error('Render error for professional tracks:', error);
  }

  return <ProgramsContent tracks={tracks} isLoading={isLoading} isInView={isInView} />;
};

const ProgramsTabsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [activeTab, setActiveTab] = useState<TrackType>(1); // 1 for academic, 2 for professional

  const handleTabChange = (value: string) => {
    setActiveTab(Number(value) as TrackType);
  };

  return (
    <section ref={ref} className="py-16 bg-gray-50">
      <div className="container-content">
        <h2 className="text-3xl font-bold text-[#002b4e] text-center mb-8">البرامج</h2>
        
        <Tabs 
          defaultValue="1" 
          className="w-full" 
          onValueChange={handleTabChange}
          value={activeTab.toString()}
        >
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8 justify-end" dir="rtl">
            <TabsTrigger value="1">البرامج الأكاديمية</TabsTrigger>
            <TabsTrigger value="2">البرامج المهنية</TabsTrigger>
          </TabsList>
          
          <TabsContent value="1">
            <AcademicPrograms isInView={isInView} />
          </TabsContent>

          <TabsContent value="2">
            <ProfessionalPrograms isInView={isInView} />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

interface ProgramsContentProps {
  tracks: Track[];
  isLoading: boolean;
  isInView: boolean;
}

const ProgramsContent = ({ tracks, isLoading, isInView }: ProgramsContentProps) => {
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-4">جاري تحميل البرامج...</p>
      </div>
    );
  }

  if (!tracks || tracks.length === 0) {
    return (
      <div className="text-center py-12">
        <p>لم يتم العثور على برامج</p>
      </div>
    );
  }

  // Only show first 3 tracks
  const displayedTracks = tracks.slice(0, 3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8" dir="rtl">
      {displayedTracks.map((program, index) => (
        <motion.div 
          key={program.id} 
          initial={{ opacity: 0, y: 20 }} 
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }} 
          transition={{ duration: 0.5, delay: index * 0.1 }} 
          className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow duration-300"
        >
          <div className="aspect-video relative overflow-hidden">
            <img 
              src={program.image} 
              alt={program.title} 
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              loading="lazy"
            />
          </div>
          <div className="p-6 flex flex-col flex-grow">
            <h3 className="text-xl font-bold mb-4 text-gray-800">{program.title}</h3>
            <p className="text-gray-600 mb-6 line-clamp-3 flex-grow leading-relaxed">
              {program.shortDescription}
            </p>
            <div className="mt-auto">
              <Link 
                to={`/tracks/${program.id}`} 
                className="inline-flex items-center justify-center w-full py-2.5 bg-secondary hover:bg-secondary/80 rounded-md text-sm font-medium transition-colors"
              >
                عرض التفاصيل <ArrowLeft size={16} className="mr-1" />
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
