import { useState, useEffect } from 'react';
import yaml from 'js-yaml';

export const useFormConfig = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        // In a real application, you might fetch this from an API
        // For now, we'll load it from the public folder
        const response = await fetch('/form-config.yaml');
        const yamlText = await response.text();
        const parsedConfig = yaml.load(yamlText);
        setConfig(parsedConfig);
      } catch (err) {
        // Fallback: define config inline if YAML loading fails
        console.warn('Failed to load YAML config, using fallback:', err);
        setConfig(getFallbackConfig());
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  const calculateCarbonFootprint = (formData) => {
    if (!config?.calculations) return null;

    const { emissionFactors, conditionMultipliers } = config.calculations;
    
    let emissions = 0;
    const fuelType = formData.fuelType;
    const operatingConditions = formData.operatingConditions || 'normal';
    
    // Calculate base emissions
    if (fuelType === 'electric' || fuelType === 'hybrid') {
      const consumption = parseFloat(formData.electricityConsumption) || 0;
      emissions = consumption * (emissionFactors.electric || 0.5);
    } else if (emissionFactors[fuelType]) {
      const consumption = parseFloat(formData.fuelConsumption) || 0;
      emissions = consumption * emissionFactors[fuelType];
    }

    // Apply condition multiplier
    const multiplier = conditionMultipliers[operatingConditions] || 1.0;
    emissions *= multiplier;

    // Apply operation hours
    const hours = parseFloat(formData.operationHours) || 0;
    emissions *= hours;

    return {
      totalEmissions: Math.round(emissions * 100) / 100, // Round to 2 decimal places
      emissionFactor: emissionFactors[fuelType] || 0,
      conditionMultiplier: multiplier,
      baseConsumption: parseFloat(formData.fuelConsumption || formData.electricityConsumption) || 0,
      operationHours: hours
    };
  };

  return { config, loading, error, calculateCarbonFootprint };
};

// Fallback configuration in case YAML loading fails
const getFallbackConfig = () => ({
  title: "Carbon Footprint Equipment Logger",
  description: "Track and monitor the carbon footprint of various machinery and equipment",
  sections: [
    {
      name: "Equipment Information",
      description: "Basic information about the equipment",
      fields: [
        {
          name: "equipmentType",
          label: "Equipment Type",
          type: "select",
          required: true,
          options: [
            { value: "excavator", label: "Excavator" },
            { value: "crane", label: "Crane" },
            { value: "forklift", label: "Forklift" },
            { value: "truck", label: "Truck" },
            { value: "generator", label: "Generator" },
            { value: "other", label: "Other" }
          ]
        },
        {
          name: "equipmentModel",
          label: "Equipment Model/Brand",
          type: "text",
          required: true,
          placeholder: "e.g., Caterpillar 320D, Volvo EC140D"
        },
        {
          name: "equipmentId",
          label: "Equipment ID/Serial Number",
          type: "text",
          required: true,
          placeholder: "Unique identifier for tracking"
        }
      ]
    },
    {
      name: "Usage Information",
      description: "Details about equipment usage",
      fields: [
        {
          name: "operationDate",
          label: "Operation Date",
          type: "date",
          required: true
        },
        {
          name: "operationHours",
          label: "Hours of Operation",
          type: "number",
          required: true,
          min: 0,
          max: 24,
          step: 0.1,
          placeholder: "Hours worked during the day"
        },
        {
          name: "fuelType",
          label: "Fuel Type",
          type: "select",
          required: true,
          options: [
            { value: "diesel", label: "Diesel" },
            { value: "gasoline", label: "Gasoline" },
            { value: "electric", label: "Electric" },
            { value: "hybrid", label: "Hybrid" }
          ]
        },
        {
          name: "fuelConsumption",
          label: "Fuel Consumption (Liters)",
          type: "number",
          required: true,
          min: 0,
          step: 0.1,
          placeholder: "Liters consumed"
        }
      ]
    }
  ],
  calculations: {
    emissionFactors: {
      diesel: 2.68,
      gasoline: 2.31,
      electric: 0.5,
      hybrid: 1.0
    },
    conditionMultipliers: {
      light: 0.8,
      normal: 1.0,
      heavy: 1.3,
      extreme: 1.6
    }
  }
}); 