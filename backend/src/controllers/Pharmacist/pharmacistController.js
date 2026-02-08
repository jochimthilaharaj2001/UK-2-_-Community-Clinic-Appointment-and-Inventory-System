import db from '../../config/db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const loginPharmacist = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [result] = await db.query(
      'SELECT * FROM pharmacists WHERE email = ?',
      [email]
    );

    if (result.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const pharmacist = result[0];
    const isMatch = await bcrypt.compare(password, pharmacist.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: pharmacist.id, role: 'pharmacist' },
      'secretkey',
      { expiresIn: '1d' }
    );

    res.json({ token, pharmacist });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
