import api from './api'
import imageCompression from 'browser-image-compression'

export const uploadImages = async (files) => {
  const formData = new FormData()
  
  // Comprimir cada imagen antes de subir
  for (const file of files) {
    const options = {
      maxSizeMB: 1, // Máximo 1MB
      maxWidthOrHeight: 1200, // Máximo 1200px
      useWebWorker: true
    }
    
    let fileToUpload = file
    try {
      // Si la imagen es grande, comprimirla
      if (file.size > 1024 * 1024) { // Mayor a 1MB
        fileToUpload = await imageCompression(file, options)
      }
      formData.append('images', fileToUpload)
    } catch (error) {
      console.error('Error comprimiendo imagen:', error)
      formData.append('images', file)
    }
  }
  
  const { data } = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    timeout: 60000 // 60 segundos timeout
  })
  return data.urls
}

export const uploadSingleImage = async (file) => {
  const formData = new FormData()
  
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 800,
    useWebWorker: true
  }
  
  let fileToUpload = file
  if (file.size > 1024 * 1024) {
    fileToUpload = await imageCompression(file, options)
  }
  
  formData.append('image', fileToUpload)
  
  const { data } = await api.post('/upload/single', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return data.url
}