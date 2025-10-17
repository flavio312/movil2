

export const CloudinaryUploadResult = {
  publicId: '',
  url: '',
  width: 0,
  height: 0,
  format: '',
  bytes: 0,
  fileName: ''
};

export const CloudinaryUploadOptions = {
  folder: '',
  public_id: '',
  tags: [],
  transformation: []
};

export const CloudinaryDeleteResult = {
  success: false,
  result: ''
};


export const Producto = {
  id: null,
  title: '',
  section: '',
  description: '',
  stock:'',
  price: '',
  imagen_url: '',
  imagen_public_id: '',
  created_at: null,
  updated_at: null
};

export const ProductoCreateRequest = {
  title: '',
  description: '',
};

// PlatilloUpdateRequest sería una versión parcial de PlatilloCreateRequest
export const PlatilloUpdateRequest = {
  title: '',
  description: '',
};

// Extender Request de Express para incluir file
// En JS no se puede extender tipos, pero puedes documentarlo así:
export const MulterRequest = {
  ...require('express').request,
  file: null // Express.Multer.File
};


export const ApiResponse = {
  success: false,
  message: '',
  data: null,
  error: ''
};

export const ProductoResponse = {
  id: null,
  title: '',
  section: '',
  description: '',
  stock:'',
  price: '',
  imagen_url: '',
  imagen_public_id: '',
  created_at: null,
  updated_at: null,
  imagen: {
    url: '',
    publicId: '',
    width: 0,
    height: 0,
    format: '',
    size: 0
  }
};

// Configuración de Cloudinary
export const CloudinaryConfig = {
  cloud_name: '',
  api_key: '',
  api_secret: ''
};
