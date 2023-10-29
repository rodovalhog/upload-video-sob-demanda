/**
 Worker faz tudo em segundo plano
 sem a necessidade de travar o navegador
 */
import CanvasRenderer from "./CanvasRenderer.js"
import Mp4Demuxer from "./mp4Demuxer.js"
import VideoProcessor from "./videoProcessor.js"
import WebMWriter from './../deps/webm-writer2.js'
import Service from "./service.js"

 const qvgaConstraints ={
  width: 320,
  height: 240
 }

 const vgaConstraints = {
  width: 640,
  height: 480
 }

 const hdConstraints = {
  width: 1280,
  height: 720
 }

 const encoderConfig = {
  ...qvgaConstraints,
  bitrate: 10e6, //velocidade que vai ler o arquivo 1mbps
  //WebM
  codec: 'vp09.00.10.08',
  pt: 4,
  hardwareAcceleration: 'prefer-software',
  //MP4
  // codec: 'avc1.42002A',
  // pt: 1,
  // hardwareAcceleration: 'prefer-hardware',
  // avc: {format: 'annexb'}
 }

 const webmWriterConfig = {
  codec: 'VP9',
  width: encoderConfig.width,
  height: encoderConfig.height,
  bitrate: encoderConfig.bitrate

 }
const mp4Demuxer = new Mp4Demuxer ()
// const webMWriter = new WebMWriter(webmWriterConfig)

const service = new Service({url:'http://localhost:3000'})

const videoProcessor = new VideoProcessor({
  mp4Demuxer,
  webMWriter: new WebMWriter(webmWriterConfig),
  service
})

onmessage = async ({data}) => {
const renderFrame = CanvasRenderer.getRenderer(data.canvas)
  await videoProcessor.start ({
    file: data.file,
    renderFrame,
    encoderConfig,
    sendMessage: (message) => {
      self.postMessage(message)
      
    }
  })
    // self.postMessage({
    //   status: 'done'
    // })

 
}