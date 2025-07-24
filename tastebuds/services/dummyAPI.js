import Router from 'express';

const router = Router();


router.post('/Places', (req, res) => {
  // Path to the dummy JSON file
  const filePath = path.join(process.cwd(), 'dummy-places-response.json');

  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    const jsonData = JSON.parse(data);

    res.status(200).json(jsonData);
  } catch (error) {
    console.error("Error reading dummy data:", error);
    res.status(500).json({ error: 'Failed to load dummy places data' });
  }
});

export default router;
