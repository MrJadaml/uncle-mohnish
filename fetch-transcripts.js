const fs = require('fs')
const axios = require('axios')
require('dotenv').config()

const API_KEY = process.env.GOOGLE_API_KEY
const CHANNEL_ID = 'YOUR_CHANNEL_ID'

async function fetchVideos() {
  try {
    const googleApi = 'https://www.googleapis.com/youtube/v3'
    const channelsEndpoint = `/channels?part=contentDetails&id=${CHANNEL_ID}&key=${API_KEY}`
    const playlistResponse = await axios.get(`${googleApi}${channelsEndpoint}`)
    const playlistId = playlistResponse.data.items[0].contentDetails.relatedPlaylists.uploads
    const playlistEndpoint = `/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&key=${API_KEY}`
    const videosResponse = await axios.get(`${googleApi}${playlistEndpoint}`)

    // Extract video details from the response
    const videoDetails = videosResponse.data.items.map(item => {
      return {
        title: item.snippet.title,
        videoId: item.snippet.resourceId.videoId
      }
    })

    // Fetch transcripts for each video
    for (const video of videoDetails) {
      const captionsEndpoint = `/captions?part=snippet&videoId=${video.videoId}&key=${API_KEY}`
      const transcriptResponse = await axios.get(`${googleApi}${captionsEndpoint}`)
      
      if (transcriptResponse.data.items && transcriptResponse.data.items.length > 0) {
        const transcriptId = transcriptResponse.data.items[0].id
        const transcriptsEndpoint = `/captions/${transcriptId}?key=${API_KEY}`
        const transcriptTextResponse = await axios.get(`${googleApi}${transcriptsEndpoint}`, { responseType: 'text' })

        // Save transcript to a text file
        const transcriptFilePath = `./transcripts/${video.title}.txt`
        fs.writeFileSync(transcriptFilePath, transcriptTextResponse.data)
        console.log(`Transcript saved for "${video.title}"`)
      } else {
        console.log(`Transcript not available for "${video.title}"`)
      }
    }
  } catch (error) {
    console.error('Error fetching videos:', error.message)
  }
}

fetchVideos();
