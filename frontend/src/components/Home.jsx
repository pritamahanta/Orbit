import NavBar from './shared/NavBar'
import { HeroSection } from './HeroSection'
import { CategoryCaraousel } from './CategoryCaraousel'
import { LatestJobs } from './LatestJobs'
import { Footer } from './shared/Footer'
import { useGetAllJobs } from '@/hook/useGetAllJobs'

export const Home = () => {

  useGetAllJobs();

  return (
    <div>
      <NavBar />
      <HeroSection />
      <CategoryCaraousel />
      <LatestJobs />
      <Footer />
    </div>
  )
}