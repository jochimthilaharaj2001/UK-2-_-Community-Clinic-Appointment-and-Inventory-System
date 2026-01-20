import db from '../../config/db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const loginPharmacist = async (req, res) => {
  try {
    console.log("LOGIN API HIT");
    console.log("BODY:", req.body);

    const { email, password } = req.body;

    const [rows] = await db.query(
      'SELECT * FROM pharmacists WHERE email = ?',
      [email]
    );

    console.log("DB CALLBACK HIT");

    if (!rows || rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const pharmacist = rows[0];

    const isMatch = await bcrypt.compare(password, pharmacist.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: pharmacist.id, role: 'pharmacist' },
      'secretkey',
      { expiresIn: '1d' }
    );

    res.json({
      token,
      pharmacist: {
        id: pharmacist.id,
        email: pharmacist.email,
        name: pharmacist.name,
        role: 'pharmacist'
      }
    });

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: 'Server error' });
  }
};
