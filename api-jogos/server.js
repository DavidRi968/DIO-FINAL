const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = express();
const cors = require('cors');
const PORT = 5000;

app.use(express.json());
app.use(cors());

let users = []; 
let jogos = [
  { id: 1, nome: "The Witcher 3", preco: 99.99, imagem: "https://upload.wikimedia.org/wikipedia/en/0/0c/Witcher_3_cover_art.jpg", descricao: "Um RPG épico de mundo aberto com uma narrativa envolvente.", avaliacao: 4.8 },
  { id: 2, nome: "Cyberpunk 2077", preco: 199.99, imagem: "https://upload.wikimedia.org/wikipedia/en/9/9f/Cyberpunk_2077_box_art.jpg", descricao: "Um jogo de RPG futurista com uma grande cidade cheia de segredos.", avaliacao: 4.0 },
  { id: 3, nome: "God of War", preco: 149.99, imagem: "https://upload.wikimedia.org/wikipedia/en/a/a7/God_of_War_4_cover.jpg", descricao: "Kratos e seu filho Atreus enfrentam desafios mitológicos nórdicos.", avaliacao: 4.9 },
  { id: 4, nome: "Red Dead Redemption 2", preco: 189.99, imagem: "https://upload.wikimedia.org/wikipedia/en/4/44/Red_Dead_Redemption_II.jpg", descricao: "Um jogo de ação e aventura no velho oeste, com um mundo vasto e detalhado.", avaliacao: 4.9 },
  { id: 5, nome: "GTA V", preco: 159.99, imagem: "https://upload.wikimedia.org/wikipedia/en/a/a5/Grand_Theft_Auto_V.png", descricao: "Ação e caos em um vasto mundo aberto com três protagonistas.", avaliacao: 4.7 },
];

const secretKey = "secrectKeyForJWT";

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  users.push({ username, password: hashedPassword });
  res.status(201).send("User registered");
});


app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username);
  if (!user) return res.status(400).send("User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).send("Invalid credentials");

  const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
  res.json({ token });
});


app.get('/jogos', (req, res) => {
  res.json(jogos);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
