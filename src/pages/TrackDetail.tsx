import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowLeft, Clock, FileText, GraduationCap, Briefcase, CheckCircle } from 'lucide-react';
import PageTransition from '@/components/ui/PageTransition';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fetchTrackById } from '@/services/tracks';

const TrackDetail = () => {
  const { trackId } = useParams();
  const navigate = useNavigate();
  const [track, setTrack] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadTrack = async () => {
      try {
        const trackData = await fetchTrackById(Number(trackId));
        setTrack(trackData);
      } catch (error) {
        console.error('Error fetching track details:', error);
        navigate('/tracks', { replace: true });
      } finally {
        setLoading(false);
      }
    };

    loadTrack();
  }, [trackId, navigate]);
  
  // Handle track not found
  useEffect(() => {
    if (!loading && !track) {
      navigate('/tracks', { replace: true });
    }
  }, [loading, track, navigate]);
  
  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-muted-foreground">جاري تحميل تفاصيل المسار...</p>
        </div>
      </div>
    );
  }
  
  if (!track) {
    return null; // Will redirect in the useEffect
  }
  
  return (
    <PageTransition>
      <div className="py-12" dir="rtl">
        <div className="container-content text-right">
          <Link 
            to="/tracks" 
            className="inline-flex flex-row-reverse items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            العودة إلى المسارات <ArrowLeft size={16} className="mr-1 rotate-180" />
          </Link>
          
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <TrackOverview track={track} />
              <TrackTabs track={track} />
            </div>
            
            <div className="lg:col-span-1">
              <TrackSidebar track={track} />
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

const TrackOverview = ({ track }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      dir="rtl"
      className="text-right"
    >
      <div className="aspect-video rounded-xl overflow-hidden" dir="rtl">
        <img 
          src={track.image} 
          alt={track.title}
          className="w-full h-full object-cover"
        />
      </div>
      
      <h1 className="mt-6 text-3xl md:text-4xl font-bold text-right" dir="rtl">{track.title}</h1>      
      <p className="mt-6 text-lg text-right" dir="rtl">{track.fullDescription}</p>
    </motion.div>
  );
};

const TrackTabs = ({ track }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mt-12"
    >
      <Tabs value="requirements" defaultValue="requirements">
        <TabsList className="w-full">
          <TabsTrigger value="requirements">المتطلبات</TabsTrigger>
        </TabsList>
        
        <TabsContent value="requirements" className="mt-6 text-right" dir="rtl">
          <div className="bg-secondary/30 p-6 rounded-lg text-right" dir="rtl">
            <h3 className="font-semibold">متطلبات القبول</h3>
            <ul className="mt-4 space-y-3">
              {track.requirements.map((requirement, index) => (
                <li key={index} className="flex flex-row-reverse items-center text-right mb-2" dir="rtl">
                  <span className="flex-1">{requirement}</span>
                  <CheckCircle size={18} className="ml-2 flex-shrink-0 text-primary" />
                </li>
              ))}
            </ul>
            <Separator className="my-6" />
            <p className="text-sm text-muted-foreground">
              متطلبات القبول قابلة للتغيير. يرجى الاتصال بمكتب القبول للحصول على أحدث المعلومات.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

const TrackSidebar = ({ track }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 20 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white p-6 rounded-xl border border-border shadow-sm"
    >
      <h3 className="text-lg font-semibold">التقديم لهذا المسار</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        ابدأ رحلتك في مسار {track.title} من خلال تقديم طلبك اليوم.
      </p>
      
      <div className="mt-6 space-y-4">
        <Separator />
        <div className="flex justify-between text-sm">
          <span>تاريخ البدء:</span>
          <span className="font-medium">سبتمبر ٢٠٢٥</span>
        </div>
        <Separator />
        <div className="flex justify-between text-sm">
          <span>الموعد النهائي للتقديم:</span>
          <span className="font-medium">١٥ أغسطس ٢٠٢٥</span>
        </div>
        <Separator />
        <div className="flex justify-between text-sm">
          <span>الحالة:</span>
          <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs font-medium">
            مفتوح للتقديم
          </span>
        </div>
      </div>
      
      <div className="mt-8">
        <Button className="w-full">
          {track && (
            <Link
              to={`/program-registration?trackId=${track.id}&type=${track.trackType}`}
              className="flex flex-row-reverse items-center justify-center"
            >
              <ArrowLeft size={16} className="ml-1" /> سجّل الآن
            </Link>
          )}
        </Button>
        <Button variant="outline" className="w-full mt-3 flex flex-row-reverse items-center justify-center">
          <ArrowLeft size={16} className="ml-1" /> تحميل الكتيب التعريفي
        </Button>
      </div>
      
      <div className="mt-8 bg-secondary/50 p-4 rounded-lg">
        <h4 className="font-medium text-sm">تحتاج إلى مزيد من المعلومات؟</h4>
        <p className="mt-1 text-xs text-muted-foreground">
          اتصل بمكتب القبول للحصول على توجيه شخصي.
        </p>
        <a 
          href="mailto:admissions@collegetrack.edu" 
          className="mt-2 text-xs text-primary hover:underline block"
        >
          admissions@collegetrack.edu
        </a>
      </div>
    </motion.div>
  );
};

export default TrackDetail;
