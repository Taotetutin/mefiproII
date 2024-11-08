import { FormData, MEFIClassification } from '../types';

export function classifyMEFI(data: FormData): MEFIClassification {
  const { fcb, variabilidad, aceleraciones, desaceleraciones } = data;

  // Categoría III - Anormal (Prioridad máxima de evaluación)
  if (isCategory3(fcb, variabilidad, desaceleraciones)) {
    return {
      category: 'Categoría III',
      description: 'Trazado anormal - Estado fetal no tranquilizador',
      riskLevel: 'Alto riesgo - Requiere acción inmediata',
      guidelines: [
        'Ausencia de variabilidad con desaceleraciones tardías o variables recurrentes',
        'Bradicardia severa sostenida',
        'Patrón sinusoidal confirmado',
        'Variabilidad ausente con FCB basal normal y ausencia de aceleraciones'
      ],
      recommendations: [
        'Evaluación inmediata por especialista',
        'Oxigenoterapia materna con mascarilla (10L/min)',
        'Posición decúbito lateral izquierdo',
        'Hidratación IV rápida (1000cc)',
        'Suspender oxitocina si está en uso',
        'Considerar tocolisis de urgencia si hay taquisistolia',
        'Preparar para posible cesárea de emergencia (10-30 min)',
        'Toma de pH fetal si está disponible y es factible'
      ],
      categoryClass: 'bg-red-100 border-red-500'
    };
  }

  // Categoría I - Normal
  if (isCategory1(fcb, variabilidad, aceleraciones, desaceleraciones)) {
    return {
      category: 'Categoría I',
      description: 'Trazado normal - Estado fetal tranquilizador',
      riskLevel: 'Bajo riesgo',
      guidelines: [
        'FCB: 110-160 lpm',
        'Variabilidad moderada: 6-25 lpm',
        'Presencia o ausencia de aceleraciones',
        'Sin desaceleraciones significativas o solo desaceleraciones precoces'
      ],
      recommendations: [
        'Continuar monitoreo de rutina cada 30 minutos',
        'Documentar evaluación cada hora',
        'No requiere intervenciones específicas',
        'Mantener hidratación materna adecuada'
      ],
      categoryClass: 'bg-green-100 border-green-500'
    };
  }

  // Categoría II - Indeterminado
  return {
    category: 'Categoría II',
    description: 'Trazado indeterminado - Requiere vigilancia y reevaluación',
    riskLevel: 'Riesgo intermedio',
    guidelines: [
      'Taquicardia fetal',
      'Bradicardia con variabilidad presente',
      'Variabilidad mínima',
      'Variabilidad ausente sin desaceleraciones recurrentes',
      'Desaceleraciones variables recurrentes con variabilidad mínima o moderada',
      'Desaceleraciones prolongadas (> 2 min pero < 10 min)'
    ],
    recommendations: [
      'Identificar y corregir causas subyacentes:',
      '- Evaluar posición materna',
      '- Evaluar presión arterial materna',
      '- Evaluar actividad uterina',
      '- Evaluar estado de hidratación',
      'Medidas de reanimación intrauterina:',
      '- Cambio de posición a decúbito lateral izquierdo',
      '- Hidratación materna',
      '- Oxigenoterapia por mascarilla si es necesario',
      'Reevaluar en 20-30 minutos tras medidas correctivas',
      'Si no hay mejoría, considerar pruebas adicionales'
    ],
    categoryClass: 'bg-yellow-100 border-yellow-500'
  };
}

function isCategory1(fcb: string, variabilidad: string, aceleraciones: string, desaceleraciones: string): boolean {
  return (
    fcb === 'normal' &&
    variabilidad === 'normal' &&
    (aceleraciones === 'presentes' || aceleraciones === 'ausentes') &&
    (desaceleraciones === 'ausentes' || desaceleraciones === 'precoces')
  );
}

function isCategory3(fcb: string, variabilidad: string, desaceleraciones: string): boolean {
  const severeConditions = [
    fcb === 'bradicardia_severa',
    variabilidad === 'ausente' && ['tardias', 'variables'].includes(desaceleraciones),
    desaceleraciones === 'sinusoidal',
    variabilidad === 'ausente' && desaceleraciones === 'prolongadas'
  ];

  return severeConditions.some(condition => condition);
}