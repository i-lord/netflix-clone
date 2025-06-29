import React, { useEffect, useState } from 'react'
import MuiModal from '@mui/material/Modal'
import { useRecoilState } from 'recoil'
import { modalState, movieState } from '../atoms/modalAtoms'
import { PlusIcon, ThumbUpIcon, VolumeOffIcon, VolumeUpIcon, XCircleIcon } from '@heroicons/react/outline'
import ReactPlayer from 'react-player/lazy'
import { Element, Genre } from '../typin'
import { FaPlay } from 'react-icons/fa'
import { dividerClasses } from '@mui/material'

// Modal component displays detailed movie info and plays trailer in a modal popup
function Modal() {
    // State for showing/hiding the modal
    const [showModal, setShowModal] = useRecoilState(modalState)
    // State for the currently selected movie
    const [movie,setMovie] = useRecoilState(movieState)
    // Holds the full movie data fetched from TMDb
    const [data, setData] = useState()
    // YouTube trailer key
    const [trailer, setTrailer] = useState("")
    // List of genres for the movie
    const [genres, setGenres] = useState<Genre[]>([])
    // Controls whether the trailer is muted
    const [muted, setMuted] = useState(true)

    // Fetch detailed movie info (including trailer and genres) when a movie is selected
    useEffect(() =>{
        if(!movie) return 
        async function fetchMovie(){
            // Fetch movie details from TMDb API, including videos (trailers)
            const url = `https://api.themoviedb.org/3/${movie?.media_type === 'tv' ? 'tv' : 'movie'}/${movie?.id}?api_key=${process.env.NEXT_PUBLIC_API_KEY}&language=en-US&append_to_response=videos`
            console.log(url)
            const response = await fetch(url)
            if (!response.ok) {
                console.error('API error:', response.status, await response.text())
                return
            }
            const data = await response.json()

            // Find the first trailer in the videos list and set the YouTube key
            if(data?.videos) {
                const index = data.videos.results.findIndex((element: Element) => element.type === "Trailer" )
                setTrailer(data.videos?.results[index]?.key)
            }
            // Set genres if available
            if (data?.genres) {
                setGenres(data.genres)
            }
        }
        fetchMovie()
    },[movie])
    // Log the trailer key for debugging
    console.log(trailer)
    
    // Close the modal
    const handleClose = () => {
        setShowModal(false)
    }

  return (
    // MuiModal provides the modal overlay and animation
    <MuiModal open = {showModal} onClose = {handleClose} className= 'fixed !top-7 left-0 right-0 Z-50 mx-auto w-full max-w-5xl overflow-hidden overflow-y-scroll rounded-md scrollbar-hide'>
        <>
        {/* Close button */}
        <button onClick={handleClose} className='modalButton absolute right-5 top-5 !z-40 h-9 w-9 border-none
        bg-[#181818] hover:bg-[#181818]'>
            <XCircleIcon className='h-6 w-6' />
        </button>
        <div className='relative pt-[56.25%]'>
        {/* ReactPlayer embeds the YouTube trailer */}
        <ReactPlayer 
        url={`https://www.youtube.com/watch?v=${trailer}`}
        width='100%'
        height='100%'
        style={{position: 'absolute', top: '0', left: '0'}}
        playing
        muted = {muted}
        />
        {/* Controls below the video */}
        <div className='absolute bottom-10 flex w-full items-center justify-between px-6' >
            <div className='flex space-x-2'>
                {/* Play button (not functional, just UI) */}
                <button className='flex items-center gap-x-2 rounded bg-white px-8 text-xl font-bold text-black transition hover:bg-[#e6e6e6]'>
                <FaPlay className='h-7 w-7 text-black'/>
                    Play
                </button>
                {/* Add to list button (not functional) */}
                <button className='modalButton'>
                    <PlusIcon className='h-7 w-7' />
                </button>
                {/* Like button (not functional) */}
                <button className='modalButton'>
                    <ThumbUpIcon className='h-7 w-7' />
                </button>
            </div>
            {/* Mute/unmute button for trailer audio */}
            <button className='modalButton' onClick={() => setMuted(!muted)}>
                {muted ? (
                    <VolumeOffIcon className='h-6 w-6' /> 
                ): (
                    <VolumeUpIcon className='h-6 w-6' />
                )}
            </button>
        </div>
        </div>

        {/* Movie details section */}
        <div className='space-y-8 rounded-b-md bg-[#181818] px-10 py-8 '>
            <div className='space-y-6 text-lg '>
                <div className='flex items-center space-x-2 text-sm '>
                {/* Match percentage, release date, and HD badge */}
                <p className='font-semibold text-green-400'>{movie?.vote_average * 10}% Match</p>
            <p className='font-light'>{movie?.release_date || movie?.first_air_date}</p>
            <div className='flex h-4 items-center justify-center rounded border border-white/40 px-1.5 text-xs'>HD</div>
                </div>
            </div>

            <div className='flex flex-col gap-x-10 gap-y-4 font-light md:flex-row'>
                {/* Movie overview/description */}
                <p className='w-5/6'>{movie?.overview}</p>
                <div className='flex flex-col space-y-3 text-sm'>
                    {/* Genres list */}
                    <div>
                        <span className='text-[gray]'>Genres: </span>
                        {genres.map((genre) => genre.name).join(', ')}
                    </div>
                    {/* Original language */}
                    <div>
                        <span className='text-[gray]'>Original Language: </span>
                        {movie?.original_language}
                    </div>
                </div>
            </div>
           
        </div>
        
        </>
    </MuiModal>
  )
}

export default Modal