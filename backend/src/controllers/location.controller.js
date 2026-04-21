import Location from '../models/location.model.js';

export const listLocations = async (req, res) => {
  try {
    const { active } = req.query;
    const where = {};
    if (active === 'true') where.active = true;
    const locations = await Location.findAll({
      where,
      order: [['name', 'ASC']],
    });
    res.json(locations);
  } catch (err) {
    console.error('listLocations error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const createLocation = async (req, res) => {
  try {
    const location = await Location.create(req.body);
    res.status(201).json(location);
  } catch (err) {
    console.error('createLocation error:', err);
    res
      .status(400)
      .json({ message: 'Failed to create location', error: err.message });
  }
};

export const updateLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const loc = await Location.findByPk(id);
    if (!loc) return res.status(404).json({ message: 'Location not found' });
    await loc.update(req.body);
    res.json(loc);
  } catch (err) {
    console.error('updateLocation error:', err);
    res.status(400).json({ message: 'Failed to update', error: err.message });
  }
};

export const deleteLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const loc = await Location.findByPk(id);
    if (!loc) return res.status(404).json({ message: 'Location not found' });
    await loc.destroy();
    res.json({ success: true });
  } catch (err) {
    console.error('deleteLocation error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
