const config = { 
  plugins: { 
    tailwindcss: {}, 
    autoprefixer: {
      // Optimización: solo agregar prefijos necesarios
      overrideBrowserslist: [
        '>0.3%',
        'last 2 versions',
        'not dead',
        'not op_mini all'
      ]
    } 
  } 
};

export default config;
