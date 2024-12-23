import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

const STORED_HASH = '4f47b88398cd61d116ca3d13172a631999c6ab2798136f465f19fee7b2359974'; // SHA-256 de "Va058pt!"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { password } = req.body;
    const hash = crypto.createHash('sha256').update(password).digest('hex');
    if (hash === STORED_HASH) {
      res.status(200).json({ success: true });
    } else {
      res.status(401).json({ success: false, message: 'Mot de passe incorrect' });
    }
  } else {
    res.status(405).json({ message: 'Méthode non autorisée' });
  }
}