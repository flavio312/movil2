import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const processPasswordCSV = () => {
  console.log('🔄 Procesando archivo CSV de contraseñas...\n');
  
  try {
    const csvPath = path.join(__dirname, '../data/psw.csv');
    const outputPath = path.join(__dirname, '../data/common-passwords.txt');
    
    if (!fs.existsSync(csvPath)) {
      console.error('❌ Error: No se encontró el archivo csv');
      console.log('📁 Coloca el archivo CSV en: ' + csvPath);
      return;
    }
    
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = csvContent.split('\n');
    
    console.log(`📊 Total de líneas en CSV: ${lines.length}`);
    
    const passwords = new Set();
    let skippedLines = 0;
    
    lines.forEach((line, index) => {
      if (index === 0 && (line.toLowerCase().includes('password') || line.toLowerCase().includes('rank'))) {
        return;
      }
      
      const trimmedLine = line.trim();
      if (!trimmedLine) return;
      
      const columns = trimmedLine.split(',');
      
      if (columns.length >= 2) {
        let password = columns[1].trim();
        
        password = password.replace(/^["']|["']$/g, '');
        
        if (password && password.length > 0 && password.length <= 128) {
          passwords.add(password);
        }
      } else {
        skippedLines++;
      }
    });
    
    console.log(`✅ Contraseñas únicas procesadas: ${passwords.size}`);
    console.log(`⚠️  Líneas omitidas: ${skippedLines}`);
    
    const passwordArray = Array.from(passwords).sort();
    fs.writeFileSync(outputPath, passwordArray.join('\n'), 'utf-8');
    
    console.log(`\n💾 Archivo guardado en: ${outputPath}`);
    console.log('✨ Proceso completado exitosamente\n');
    
    console.log('📈 Estadísticas:');
    console.log(`   - Contraseñas más corta: ${Math.min(...passwordArray.map(p => p.length))} caracteres`);
    console.log(`   - Contraseñas más larga: ${Math.max(...passwordArray.map(p => p.length))} caracteres`);
    console.log(`   - Primeras 5: ${passwordArray.slice(0, 5).join(', ')}`);
    
  } catch (error) {
    console.error('❌ Error al procesar el archivo:', error.message);
  }
};

processPasswordCSV();