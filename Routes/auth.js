
const express = require('express');
const router  = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// ── REGISTER (Galmaa'uu) ──────────────────────
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      error: 'Maqaa, email fi jecha-darbii galchi'
    });
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name } }
  });

  if (error) return res.status(400).json({ error: error.message });

  res.status(201).json({
    message: "✅ Galmaa'uu milkaa'eera!",
    user: { id: data.user.id, email, name }
  });
});

// ── LOGIN (Seenuu) ────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: 'Email fi jecha-darbii galchi'
    });
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

 if (error) return res.status(401).json({
    error: error.message
  });

  res.json({
    message: '✅ Simat! Kakuu Oromoo seentanii jirtu.',
    token: data.session.access_token,
    user: {
      id:    data.user.id,
      email: data.user.email,
      name:  data.user.user_metadata?.full_name
    }
  });
});

// ── LOGOUT (Ba'uu) ────────────────────────────
router.post('/logout', async (req, res) => {
  await supabase.auth.signOut();
  res.json({ message: "✅ Milkaa'inaan ba'ame" });
});

module.exports = router;