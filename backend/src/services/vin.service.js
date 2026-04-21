import axios from 'axios';

/**
 * Validates a VIN
 * @param {string} vin 
 * @returns {boolean}
 */
export const isValidVin = (vin) => {
  return typeof vin === 'string' && vin.length === 17;
};

/**
 * Decodes a VIN using the NHTSA vPIC API
 * @param {string} vin 
 * @returns {Promise<Object>} Decoded vehicle vehicle
 */
export const decodeVin = async (vin) => {
  if (!isValidVin(vin)) {
    throw new Error('Invalid VIN. Must be 17 characters.');
  }

  try {
    const response = await axios.get(
      `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/${vin}?format=json`
    );

    const data = response.data;
    if (!data.Results || data.Results.length === 0) {
      throw new Error('Could not decode VIN');
    }

    // Map the NHTSA results array to a more usable object
    const attributes = {};
    data.Results.forEach((item) => {
      if (item.Value && item.Value !== 'null') {
        attributes[item.Variable] = item.Value;
      }
    });

    // Check for error code in results
    if (attributes.ErrorCode && attributes.ErrorCode !== '0') {
        // Some errors are just info messages, but significant ones might block us
        // ErrorCode 0 means successful decoding
        // We will proceed but log it. check if crucial data is missing
    }

    // Map to our database schema fields
    const mappedData = {
      make: attributes['Make'],
      model: attributes['Model'],
      year: parseInt(attributes['Model Year']) || null,
      bodyType: mapBodyType(attributes['Body Class']),
      fuelType: mapFuelType(attributes['Fuel Type - Primary']),
      transmission: null, // API is often vague on this
      engineSize: parseFloat(attributes['Displacement (L)']) || null,
      horsepower: parseInt(attributes['Engine Brake (hp) From']) || null,
      drivetrain: mapDrivetrain(attributes['Drive Type']),
      door: parseInt(attributes['Doors']) || null,
      cylinder: parseInt(attributes['Engine Number of Cylinders']) || null,
      plantCountry: attributes['Plant Country'],
      vehicleType: attributes['Vehicle Type'],
      raw: attributes // Keep raw data just in case
    };

    return {
      success: true,
      data: mappedData
    };

  } catch (error) {
    console.error('VIN Decode Error:', error.message);
    throw new Error('Failed to decode VIN: ' + error.message);
  }
};

// Helper to map NHTSA Body types to our Enum
const mapBodyType = (nhtsaType) => {
  if (!nhtsaType) return null;
  const type = nhtsaType.toLowerCase();
  
  if (type.includes('sedan')) return 'sedan';
  if (type.includes('coupe')) return 'coupe';
  if (type.includes('sport utility') || type.includes('suv')) return 'suv';
  if (type.includes('hatchback')) return 'hatchback';
  if (type.includes('truck') || type.includes('pickup')) return 'truck';
  if (type.includes('van') || type.includes('minivan')) return 'minivan';
  if (type.includes('convertible') || type.includes('cabriolet')) return 'convertible';
  if (type.includes('wagon')) return 'wagon';
  if (type.includes('crossover')) return 'crossover';
  
  return null;
};

// Helper to map NHTSA Fuel types to our Enum
const mapFuelType = (nhtsaType) => {
  if (!nhtsaType) return null;
  const type = nhtsaType.toLowerCase();

  if (type.includes('gasoline')) return 'gasoline';
  if (type.includes('diesel')) return 'diesel';
  if (type.includes('electric')) return 'electric';
  if (type.includes('hybrid')) return 'hybrid';
  if (type.includes('hydrogen')) return 'hydrogen';

  return 'gasoline'; // Default fallback
};

// Helper to map Drivetrain
const mapDrivetrain = (nhtsaType) => {
  if (!nhtsaType) return null;
  const type = nhtsaType.toLowerCase();

  if (type.includes('4wd') || type.includes('four wheel')) return '4wd';
  if (type.includes('awd') || type.includes('all wheel')) return 'awd';
  if (type.includes('fwd') || type.includes('front')) return 'fwd';
  if (type.includes('rwd') || type.includes('rear')) return 'rwd';

  return null;
};
