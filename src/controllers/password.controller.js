import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let commonPasswords = new Set();

const loadPasswordDictionary = () => {
  try {
    const dictionaryPath = path.join(__dirname, '../data/common-passwords.txt');
    if (fs.existsSync(dictionaryPath)) {
      const data = fs.readFileSync(dictionaryPath, 'utf-8');
      const passwords = data.split('\n').map(p => p.trim()).filter(p => p.length > 0);
      commonPasswords = new Set(passwords);
      console.log(`✓ Diccionario cargado: ${commonPasswords.size} contraseñas`);
    }
  } catch (error) {
    console.warn('⚠ No se pudo cargar el diccionario de contraseñas comunes');
  }
};

loadPasswordDictionary();

const calculateL = (password) => {
  return password.length;
};

const calculateN = (password) => {
  let keyspace = 0;
  
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSymbols = /[^a-zA-Z0-9]/.test(password);
  
  if (hasLowercase) keyspace += 26;
  if (hasUppercase) keyspace += 26; 
  if (hasNumbers) keyspace += 10;   
  if (hasSymbols) keyspace += 32; 
  
  return keyspace;
};

const calculateEntropy = (password) => {
  const L = calculateL(password);
  const N = calculateN(password);
  
  if (N === 0) return 0;
  
  const entropy = L * Math.log2(N);
  return entropy;
};

const calculateCrackTime = (entropy) => {
  const attemptsPerSecond = Math.pow(10, 11);
  const totalCombinations = Math.pow(2, entropy);
  const secondsToCrack = totalCombinations / attemptsPerSecond / 2; // Promedio: mitad del espacio
  
  const minute = 60;
  const hour = minute * 60;
  const day = hour * 24;
  const year = day * 365;
  
  if (secondsToCrack < minute) {
    return `${secondsToCrack.toFixed(2)} segundos`;
  } else if (secondsToCrack < hour) {
    return `${(secondsToCrack / minute).toFixed(2)} minutos`;
  } else if (secondsToCrack < day) {
    return `${(secondsToCrack / hour).toFixed(2)} horas`;
  } else if (secondsToCrack < year) {
    return `${(secondsToCrack / day).toFixed(2)} días`;
  } else {
    return `${(secondsToCrack / year).toExponential(2)} años`;
  }
};

const checkPasswordStrength = (password, entropy) => {
  let strength = '';
  let warnings = [];
  let score = 0;
  
  if (entropy < 40) {
    strength = 'Muy Débil';
    score = 1;
    warnings.push('La contraseña es demasiado corta o simple');
  } else if (entropy < 60) {
    strength = 'Débil';
    score = 2;
    warnings.push('La contraseña es vulnerable a ataques de fuerza bruta');
  } else if (entropy < 80) {
    strength = 'Fuerte';
    score = 3;
  } else if (entropy < 100) {
    strength = 'Muy Fuerte';
    score = 4;
  } else {
    strength = 'Excelente';
    score = 5;
  }

  if (commonPasswords.has(password)) {
    strength = 'Muy Débil (Común)';
    score = 1;
    warnings.push('CRÍTICO: No uses esta contraseña bajo ninguna circunstancia');
  } else if (commonPasswords.has(password.toLowerCase())) {
    score = Math.max(1, score - 2);
    strength = score <= 2 ? 'Débil (Variante Común)' : strength;
    warnings.push('Esta contraseña es una variante de contraseñas comunes');
  }
  
  if (password.length < 8) {
    warnings.push('La contraseña debería tener al menos 8 caracteres');
  }
  
  if (!/[a-z]/.test(password)) {
    warnings.push('Considera agregar letras minúsculas');
  }
  
  if (!/[A-Z]/.test(password)) {
    warnings.push('Considera agregar letras mayúsculas');
  }
  
  if (!/[0-9]/.test(password)) {
    warnings.push('Considera agregar números');
  }
  
  if (!/[^a-zA-Z0-9]/.test(password)) {
    warnings.push('Considera agregar símbolos especiales (!@#$%^&*)');
  }
  
  if (/(.)\1{2,}/.test(password)) {
    warnings.push('Evita repetir caracteres consecutivos');
  }
  
  if (/^[0-9]+$/.test(password)) {
    warnings.push('No uses solo números');
  }
  
  if (/^[a-zA-Z]+$/.test(password)) {
    warnings.push('No uses solo letras');
  }
  
  if (/(?:abc|bcd|cde|def|123|234|345|456|567|678|789)/i.test(password)) {
    warnings.push('Evita secuencias predecibles (abc, 123, etc.)');
  }
  
  return { strength, score, warnings };
};

export const evaluatePassword = async (req, res) => {
  try {
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({
        error: 'El campo password es obligatorio'
      });
    }
    
    if (typeof password !== 'string') {
      return res.status(400).json({
        error: 'El campo password debe ser una cadena de texto'
      });
    }
    
    if (password.length === 0) {
      return res.status(400).json({
        error: 'La contraseña no puede estar vacía'
      });
    }
    
    if (password.length > 128) {
      return res.status(400).json({
        error: 'La contraseña es demasiado larga (máximo 128 caracteres)'
      });
    }
    
    const L = calculateL(password);
    const N = calculateN(password);
    const entropy = calculateEntropy(password);
    const { strength, score, warnings } = checkPasswordStrength(password, entropy);
    const crackTime = calculateCrackTime(entropy);
    const characterTypes = [];
    if (/[a-z]/.test(password)) characterTypes.push('minúsculas');
    if (/[A-Z]/.test(password)) characterTypes.push('mayúsculas');
    if (/[0-9]/.test(password)) characterTypes.push('números');
    if (/[^a-zA-Z0-9]/.test(password)) characterTypes.push('símbolos');
    
    const response = {
      evaluation: {
        strength,
        score,
        entropy: parseFloat(entropy.toFixed(2)),
        crackTime
      },
      details: {
        length: L,
        keyspace: N,
        characterTypes,
        formula: `E = ${L} × log₂(${N}) = ${entropy.toFixed(2)} bits`
      },
      warnings: warnings.length > 0 ? warnings : ['La contraseña cumple con los estándares básicos'],
      recommendations: [
        'Usa al menos 12 caracteres',
        'Combina mayúsculas, minúsculas, números y símbolos',
        'Evita palabras del diccionario y datos personales',
        'No reutilices contraseñas entre diferentes servicios',
        'Considera usar un gestor de contraseñas'
      ]
    };
    
    res.status(200).json(response);
    
  } catch (error) {
    console.error('Error en evaluación:', error.message);
    res.status(500).json({
      error: 'Error al evaluar la contraseña'
    });
  }
};