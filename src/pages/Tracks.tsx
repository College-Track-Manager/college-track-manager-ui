import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search } from 'lucide-react';
import PageTransition from '@/components/ui/PageTransition';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useTracksByType, Track, TrackType } from '@/services/tracks';

const Tracks = () => {
  // 1 = academic, 2 = professional
  const [activeTab, setActiveTab] = useState<TrackType>(1);
  const [searchQuery, setSearchQuery] = useState('');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  // Fetch tracks by numeric type (1 or 2)
  const { data: tracks = [], isLoading, error } = useTracksByType(activeTab);

  // Filter tracks based on search query
  const filteredTracks = tracks.filter((track) => {
    return track.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.shortDescription?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500">حدث خطأ أثناء تحميل البرامج. يرجى المحاولة مرة أخرى.</p>
      </div>
    );
  }

  return (
    <PageTransition>
      <section className="py-12 md:py-16" ref={ref}>
        <div className="container-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto text-center"
          >
            <h1 className="text-4xl font-bold tracking-tight">البرامج</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              استكشف مجموعتنا المتنوعة من البرامج المصممة لإعدادك للنجاح.
            </p>

            <div className="mt-8 relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="text"
                placeholder="ابحث في البرامج..."
                className="pr-10 text-right"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                dir="rtl"
              />
            </div>
          </motion.div>

          {/* Tabs Section */}
          <Tabs
            defaultValue="1"
            className="w-full mt-10"
            onValueChange={(value) => setActiveTab(Number(value) as TrackType)}
          >
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="2">البرامج المهنية</TabsTrigger>
              <TabsTrigger value="1">البرامج الأكاديمية</TabsTrigger>
            </TabsList>

            <TabsContent value="1">
              <TracksContent 
                tracks={filteredTracks} 
                isLoading={isLoading} 
                searchQuery={searchQuery} 
                onClearSearch={() => setSearchQuery('')}
              />
            </TabsContent>

            <TabsContent value="2">
              <TracksContent 
                tracks={filteredTracks} 
                isLoading={isLoading} 
                searchQuery={searchQuery} 
                onClearSearch={() => setSearchQuery('')}
              />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </PageTransition>
  );
};

// Component to render track content, including any filtering or loading states
const TracksContent = ({ tracks, isLoading, searchQuery, onClearSearch }: { 
  tracks: Track[], 
  isLoading: boolean, 
  searchQuery: string,
  onClearSearch: () => void 
}) => {
  if (isLoading) {
    return <p className="text-center">...جاري تحميل البرامج</p>;
  }

  return (
    <>
      {tracks.length > 0 ? (
        <TracksList tracks={tracks} />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-12 text-center p-8 bg-secondary/50 rounded-lg"
        >
          {searchQuery ? (
            <>
              <p className="text-lg">لم يتم العثور على برامج تطابق معايير البحث الخاصة بك.</p>
              <button
                className="mt-4 text-primary hover:text-primary/80"
                onClick={onClearSearch}
              >
                مسح البحث
              </button>
            </>
          ) : (
            <p className="text-lg">لا توجد برامج متاحة في هذا التصنيف.</p>
          )}
        </motion.div>
      )}
    </>
  );
};

// Component to render a list of track cards
const TracksList = ({ tracks }: { tracks: Track[] }) => {
  return (
    <AnimatePresence mode="popLayout">
      <div className="mt-12 flex justify-center">
        <div dir="rtl" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr justify-center">
          {tracks.map((track, index) => (
            <motion.div
              key={track.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="h-full w-full max-w-sm"
            >
              <TrackCard track={track} index={index} />
            </motion.div>
          ))}
        </div>
      </div>
    </AnimatePresence>
  );
};

// Component to render each track card
const TrackCard = ({ track, index }: { track: Track, index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow card-hover text-right h-full flex flex-col"
    >
      <div className="aspect-video relative overflow-hidden">
        <img
          src={track.image}
          alt={track.title}
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-700"
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-semibold">{track.title}</h3>
        </div>
        <p className="text-muted-foreground text-sm line-clamp-3 flex-grow">{track.shortDescription}</p>
        <div className="mt-6">
          <Link
            to={`/tracks/${track.id}`}
            className="inline-flex items-center justify-center w-full py-2.5 bg-secondary hover:bg-secondary/80 rounded-md text-sm font-medium transition-colors"
          >
            عرض التفاصيل <ArrowLeft size={16} className="mr-1" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default Tracks;