
import NavBar from './shared/NavBar'
import { HeroSection } from './HeroSection'
import { CategoryCaraousel } from './CategoryCaraousel'
import { LatestJobs } from './LatestJobs'
import { Footer } from './shared/Footer'
import { useGetAllJobs } from '@/hook/useGetAllJobs'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { use, useEffect } from 'react'


export const Home = () => {
  const {user} = useSelector(store => store.auth) ;
  const navigate = useNavigate() ;

  useEffect(() => {
    if(user?.role == "Recruiter") {
      navigate("/admin/companies") ;
    }
    else {
      navigate("/");
    }
  }, [])
  useGetAllJobs() ;
  return (
    <div>
        <NavBar/>
        <HeroSection/>
        <CategoryCaraousel/>
        <LatestJobs/>
        <Footer/>
    </div>
  )
}
