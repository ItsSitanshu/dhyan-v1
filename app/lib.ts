import axios from 'axios';

const tutor = async (query: string, history: string) => {
  try {
    const response = await axios.post('http://localhost:5000/api/tutor', {
      history: history,
      query: query,
      feedback_metrics: {}
    });

    return response.data;
  } catch (error) {
    return { "error" : error }
  }
};

const feedback = async (model_extraction: any, stars: any) => {
  try {
    const response = await axios.post('http://localhost:5000/api/feedback', {
      stars: stars,
      model_extraction: model_extraction,
    });

    return response.data;
  } catch (error) {
    return { "error" : error }
  }
}

const extract = async (prev_response: any) => {
  try {
    const response = await axios.post('http://localhost:5000/api/extract', {
      prev_response: prev_response,
    });

    return response.data;
  } catch (error) {
    return { "error" : error }
  }
}

function getTokenCount(text: string): number {
  return text.split(/\s+/).length;
}

function trimToMaxTokens(text: string, maxTokens: number): string {
  const words = text.split(/\s+/);
  const trimmedWords = words.slice(0, maxTokens);
  return trimmedWords.join(' ');
}

const simulationTitles: Record<string, string> = {
  "newtons_laws_simulation": "Newton's Laws",
  "projectile_motion_simulation": "Projectile Motion",
  "friction_simulation": "Friction Simulation",
  "electric_circuit_simulation": "Electric Circuits",
  "gravity_orbit_simulation": "Gravity and Orbits",
  "fluid_dynamics_simulation": "Fluid Pressure & Buoyancy",
  "wave_interference_simulation": "Wave Interference",
  "chemical_reactions_lab": "Chemical Reactions Lab",
  "dna_replication_visualizer": "DNA Replication & Structure",
};

const getSimulationTitle = (simId: string) => {
  return simulationTitles[simId] || "Unknown Simulation";
};

export { tutor, feedback, extract, getTokenCount, trimToMaxTokens, getSimulationTitle };